# exp branch

Apply the changes from a previously run experiment into the workspace.

## Synopsis

```usage
usage: dvc exp branch [-h] [-q | -v] experiment branch

positional arguments:
  experiment     Experiment to be promoted.
  branch         Git branch name to use.
```

## Description

This command will directly promote an experiment to a Git branch.

## Options

- `experiment` - name of the experiment to be promoted.

- `branch` - Git branch name to use for the promoted experiment.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Promote an experiment

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project workspace:

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

We now wish to promote the results of experiment `1dad0d2` to a new Git branch
`my-branch`.

```dvc
$ dvc exp branch exp-1dad0 my-branch                                                                                                             ⏎
Git branch 'my-branch' has been created from experiment 'exp-70841'.
To switch to the new branch run:

        git checkout my-branch
```

We can inspect the result with Git:

```dvc
$ git --no-pager branch -l
* master
  my-branch
```

The resulting branch can now be merged, rebased, pushed, etc. like any other Git
branch.
