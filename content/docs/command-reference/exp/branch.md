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

Makes a
[Git branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
off the last commit (`HEAD`) based on the given `experiment`, using the `branch`
name provided. This makes the given experiment
[persistent](/doc/user-guide/experiment-management#persistent-experiments) in
the repo.

In most cases this is similar to using `dvc exp apply` (applies the `experiment`
results to the workspace) followed by Git branching and committing, except that
`dvc exp branch` **does not** switch into the created `branch`. Equivalent to
this:

```bash
[master] $ git checkout -b <branch>
[branch] $ dvc exp apply <experiment>
[branch] $ git add . && git commit
[branch] $ git checkout master
```

For [checkpoints](/doc/command-reference/exp/run#checkpoints), the `experiment`
(custom Git branch with multiple commits) is merged into the new `branch`.

To switch into the new branch, use `git checkout branch` and `dvc checkout`.

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Make a persistent branch from an experiment

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project:

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
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

`maxf-2000` can now be merged, rebased, pushed, etc. like any other Git branch.
