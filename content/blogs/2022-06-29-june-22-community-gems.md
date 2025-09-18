---
title: June '22 Community Gems
date: 2022-06-29
description: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  working with the DVC cache, DVC data and remotes, using DVC programmatically,
  and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  working with the DVC cache, DVC data and remotes, using DVC programmatically,
  and more.
picture: 2022-06-29/june-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/june-22-community-gems/1226
tags:
  - DVC Remotes
  - Pipelines
  - CML
  - DVC Cache
  - Community Gems
---

## [Is there a shorthand command to commit changes to all modified files in DVC without manually adding them all individually?](https://discord.com/channels/485586884165107732/563406153334128681/981498675689828362)

Thanks for the question @Ramnath T!

If you already have data tracked by DVC, the `dvc commit` command adds all the
changes to those files or directories without having to name each target. You'll
still need to remember to commit any other changes you've made to Git as well.

If you don't have data tracked by DVC, run `dvc add <file name or folder name>`
and the data will be added to your local cache and no commit is needed. This is
how we make DVC aware of any new data we want versioned.

When you run `dvc add`, a file hash will be calculated, the file content will be
moved to the cache, and a `.dvc` file will be created to start tracking the
added data. If you're working with remotes using the `--to-remote` option, you
can skip the local cache entirely and move the file contents directly to your
remote storage.

## [How can I connect Iterative Studio to a remote repo on a private network, like a GitLab server?](https://discord.com/channels/485586884165107732/563406153334128681/981543978644172830)

