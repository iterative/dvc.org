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
[master] $ git checkout -b branch
[branch] $ dvc exp apply experiment
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
