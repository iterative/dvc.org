# remove

Remove stages from `dvc.yaml` and/or stop tracking files or directories (and
optionally delete them).

## Synopsis

```usage
usage: dvc remove [-h] [-q | -v] [--outs] targets [targets ...]

positional arguments:
  targets        stages (found in dvc.yaml) or .dvc files to remove.
```

## Description

Safely removes `.dvc` files or stages from `dvc.yaml`. This includes deleting
the corresponding `.gitignore` entries (based on the `outs` fields removed).

<admon type="info">

`dvc remove` doesn't remove files from the DVC <abbr>cache</abbr> or [remote
storage]. Use `dvc gc` for that.

[remote storage]: /doc/user-guide/data-management/remote-storage

</admon>

It takes one or more stage names (see `-n` option of `dvc stage add`) or `.dvc`
file names as `targets`.

If there are no stages left in `dvc.yaml` after the removal, then both
`dvc.yaml` and `dvc.lock` are deleted. `.gitignore` is also deleted if there are
no more entries left in it.

Note that the actual <abbr>output</abbr> files or directories of the stage
(`outs` field) are not removed by this command, unless the `--outs` option is
used.

💡 Refer to [Undo Adding Data](/doc/user-guide/how-to/stop-tracking-data) to see
how it helps replace data that is tracked by DVC.

## Options

- `--outs` - remove the outputs of any `targets` as well.

  ⚠️This option may be irreversible (e.g. if the data isn't cached).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: remove a .dvc file

Let's imagine we have `foo.csv` and `bar.csv` files, that are already
[tracked](/doc/command-reference/add) by DVC:

```cli
$ ls
bar.csv  bar.csv.dvc  foo.csv  foo.csv.dvc
$ cat .gitignore
/foo.csv
/bar.csv
```

This removes `foo.csv.dvc` and double checks that its entry is gone from
`.gitignore`:

```cli
$ dvc remove foo.csv.dvc

$ ls
bar.csv  bar.csv.dvc  foo.csv
$ cat .gitignore
/bar.csv
```

> The same procedure applies to tracked directories.

## Example: remove a stage and its output

Let's imagine we have a `train` stage in `dvc.yaml`, and corresponding files in
the <abbr>workspace</abbr>:

```yaml
train:
  cmd: python train.py data.csv
  deps:
    - data.csv
    - train.py
  outs:
    - model
```

```cli
$ ls
dvc.lock  dvc.yaml  foo.csv  foo.csv.dvc  model  train.py
```

Using `dvc remove` on the stage name will remove that entry from `dvc.yaml`, and
its outputs from `.gitignore`. With the `--outs` option, its outputs are also
deleted (just the `model` file in this example):

```cli
$ dvc remove train --outs
$ ls
dvc.lock  dvc.yaml  foo.csv  foo.csv.dvc  train.py
```

> Notice that the dependencies (`data.csv` and `train.py`) are not deleted.
