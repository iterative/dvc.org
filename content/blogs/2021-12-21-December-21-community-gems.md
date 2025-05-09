---
title: December '21 Community Gems
date: 2021-12-21
description: >
  A roundup of technical Q&A's from the DVC community. This month: comparing
  experiments, working with data, working with pipelines, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: comparing
  experiments, working with data, working with pipelines, and more.
picture: 2021-12-21/dec-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/december-21-community-gems/1001
tags:
  - Data Versioning
  - DVC Remotes
  - DVC API
  - DVC Stages
  - Community Gems
---

### [I'm using Google Drive as a remote storage and accidentally entered the verification from the wrong Google account. How can I edit that?](https://discord.com/channels/485586884165107732/563406153334128681/908437162150739978)

No problem @fireballpoint1! This happens sometimes.

You should be able to run the following command in your terminal and then
re-enter your credentials.

```dvc
$ rm .dvc/tmp/gdrive-user-credentials.json
```

That should give you a chance to enter the correct credentials when you try to
`dvc pull` again.

### [Can I add a `dvc remote` which refers to NAS by IP so I don't have to mount on every computer?](https://discord.com/channels/485586884165107732/563406153334128681/912667503283564544)

That's a new question for us @Krzysztof Begiedza!

If you enable the SSH service on your NAS, you can configure DVC to use it as an
SSH remote with `dvc remote add`.

There should also be DSM (Synology DiskStation Manager) packages for webdav as
well, if you prefer that over SSH. Just make sure that when you run
`dvc remote add -d storage <URL>`, your remote storage URL looks similar to
this.

```
webdav://<ip>/<path>
```

### [Can you selectively `dvc pull` data files?](https://discord.com/channels/485586884165107732/563406153334128681/913713923667148850)

Great question @Clemens!

You would run `dvc pull <file>` to get the files you want. You could also use
the `--glob` option on `dvc pull` and DVC will only pull the relevant files.

The command for that pull would be similar to this.

```dvc
$ dvc pull path/to/specific/file
```

You could also make a
[data registry](https://dvc.org/doc/use-cases/data-registries) and use
`dvc import` in other projects to get a specific dataset. That way you don't
have to do a granular pull.

### [What is the fastest way to get the specific value of a metric of an experiment based on experiment id?](https://discord.com/channels/485586884165107732/563406153334128681/916328260856590346)

That's a really good question @Kwon-Young!

You can always look through experiment metrics with `dvc exp show` and this
shows you all of the experiments you've run.

To get the metrics for a specific experiment or set of experiments, you'll need
the experiment ids and then you can use the Python API like this example.

```python
from dvc.repo import Repo

dvc = Repo(".")  # or Repo("path/to/repo/dir")
metrics = dvc.metrics.show(revs=["exp-name1", "exp-name2", ...])
```

This returns a Python dictionary that contains what gets displayed in
`dvc metrics show --json` except you're able to specify the experiments you
want.

### [Is it possible to run the whole pipeline but only for one element of the `foreach`?](https://discord.com/channels/485586884165107732/563406153334128681/915986804577026088)

Another great question from @vgodie!

If your stages look something like this for example:

```yaml
stages:
  cleanups:
    foreach: # List of simple values
      - raw1
      - labels1
      - raw2
    do:
      cmd: clean.py "${item}"
      outs:
        - ${item}.cln
  train:
    foreach:
      - epochs: 3
        thresh: 10
      - epochs: 10
        thresh: 15
    do:
      cmd: python train.py ${item.epochs} ${item.thresh}
```

You should try the following command:

```dvc
$ dvc repro cleanups@labels1
```

This will run your whole pipeline, but only with `labels1` in the `cleanups`
stage.

### [Is it possible to pull experiments from the remote without checking out the base commit of those experiments?](https://discord.com/channels/485586884165107732/485596304961962003/910481311905505290)

Thanks for the question @mattlbeck!

You should be able to do this with `dvc exp pull origin exp-name`.

If you have experiments with the same name on different commits, using
`exp-name` won't work since it defaults to selecting the one based on your
current commit if there are duplicate names.

To work around this, you can use the full refname, like
`refs/exps/e7/78ad744e8d0cd59ddqc65d5d698cf102533f85/exp-6cb7`, to specify the
experiments that you want to work with.

### [How should I handle checkpoints in PyTorch Lightning with DVCLive?](https://drive.google.com/file/d/1t0wPowk-PUinNjV4xchrzPZh7xsI8i37/view?usp=sharing)

This is a really good question that came from one of our Office Hours talks!
Thanks [Ilia Sirotkin](https://www.linkedin.com/in/sirily/)!

We have an [open issue](https://github.com/iterative/dvclive/issues/170) we
encourage you to follow for more details and to even contribute!

Python Lightning handles checkpoints differently from other libraries. This
affects the way metrics logging is executed and how models are saved.

You can write a custom callback to control saving everything and track it with
DVC and this is the workaround we suggest. You can implement the
`after_save_checkpoint` method and save the model file.

The way this works is by breaking your training process into small stages. You
should specify the stage’s checkpoint as the output of the stage and set it as a
dependency for the next stage. That way if something breaks, the `dvc repro`
command will resume your experiment from the last stage.

Your pipeline might look something like this:

```yaml
stages:
  stage_0:
    cmd: python train.py
    outs:
      - checkpoints/checkpoint_epoch=0.ckpt
  next:
    foreach:
      - prev: 0
        next: 1
      - prev: 1
        next: 2
    do:
      cmd: python train.py --checkpoint ${item.prev}
      deps:
        - checkpoints/checkpoint_epoch=${item.prev}.ckpt
      outs:
        - checkpoints/checkpoint_epoch=${item.next}.ckpt
```

Then you'll need to reuse the `ModelCheckpoint` that is included in
`pytorch_lightning` to capture the checkpoints. Here's a snippet of what that
could look like in your training script:

```python
# set checkpoint path
ckpt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "checkpoints"))

# checkpoints will be saved to checkpoints/checkpoint_epoch={epoch_number}.ckpt
cp = pl.callbacks.model_checkpoint.ModelCheckpoint(
    monitor="train_loss_epoch",
    save_top_k=1,
    dirpath=ckpt_path,
    filename='checkpoint_{epoch}')
```

### [Is there a feature for DVC to only sample and cache a subset of the tracked dataset, e.g. 10000 lines of a large file?](https://discord.com/channels/485586884165107732/485596304961962003/917778575845900340)

Really great question @Abdi!

You should be able to use the streaming capability of the DVC API to achieve
this goal.

Here is an example of a Python script that would do this:

```python
from dvc.api import open as dvcopen

with dvcopen('data',f'{repo_url}') as fd:
    for line in fd:
        print(line)
```

---

![Done Tyler The Creator GIF](https://media.giphy.com/media/h5Ct5uxV5RfwY/giphy.gif)

At our January Office Hours Meetup we will be looking at machine learning
workflows and Neovim-DVC plugin!
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282663146/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
