# remove

Remove data files or directories tracked by DVC.

## Synopsis

```usage
usage: dvc remove [-h] [-q | -v] [-o | -p] [-f] targets [targets ...]

positional arguments:
  targets        DVC-files to remove.
```

## Description

This command safely removes data files or directories that are tracked by DVC
from the <abbr>workspace</abbr>. It takes a
[DVC-File](/doc/user-guide/dvc-file-format) as input, removes all of its outputs
(`outs`), and optionally removes the DVC-file itself.

Note that it does not remove files from the DVC cache or remote storage (see
`dvc gc`). However, remember to run `dvc push` to save the files you actually
want to use or share in the future.

Refer to [Updating Tracked Files](/doc/user-guide/updating-tracked-files) to see
how it can be used to replace or modify files that are tracked by DVC.

## Options

- `-o`, `--outs` - remove the outputs described in the given `targets`, keep the
  DVC-files themselves. **This is the default behavior.**

- `-p`, `--purge` - remove outputs and DVC-files.

- `-f`, `--force` - force purge. Skip confirmation prompt.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's imagine have a `data.csv` data file, and track it with DVC:

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

Purge DVC-files:

```dvc
$ dvc remove data.csv.dvc -p
$ ls data.csv*
```
