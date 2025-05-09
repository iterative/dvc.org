---
title: October '21 Community Gems
date: 2021-10-28
description: >
  A roundup of technical Q&A's from the DVC community. This month: DVC stages,
  working with outputs, DVC API, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: DVC stages,
  working with outputs, DVC API, and more.
picture: 2021-10-28/oct-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/october-21-community-gems/931
tags:
  - Data Versioning
  - DVC API
  - Pipelines
  - Community Gems
---

### [Is there a command to force reproduce a specific stage of a DVC pipeline?](https://discord.com/channels/485586884165107732/563406153334128681/893056918699008000)

Good question @wickeat!

You can use `dvc repro -f <stage_name>`, although this will reproduce the
earlier dependency stages in the pipeline up to that point. If you only want to
reproduce a single target stage, you can add `-s/--single-item` to the
`dvc repro` command.

### [How do you manage a `dvc.yaml` file for a project that's going to be a big, sparse DAG?](https://discord.com/channels/485586884165107732/563406153334128681/893487527749623859)

This an awesome use case from @Ian!

Let's say we have this scenario:

- A new data set is delivered to you every day
- It needs to be featurized (does not depend on previous days' data)
- Subsequent stage depends on all days

The recommended approach is to keep all of the previous days and use the
`foreach` syntax, which ensures your DAG still knows about all the previously
processed days:

```yaml
stages:
  featurize:
    foreach:
      - 20210101
      - 20210102
      - 20210103
    do:
      cmd: python featurize.py ${item}
      deps:
        - raw/${item}.csv
      outs:
        - intermediate/${item}.csv
  combine:
    cmd: python combine.py
    deps:
      - intermediate
    outs:
      - combined.csv
```

That way if you adjusted something in your featurize script, for example, it
would automatically reprocess every day's data.

### [What is the best practice for capturing and saving `stdout`?](https://discord.com/channels/485586884165107732/563406153334128681/893903023355613214)

The best practice when using DVC is to pipe each command `stdout` into a
different file with a unique name, like a timestamp, in a directory that becomes
the stage output.

If optimizing storage space is a concern, in case the `stdout` dumps grow a lot,
this is what we recommend.

Here's an example of what that might look like if you're using a tool like
`tee`.

```yaml
train:
  cmd: python src/train.py data/features model.pkl | tee -a 20211021_model.pkl
  deps:
    - data/features
    - src/train.py
  params:
    - train.min_split
    - train.n_est
    - train.seed
  outs:
    - models/20211026_model.pkl
```

This will output the `stdout` from the train stage in the terminal and also save
it in a new file with the timestamp as part of the title.

That was a helpful question. Thanks @gregk0!

### [There is a file in our pipeline that needs to be manually modified and then used as the input to other stages in the pipeline. What would be the best approach for this with DVC?](https://discord.com/channels/485586884165107732/563406153334128681/894577842363445308)

This is another great use case. Thanks @omarelb!

Let's say that you have a process similar to this.

- Run the first stage of the pipeline, for example a stage called `cleaning`
- Inspect its output, `lexicon.txt`, and modify it if necessary
- The modified version of `lexicon.txt` is then cached and used as input to
  following stages of the pipeline

You can copy the output and modify and commit it in the copied location so the
first stage and its output are separate from the modified file and subsequent
stages.

If you want to link the first stage to the rest of the pipeline, you could have
your 2nd stage be something like:

```yaml
manual:
  cmd: |
    # To generate lexicon_modified.txt:
    # 1. Run `cp lexicon.txt lexicon_modified.txt`.
    # 2. Check and modify lexicon_modified.txt.
    # 3. Run `dvc commit manual`.
  deps:
    - lexicon.txt
  outs:
    - lexicon_modified.txt
```

To clarify, if you put that `manual` stage into your `dvc.yaml`, it should
connect the whole pipeline. Each time you run `dvc repro` and the first stage
generates a new `lexicon.txt`, you will get
`ERROR: failed to reproduce 'dvc.yaml': output 'lexicon_modified.txt' does not exist`
because the manual stage doesn't generate the expected output.

You can then manually copy, modify, and commit your new `lexicon_modified.txt`
and run `dvc repro` again to run the rest of the pipeline.

### [What is the workflow if I want to remove some files from my dataset registry with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/895192983366942740)

In this case, assume that the data was added as a folder containing images,
which means that there is a single `.dvc` for the whole folder. You don't need
to remove the `.dvc` file that's tracking the data in that folder.

You can delete the files you want to remove and then re-add the folder using
`dvc commit`. Here's what an example of what that flow might look like.

- You `git clone` your data registry.
- Then `dvc pull` your data.
- Delete the files you want to remove.
- Run `dvc commit` and `git commit` to save your changes.

It should be faster to commit, as DVC won't re-add the files to the cache nor
will it try to hash them.

Good question @MadsO!

### [We want to access a private Git repo using `dvc.api.read()` in a Docker container. How do I pass the credentials to DVC so that we can read DVC files from this repo?](https://discord.com/channels/485586884165107732/485596304961962003/894533078389784577)

Great question about the API @dashmote!

There are a couple different ways to handle this.

The first option is to use SSH. You'll need to pass GitHub SSH keys into your
Docker container and use the `git@github.com:username/repo.git` URL format when
you call the API method.

The other option is to use HTTP. You need to use the
`https://username:token@github.com/username/repo.git` URL format when you call
the API method.

You could pass your credentials into your container as environment variables and
then do something like:

```python
username = os.environ["GITHUB_USERNAME"]
token = os.environ["GITHUB_TOKEN"]
dvc.api.read(..., repo=f"https://{username}:{token}/...", ...)
```

### [Is there a clean way to handle multiple models in the same repo that are trained using the same pipeline?](https://discord.com/channels/485586884165107732/563406153334128681/895368479853649930)

Let's say your project looks something like this:

```dvc
├── data
│   ├── customer_1
│   │   ├── input_data.txt
│   │   ├── input_params.yaml
│   │   └── output
│   │       └── model.pkl
│   └── customer_2
│       ├── input_data.txt
│       ├── input_params.yaml
│       └── output
│           └── model.pkl
├── dvc.lock
├── dvc.yaml
└── train_model.py
```

The simplest way is to copy the `dvc.yaml` into each model's separate directory,
like this:

```dvc
├── data
│   ├── customer_1
│   │   ├── input_data.txt
│   │   ├── input_params.yaml
│   │   ├── dvc.yaml
│   │   ├── dvc.lock
│   │   └── output
│   │       └── model.pkl
│   └── customer_2
│       ├── input_data.txt
│       ├── input_params.yaml
│       ├── dvc.yaml
│       ├── dvc.lock
│       └── output
│           └── model.pkl
└── train_model.py
```

Another potential solution is try templating. We'll have a `dvc.yaml` in the
root of the project and add `vars` to define the model you want to train. Then
we'll update the `train` stage to use the `vars` like this:

```yaml
vars:
  - model_name: 'customer_2'

stages:
  train:
    cmd: python train.py
    deps:
      - data/${model_name}/input_data.txt
    params:
      - data/${model_name}/input_params.yaml:
          - batch_size
          - ...
```

You can
[learn more about templating in the docs](https://dvc.org/doc/user-guide/project-structure/pipelines-files#templating).
It essentially lets you add variables to the `dvc.yaml` to dynamically set
values for your stages.

Thanks for the great question @omarelb!

---

![My Work Is Done Reaction GIF by SpongeBob SquarePants](https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif)

At our November Office Hours Meetup we will be going over internal Kaggle
competitions and PyTorch Lightening integration.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/281355245/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
