# remove

Remove stage entry, remove `.gitignore` entry and unprotect outputs.

## Synopsis

```usage
usage: dvc remove [-h] [-q | -v] [--outs] targets [targets ...]

positional arguments:
  targets        stages (found in dvc.yaml) or .dvc files to remove.
```

## Description

This command safely removes stages from
[dvc.yaml](/doc/user-guide/dvc-files-and-directories#dvcyaml-file), their
`.gitignore` entries, and optionally removes from the <abbr>workspace</abbr>
files or directories that are tracked by DVC. It takes one or more stage names
(see `-n` option of `dvc run`) or
[`.dvc` files](/doc/user-guide/dvc-files-and-directories#dvc-files) as target,
removes it, and optionally removes all of its outputs (`outs` field).

Note that it does not remove files from the DVC cache or remote storage (see
`dvc gc`). However, remember to run `dvc push` to save the files you actually
want to use or share in the future.

Refer to [Updating Tracked Files](/doc/user-guide/updating-tracked-files) to see
how it can be used to replace or modify files that are tracked by DVC.

## Options

- `--outs` - remove outputs as well.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's imagine we have a `data.csv` file t is that already [tracked](link to dvc
add cmd ref please) with DVC:

```dvc
$ dvc add data.csv
$ ls data.csv*
data.csv
data.csv.dvc
$ cat .gitignore
/data.csv
```

Remove the `data.csv.dvc` file, and check that the data file is gone from
`.gitignore`:

```dvc
$ dvc remove data.csv.dvc
$ ls data.csv*
data.csv
$ cat .gitignore | wc -l

0
```
