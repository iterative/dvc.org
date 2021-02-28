# exp branch

Commit the results from any [experiment](/doc/command-reference/exp) to Git, in
a new branch (which will become the current <abbr>workspace</abbr>).

## Synopsis

```usage
usage: dvc exp branch [-h] [-q | -v] experiment branch

positional arguments:
  experiment     Experiment to be promoted
  branch         Git branch name to use
```

## Description

Makes a Git branch off the last commit (`HEAD`) based on the given `experiment`,
using the `branch` name provided.

This is equivalent to using `dvc exp apply` (applies the results from any
experiment to the workspace) followed by Git branching and committing:

```dvc
$ dvc exp apply experiment
$ git checkout -b branch
$ git commit ...
```

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.