Good question about [Iterative Studio](https://studio.datachain.ai/) from
@LilDataScientist!

This is something that our users asked quite a bit, so we wrote up a whole guide
about custom GitLab server connections. It's a quick walkthrough of how to set
up the permissions you'll need and connecting your team to Studio.

## [How does `dvc get-url` interact with the cache compared to `dvc import-url`?](https://discord.com/channels/485586884165107732/563406153334128681/981862313076346920)

This is an awesome question from @Gema Parreno!

When you run `dvc get-url`, it downloads the file/directory to your local file
system. It's _not_ tracking the downloaded data with a `.dvc` file. It's just
pulling that data from some source to your file system. If you want to download
a file or directory without needing a DVC project, you can use the `dvc get-url`
command.

On the other hand, when you run `dvc import-url`, the local `cache` folder
inside of `.dvc` will be updated. This is similar to running `dvc get-url` and
`dvc add` together except that `dvc import-url` also saves a link to the
original file/directory location so that if it changes, you can download the
updated data.

There is one more option to bypass the local cache and transfer data directly to
your remote storage using `dvc import-url <url> --to-remote`. This doesn't
download anything to your local cache so it's another way to transfer data
between remotes.

## [If an image is present in different directories in different projects, will the shared cache store them both as one hash or will their different paths mean the same image appears twice in the cache?](https://discord.com/channels/485586884165107732/563406153334128681/984408209387298837)

Great question about the cache from @paulwrightkcl!

DVC will index the whole directory, but there will only be one hash per file. So
the same image will only appear once in the cache. What _will_ be duplicated in
the cache is the `.dir` hash that DVC uses internally as the directory tree
representation.

In summary, the image file is only stored in the shared cache once unless it's
modified in one of the directories.

## [Is it possible to limit which columns show for experiments in the metrics table?](https://discord.com/channels/485586884165107732/563406153334128681/985448515402616842)

Nice question from @DylanTF!

You can use `dvc exp show --drop` (or `--keep`) to decide what to hide (or
show). For example, if you have a table like this:

```dvctable
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**   neutral:**Created**        metric:**avg_prec**   metric:**roc_auc**   param:**train.seed**   param:**train.n_est**   param:**train.min_split**   dep:**./clf**   dep:**./data**    dep:**./data/train.pkl**   dep:**./src/train.py**   dep:**src/evaluate.py**
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace    -                     -         -   20210428     300           75                -       a9bb63e   aded63c            bdc3fe9          b0ef2a1
  mlem-serve   Jun 16, 2022    0.76681   0.38867   20210428     300           75                -       a9bb63e   aded63c            bdc3fe9          b0ef2a1
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

You could clean it up with a command like this:

```dvc
$ dvc exp show --drop 'Created|train.seed|./clf|./data/*|./src/train.py|src/evaluate.py'
```

Then get a table like this:

```dvctable
 ─────────────────────────────────────────────────────────────────
  neutral:**Experiment**   metric:**avg_prec**   metric:**roc_auc**   param:**train.n_est**   param:**train.min_split**
 ─────────────────────────────────────────────────────────────────
  workspace           -         -   300           75
  mlem-serve    0.76681   0.38867   300           75
 ─────────────────────────────────────────────────────────────────
```

Alternatively, you can run the following command to only show the columns that
have changed in the experiment run:

```dvc
$ dvc exp show --only-changed
```

This will produce a table similar to this one:

```dvctable
 ─────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**   neutral:**Created**        metric:**avg_prec**   metric:**roc_auc**  param:**train.n_est**   dep:**src/train.py**
 ─────────────────────────────────────────────────────────────────────────────
  workspace    -                     -         -   325           94279e0
  mlem-serve   Jun 16, 2022    0.76681   0.38867   300           bdc3fe9
 ─────────────────────────────────────────────────────────────────────────────
```

You can also look at/edit these tables with the
[DVC VS Code extension](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)!
If you're interested in more advanced visualizations, you should try out
[Iterative Studio](https://studio.datachain.ai/#features).

## [Is it possible to create, commit, and push updates to datasets using DVC with Python instead of the command line?](https://discord.com/channels/485586884165107732/563406153334128681/988895726257991740)

Fantastic question from @wlu07!

Yes, we do have an internal `Repo` class to do DVC operations using Python. You
can refer to the
[GitHub repo for the DVC CLI commands](https://github.com/iterative/dvc/tree/main/dvc/commands)
to see how the CLI arguments are translated into the `Repo` function arguments
and you can see how to use some of the
[`Repo` methods in our docs](https://dvc.org/doc/api-reference).

Here's an example of how you might run DVC commands using Python:

```python
from dvc.repo import Repo

repo = Repo(".")

repo.add("test_dataset.csv")

repo.push()
```

Keep in mind that `dvc.repo.Repo` is not an official public API, so there is no
guarantee it will always be in stable state.

## [How can I write generated artifacts back to a GitHub repo after a GitHub workflow is finished?](https://discord.com/channels/485586884165107732/728693131557732403/983379949023006750)

Wonderful CML question from @Fourtin!

If you want to add the artifact to your repo just like you would a file, then
you should check out the [`cml pr <file>` command](https://cml.dev/doc/ref/pr).
You can use this to merge pull requests to the same branch the workflow was
triggered from.

For example, if you run a command like:

```dvc
$ cml pr --squash train.py
```

It will run `git add train.py`, commit the change, create a new branch, open a
pull request, and squash and merge it.

## [Is there a way to programmatically update the content of `params.py`?](https://discord.com/channels/485586884165107732/563406153334128681/987004036995764304)

Thanks for asking this @petek!

If you have a `params.py` file like this:

```python
class TrainTestSplit:
    FOLDER = "data/train_test_split"
    SPLIT_METHOD = "proportional"
```

In DVC, you can update the params and run `dvc exp run --set-param <param>`.
Here's an example of what that might look like:

```dvc
$ dvc exp run --set-param params.py:TrainTestSplit.SPLIT_METHOD="proportional"
```

_Note:_
[It may not be able to update Python parameters correctly](https://dvc.org/doc/command-reference/params#examples-python-parameters-file).
Because of this, we recommend you use `params.yaml` files.

If you need a pure Python solution, you could try something like this:

```python
from dvc.utils.serialize import modify_py

with modify_py("params.py") as d:
    d["key"] = "value"
```

---

![Duck Dynasty GIF by DefyTV](https://media.giphy.com/media/pdSncNyYgaH0wqaCqp/giphy.gif)

Keep an eye out for our next Office Hours Meetup! Make sure you stay up to date
with us to find out what it is!
[Join our group](https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/)
to stay up to date with specifics as we get closer to the event!

Check out [our docs](https://dvc.org/doc) to get all your DVC and CML questions
answered!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to chat with the
community!
