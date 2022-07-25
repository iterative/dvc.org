---
title: July '22 Community Gems
date: 2022-07-26
description: >
  A roundup of technical Q&A's from the DVC community. This month: deploying
  models MLEM, DVC data and remotes, DVC stages and plots, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: deploying
  models MLEM, DVC data and remotes, DVC stages and plots, and more.
picture: 2022-07-26/july-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/july-22-community-gems/1261
tags:
  - DVC Remotes
  - Pipelines
  - CML
  - DVC Cache
  - Community
---

## [How can I track a new file added to my `data` folder if the `data` folder is already tracked by DVC, yet ignored by Git?](https://discord.com/channels/485586884165107732/485596304961962003/983278896587894804)

Great question on how DVC handles data tracking from @NgHoangDat!

Since you already track the `data` folder, when you add a new file into it, all
you need to do is update your DVC history. You can use either `dvc add data` or
`dvc commit` to start tracking the new file.

DVC will also only recalculate the changed files. If you add or modify a small
number of files in that folder, the update will not take very long.

## [What would be the best method to get the remote URL of a given dataset inside a Python environment?](https://discord.com/channels/485586884165107732/485596304961962003/984870485668008007)

Wonderful question from @come_arvis!

You can use the `get_url` method of the
[DVC Python API](https://dvc.org/doc/api-reference) to do this. Here's an
example of a script you might run to get the remote URL.

```python
import dvc.api

resource_url = dvc.api.get_url(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry'
    )

print(resource_url)

# https://remote.dvc.org/dataset-registry/a3/04afb96060aad90176268345e10355
```

This URL is built with the remote URL from the project configuration file,
`.dvc/config`, and the `md5` file hashes stored in the `.dvc` file corresponding
to the data file or directory you want the storage location of.

## [I'm excited about MLEM helping expose API endpoints to our model, but heard it was experimental. Where can I learn more about how to deploy models with this tool?](https://discord.com/channels/485586884165107732/563406153334128681/992517466662117386)

Great question from @raveman^2!

There are a few ways you can use expose API endpoints to your model:

- Run `mlem serve` to generate a FastAPI endpoint with your model.
- Export the model as a Python package for your own custom-built API.
- The experimental deploy to Heroku.

You can find more details here in the MLEM docs: https://mlem.ai/doc/get-started

You can also see an example of deploying a model with MLEM in this
[blog post tutorial](https://dvc.org/blog/serving-models-with-mlem).

## [How do I revert a `dvc add` command to stop tracking data?](https://discord.com/channels/485586884165107732/563406153334128681/993111134896918599)

This is a good question from @Nwoke!

If you have accidentally added the wrong directory or files for DVC to track,
you can easily remove them with the `dvc remove` command. This is used to remove
the `.dvc` file and ensure that the original data file is no longer being
tracked. Here's an example of this command being used:

```dvc
$ dvc remove data.csv.dvc
```

Sometimes when you stop tracking data, you also want to remove it from your
cache. You can do this with the `dvc gc` command, which will remove all data,
not just the target of `dvc remove`. If you want to remove all of the data and
its previous versions from the cache, you can do that with the following
command:

```dvc
$ dvc gc -w
```

The `-w` option only keeps the files and directories referenced in the
workspace, so once you have removed the data you don't want to track, this is
how DVC knows what to keep and what to discard.

You can learn more about removing tracked data in
[the docs here](https://dvc.org/doc/user-guide/how-to/stop-tracking-data).

## [Is it normal for the `outs` of a stage to be removed when `dvc repro` is run?](https://discord.com/channels/485586884165107732/563406153334128681/993781745524691087)

Fantastic question from @Nish!

This is the expected behavior of DVC. It removes the `outs` of a stage unless
the `persist:true` value is set for that output. You can learn more about how
this works in
[our docs here](https://dvc.org/doc/user-guide/project-structure/dvcyaml-files#output-subfields).
Here's an example of a stage with the `persist` value set.

```yaml
stages:
  train:
    cmd: date > data/external/date
    outs:
      - data/external:
          persist: true
```

Even if you don't persist your `outs`, you can still check out an older version
of the pipeline to get older `outs` with `dvc checkout`. This is based on what's
in the `dvc.lock` and `.dvc` files and it will update your workspace to match
the experiment you check out. This is usually run after checking out a different
Git branch. So the flow might look like:

```dvc
$ git checkout experiment-branch
$ dvc checkout
```

These commands allow you to get the `dvc.lock` and `.dvc` files for the
experiment you want to go back to from your Git history. Then it uses DVC to get
your data to the version you want and reproduce your entire experiment. You can
learn more about these details in
[the `dvc checkout` docs here](https://dvc.org/doc/command-reference/checkout).

## [Is there a way to have a plot with multiple y-axes?](https://discord.com/channels/485586884165107732/485596304961962003/994685566698410055)

Wonderful question from @shortcipher3!

If you update DVC to version `2.12.1` and higher, you should be able to define
multiple y-axes in your DVC pipeline. Here's an example of how this may look in
a `dvc.yaml`:

```yaml
# dvc.yaml
stages: ...
plots:
  some_file.csv:
    x: x_column_name
    y: [col1, col2, col3]
  # alternative 1:
  multiple_rocs:
    x: x_column_name
    y:
      some_file.csv: [col1, col2, col3]
  # in case of multiple files:
  multiple_rocs_from_multiple_files:
    x: x_column_name
    y:
      file1.csv: [col1, col2]
      file2.csv: [col3]
```

A quick note, make sure that `plots` is on the same level as `stages` in your
`dvc.yaml` file.

## [How do you structure the `dvc.yaml` file to run in stages in a specific order?](https://discord.com/channels/485586884165107732/563406153334128681/991000853278232616)

Awesome question from @srb302!

You would need to set up outputs and dependencies for each stage. So a stage
that is run first would generate an output and the stage that is suppose to run
second would use the first stage's output as a dependency.

Otherwise, DVC does not guarantee any particular execution order for stages
which are independent of each other. DVC determines the structure of your DAG
based on file outputs and dependencies and there isn't another way to enforce
order of stage execution in DVC.

## [How do I know when I should track a file with Git or DVC?](https://discord.com/channels/485586884165107732/485596304961962003/993120910095699978)

This is a really good question from @vadim.sukhov!

Let's take a look at an example `dvc.yaml`.

```yaml
stages:
  evaluate:
    ...
    plots:
      - prc.json:
          cache: false
          x: recall
          y: precision
      - roc.json:
          cache: false
          x: fpr
          y: tpr
```

In this scenario, the `prc.json` and `roc.json` files are **not** being tracked
by DVC because of the `cache: false` value. Since these files aren't tracked by
DVC, they aren't saved to a remote storage location outside of Git, like data
files are. So if you have `cache: false` on a file that you want to keep track
of, you'll need to Git commit them to your project.

---

https://media.giphy.com/media/pdSncNyYgaH0wqaCqp/giphy.gif

Keep an eye out for our next Office Hours Meetup! Make sure you stay up to date
with us to find out what it is!
[Join our group](https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/)
to stay up to date with specifics as we get closer to the event!

Check out [our docs](/doc) to get all your DVC, CML, and MLEM questions
answered!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to chat with the
community!
