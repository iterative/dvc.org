---
title: October '21 Community Gems
date: 2021-10-26
description: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  data registries, working with DVC remotes, queued experiments, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML community. This month: data
  registries, working with DVC remotes, queued experiments, and more.
picture: 2021-10-26/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/october-21-community-gems/871
tags:
  - Data Registry
  - DVC Remotes
  - Queued Experiments
  - Pipelines
  - Git
---

### [Is a command to force reproduce a specific stage of a DVC pipeline?](https://discord.com/channels/485586884165107732/563406153334128681/893056918699008000)

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

There are a few ways you could do this. The simplest is a parametrized pipeline
with a `dvc.yaml` that could look something like:

```dvc
vars:
  - day: "20211001"
stages:
  featurize:
    cmd: python featurize.py ${day}
    deps:
    - raw/${day}.csv
    outs:
    - intermediate/${day}.csv
  combine:
    cmd: python combine.py
    deps:
    - intermediate
    outs:
    - combined.csv
```

You could also put the day variable into a parameters file if you don't want to
update directly in `dvc.yaml`. Check out the
[docs on templating](https://dvc.org/doc/user-guide/project-structure/pipelines-files#templating)
to learn more.

The last way we'll cover is to keep all of the previous days and use the
`foreach` syntax, which ensures your DAG still knows about all the previously
processed days:

```dvc
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
    - combined.csvÏ
```

Out of all these approaches, `foreach` might be the better way to go about it.
That way if you adjusted something in your featurize script, for example, it
would automatically reprocess every day's data.

### [What is the best practice for storing `stdout`?](https://discord.com/channels/485586884165107732/563406153334128681/893903023355613214)

There are a couple of ways to do this.

You could pipe the `stdout` to a file and then upload it like an output.

Or even better in the case of DVC, pipe each command `stdout` into a different
file with a unique name, like a timestamp, in a directory that becomes the stage
output. If optimizing storage space is a concern in case the `stdout` dumps grow
a lot, this is the best approach.

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

```dvc
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

### [What is the workflow if I want to remove some files from my dataset registry?](https://discord.com/channels/485586884165107732/485596304961962003/895192983366942740)

You can delete the files and then re-add them using `dvc add` or `dvc commit`.
It should be faster to re-add, as DVC won't re-add them to the cache nor will it
try to hash them. You can use either of those DVC commands to manage these
deletions.

Good question @MadsO!

### [We want to access a private Git repo using `dvc.api.read()`. How do I pass the credentials to DVC so that we can read DVC files from this repo?](https://discord.com/channels/485586884165107732/485596304961962003/894533078389784577)

Great question about the API @dashmote!

DVC uses the credentials regular Git would use, so you either need to pass SSH
keys into your Docker container or use GitHub's SSH URL.

You could pass your credentials into your container as environment variables and
then do something like:

```dvc
username = os.environ["GITHUB_USERNAME"]
token = os.environ["GITHUB_TOKEN"]
dvc.api.read(..., repo=f"https://{username}:{token}/...", ...)
```

The other option is to use the
`https://username:token@github.com/username/repo.git` URL format when you call
the API method.

### []()

### []()

---

https://media.giphy.com/media/8UF0EXzsc0Ckg/giphy.gif

At our November Office Hours Meetup we will be going over how to do stuff.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/280814318/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
