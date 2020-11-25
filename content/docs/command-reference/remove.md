# remove

Remove stages or `.dvc` files, unprotect or delete their <abbr>outputs</abbr>,
and erase the `.gitignore` entries.

## Synopsis

```usage
usage: dvc remove [-h] [-q | -v] [--outs] targets [targets ...]

positional arguments:
  targets        stages (found in dvc.yaml) or .dvc files to remove.
```

## Description

This command can safely remove stages from `dvc.yaml` or `.dvc` files. This
includes deleting the appropriate `.gitignore` entries, and optionally the
actual output files they track (see `--outs` option).

It takes one or more stage names (see `-n` option of `dvc run`) or `.dvc` file
names as `targets`.

If there are no stages left in `dvc.yaml` after the removal, then both
`dvc.yaml` and `dvc.lock` are deleted.

Note that the actual <abbr>output</abbr> files or directories tracked by the
stage (`outs` field) are not removed by this command, unless the `--outs` option
is used.

> `dvc remove` doesn't remove files from the DVC <abbr>cache</abbr> or
> [remote storage](/doc/command-reference/remote) either (use `dvc gc` for
> that).

💡 Refer to [Undo Adding Data](/doc/user-guide/how-to/undo-adding-data) to see
how it helps replace data that is tracked by DVC.

## Options

- `--outs` - remove the outputs of any `targets` as well.

  ⚠️This option may be irreversible (e.g. if the data isn't cached).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: remove a tracked file (or directory)

Let's imagine we have `foo.csv` and `bar.csv` files, that are already
[tracked](/doc/command-reference/add) by DVC:

```dvc
$ ls *.csv*
bar.csv  bar.csv.dvc  foo.csv  foo.csv.dvc
$ cat .gitignore
/foo.csv
/bar.csv
```

This removed the `foo.csv.dvc` file, and lists `.gitignore` to double check that
the corresponding entry is gone from there:

```dvc
$ dvc remove foo.csv.dvc
$ ls
bar.csv  bar.csv.dvc  foo.csv
$ cat .gitignore
/bar.csv
```

> The same procedure applies to tracked directories.

## Example: remove a stage

Let's imagine we have a stage named `train` in our `dvc.yaml` file, and
corresponding files in the <abbr>workspace</abbr>:

```yaml
train:
  cmd: python train.py data.py
  deps:
    - data.csv
    - train.py
  outs:
    - model
```

```dvc
$ ls
dvc.lock  dvc.yaml  foo.csv  foo.csv.dvc  model  train.py
```

Running `dvc remove` on the stage name will remove that entry from `dvc.yaml`,
and remove its outputs from `.gitignore`. With the `--outs` option, the outputs
itself (just `model` in this example) are also removed:

```dvc
$ dvc remove train --outs
$ ls
dvc.lock  dvc.yaml  foo.csv  foo.csv.dvc  train.py
```

Notice that the dependencies (`data.csv` and `train.py`) are not removed.
