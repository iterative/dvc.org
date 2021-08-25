# exp remove

Delete specific `dvc experiments` from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp remove [-h] [-q | -v] [--queue | -A]
                      [experiment [experiment ...]]

positional arguments:
   experiment    Experiments to remove.
```

## Description

Deletes one or more experiments, indicated by name (see `dvc exp run`).

With `--queue`, the list of experiments awaiting execution is cleared instead.

> Note that all the checkpoints in an experiment are removed by this command.

## Options

- `--queue` - remove all experiments that haven't been run yet (defined via
  `dvc exp run --queue`).

- `-A`, `--all` - remove all experiments (includes `--queue`).

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

Let's say we have `dvc exp run` 3 experiments in our project:

```dvc
$ dvc exp list
master:
        exp-e6c97
        exp-1dad0
        exp-1df77
        exp-23d5a
```

To remove any of them, give their names to `dvc exp remove`. Or use the `--all`
(`-A`) option to remove them all at once:

```dvc
$ dvc exp remove exp-1dad0 exp-1df77

$ dvc exp list
master:
        exp-e6c97
        exp-23d5a

$ dvc exp remove -A

$ dvc exp list
```

Nothing is listed after the last `dvc exp list` because they're all gone.
