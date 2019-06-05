# remove

Remove data file or data directory.

This command safely removes data files or stage outputs that are tracked by DVC
from your _workspace_. It takes a `.dvc` file and removes all outputs and
optionally removes the file itself.

Note that it _does not_ remove files from the DVC cache or remote storage (see
`dvc gc`). However, remember to run `dvc push` to save the files you actually
want to use or share in the future.

```usage
usage: dvc remove [-h] [-q] [-v] [-o | -p] [-f] targets [targets ...]

positional arguments:
    targets               DVC files.
```

Check also [Update Tracked Files](/doc/user-guide/update-tracked-file) to see
how it can be used to replace or modify files that are under DVC control.

## Options

- `-o`, `--outs` (default) - remove outputs described in the provided DVC
  file(s), keep the DVC files.

- `-p`, `--purge` - remove outputs and DVC files.

- `-f`, `--force` - force purge. Skip confirmation prompt.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's imagine we have a `data.csv` under DVC control:

```dvc
$ dvc add data.csv
$ ls data.csv*

    data.csv
    data.csv.dvc
```

Remove `data.csv` data file:

```dvc
$ dvc remove data.csv.dvc
$ ls data.csv*

     data.csv.dvc
```

Purge DVC files:

```dvc
$ dvc remove data.csv.dvc -p
$ ls data.csv*
```
