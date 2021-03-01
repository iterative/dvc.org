# exp remove

Remove specific `dvc experiments` from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc experiments remove [-h] [-q | -v] [--queue]
                              [experiment [experiment ...]]

Remove local experiments.
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
