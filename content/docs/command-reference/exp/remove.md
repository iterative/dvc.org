# exp remove

Remove specific `dvc experiments` from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc experiments remove [-h] [-q | -v] [--queue]
                              [experiment [experiment ...]]

positional arguments:
   experiment    Experiments to remove.
```

## Description

Deletes one or more experiments indicated by name or hash (see `dvc exp run`).

With `--queue`, the queue of experiments is cleared.

## Options

- `--queue` - remove all experiments that haven't been run yet (defined via
  `dvc exp run --queue`).

- `-f`, `--force` - force garbage collection. Skip confirmation prompt.

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
```

To remove any of them, just give their names to `dvc exp remove`:

```dvc
$ dvc exp remove exp-1dad0 exp-1df77

$ dvc exp list
master:
        exp-e6c97
```
