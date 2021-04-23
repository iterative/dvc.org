# exp branch

Commit the results from an [experiment](/doc/command-reference/exp) in a new Git
branch.

## Synopsis

```usage
usage: dvc exp branch [-h] [-q | -v] experiment branch

positional arguments:
  experiment     Experiment to commit/merge
  branch         Git branch name to use
```

## Description

Makes a named Git
[`branch`](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
containing the target `experiment` (making it
[persistent](/doc/user-guide/experiment-management#persistent-experiments)). The
branch is based on the commit that was active (`HEAD`) at the time that the
target experiment was run.

This command is useful, for example, in cases where `dvc exp apply` fails due to
significant diversion between the project version at the time of the experiment
run and the current <abbr>workspace</abbr>.

Note that `dvc exp branch` **does not** switch into the new branch created. It's
equivalent to:

```bash
[master] $ git checkout -b <branch>
[branch] $ dvc exp apply <experiment>
[branch] $ git add . && git commit
[branch] $ git checkout master
```

For [checkpoints](/doc/command-reference/exp/run#checkpoints), the new branch
will contain multiple commits (the checkpoints).

To switch into the new branch, use `git checkout branch` and `dvc checkout`. Or
use `git merge branch` to merge it into another existing project branch (e.g.
`master`).

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Make a persistent branch from an experiment

> This example is based on our [Get Started](/doc/start/experiments), where you
> can find the actual source code.

Let's say we have run 3 experiments in our project:

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

We may want to branch-off `exp-1dad0` for a separate experimentation process
(based on 2000 `max_features`).

```dvc
$ dvc exp branch exp-1dad0 maxf-2000
Git branch 'maxf-2000' has been created from experiment 'exp-1dad0'.
To switch to the new branch run:
        git checkout my-branch
```

We can inspect the result with Git:

```dvc
$ git branch
* master
  maxf-2000
```

`maxf-2000` can now be checked out, merged, rebased, pushed, etc. like any other
Git branch.
