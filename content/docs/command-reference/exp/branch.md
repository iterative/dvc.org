# exp branch

Commit the results from an [experiment](/doc/command-reference/exp) in a new Git
branch.

## Synopsis

```usage
usage: dvc exp branch [-h] [-q | -v] experiment [branch]

positional arguments:
  experiment     Experiment to turn into a branch
  branch         Optional name for the new Git branch. Defaults to '{experiment-name}-branch'
```

## Description

Creates a new [Git branch] containing the target `experiment` from the
experiment's baseline (`HEAD` at the time the experiment was run).

If you don't provide a `branch` name, the default one will be based on the name
of the `experiment`.

<admon type="info">

Note that DVC **does not** switch into the new `branch` automatically.

</admon>

`dvc exp branch` is useful to make an experiment [persistent] without modifying
the workspace so they can be continued, [stored and shared] in a normal Git +
DVC workflow.

To switch to the new branch, use `git checkout branch` and `dvc checkout`. Or
use `git merge branch` and `dvc repro` to combine it with your current project
version.

[git branch]:
  https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
[persistent]:
  /doc/user-guide/experiment-management/sharing-experiments#persist-experiment
[stored and shared]:
  /doc/start/data-management/data-versioning#storing-and-sharing

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Make a persistent branch from an experiment

<admon type="info">

This example is based on [our Get Started], where you can find the actual source
code.

[our get started]: /doc/start/experiments

</admon>

Let's say we have run 3 experiments in our project:

```cli
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**               neutral:**Created**           metric: **auc**   param:**featurize.max_features**   param:**featurize.ngrams**
 ────────────────────────────────────────────────────────────────────────────────────────────
  workspace                -              0.61314   1500                     2
  10-bigrams-experiment    Jun 20, 2020   0.61314   1500                     2
  ├── major-mela           Oct 21, 2020   0.61314   1500                     2
  ├── gluey-leak           Oct 09, 2020   0.57756   2000                     2
  └── ochre-dook           Oct 09, 2020   0.51676   500                      2
 ────────────────────────────────────────────────────────────────────────────────────────────
```

We can create a branch from `gluey-leak`:

```cli
$ dvc exp branch gluey-leak
Git branch 'gluey-leak-branch' has been created from experiment 'gluey-leak'.
To switch to the new branch run:
        git checkout exp-gluey-leak
```

And inspect the result with Git:

```cli
$ git branch
* master
  gluey-leak-branch
```

`gluey-leak-branch` can now be checked out, merged, rebased, pushed, etc. like
any other Git branch.
