# exp branch

Commit the results from an [experiment](/doc/command-reference/exp) in a new Git
branch, which will become the <abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc exp branch [-h] [-q | -v] experiment branch

positional arguments:
  experiment     Experiment to be promoted
  branch         Git branch name to use
```

## Description

Makes a
[Git branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
off the last commit (`HEAD`) based on the given `experiment`, using the `branch`
name provided. The new branch is switched into (`git checkout`).

In most cases this is equivalent to using `dvc exp apply` (applies the
`experiment` results to the workspace) followed by Git branching and committing:

```dvc
$ dvc exp apply experiment
$ git checkout -b branch
$ git add . && git commit
```

For [checkpoints](/doc/command-reference/exp/run#checkpoints), the `experiment`
(custom Git branch) is merged into the new `branch`.

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.
