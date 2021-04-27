# remove

Remove stages from `dvc.yaml` and/or stop tracking files or directories (and
optionally delete them).

## Synopsis

```usage
usage: dvc remove [-h] [-q | -v] [--outs] targets [targets ...]

positional arguments:
  targets        Tracked files/directories, stage names (found in
                 dvc.yaml), or .dvc files to remove.
```

## Description

Safely removes tracked data (by file name, stage name, or `.dvc` file path).
This includes deleting the corresponding `.gitignore` entries.

> `dvc remove` doesn't remove files from the DVC <abbr>cache</abbr> or
> [remote storage](/doc/command-reference/remote). Use `dvc gc` for that.

It takes one or more stage names (see `-n` option of `dvc run`), `.dvc` file
names or tracked files/directories as `targets`.

If there are no stages left in `dvc.yaml` after the removal, then both
`dvc.yaml` and `dvc.lock` are deleted. `.gitignore` is also deleted if there are
no more entries left in it.

Note that, when using stage name as target, the actual <abbr>output</abbr> files
or directories of the stage (`outs` field) are not removed by this command,
unless the `--outs` option is used which will remove **all** of them.
Alternatively, you can the names of individual <abbr>output</abbr> files or
directories of a stage as `targets`.

💡 Refer to [Undo Adding Data](/doc/user-guide/how-to/stop-tracking-data) to see
how it helps replace data that is tracked by DVC.

## Options

- `--outs` - remove the outputs of any `targets` as well.

  ⚠️This option may be irreversible (e.g. if the data isn't cached).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Remove stage outputs

Let's imagine we have a `train` stage in `dvc.yaml`, and corresponding files in
the <abbr>workspace</abbr>:

```yaml
train:
  cmd: python train.py data.csv
  deps:
    - data.csv
    - train.py
  outs:
    - logs
    - model.h5
```

```dvc
$ ls
dvc.lock  dvc.yaml  data.csv  data.csv.dvc  model.h5  logs  train.py

$ cat .gitignore
/data.csv
/model.h5
/logs
```

Using `dvc remove` on the stage name will remove the stage from `dvc.yaml`, and
corresponding entries from `.gitignore`. With the `--outs` option, the actual
files and directories are deleted too (`logs/` and `model.h5` in this example):

```dvc
$ dvc remove train --outs

$ ls
dvc.lock  dvc.yaml  data.csv  data.csv.dvc  train.py

$ cat .gitignore
/data.csv
```

> Notice that the dependencies (`data.csv` and `train.py`) are not deleted.

## Example: remove a specific stage output

Assuming we have the same initial <abbr>workspace</abbr> as before:

```yaml
train:
  cmd: python train.py data.csv
  deps:
    - data.csv
    - train.py
  outs:
    - logs
    - model.h5
```

```dvc
$ ls
dvc.lock  dvc.yaml  data.csv  data.csv.dvc  model.h5  logs  train.py

$ cat .gitignore
/data.csv
/model.h5
/logs
```

`dvc remove` can also be used on **individual** <abbr>outputs</abbr> of a
stage (by file name):

```dvc
$ dvc remove model.h5

$ ls
dvc.lock  dvc.yaml  data.csv  data.csv.dvc  logs  train.py

$ cat .gitignore
/data.csv
/logs
```

`model.h5` file is removed from the <abbr>workspace</abbr> and `.gitignore`,
but note that `dvc.yaml` is not updated.

## Example: remove specific data

Assuming we have the same initial <abbr>workspace</abbr> as before:

```yaml
train:
  cmd: python train.py data.csv
  deps:
    - data.csv
    - train.py
  outs:
    - logs
    - model.h5
```

```dvc
$ ls
dvc.lock  dvc.yaml  data.csv  data.csv.dvc  model.h5  logs  train.py

$ cat .gitignore
/data.csv
/model.h5
/logs
```

Using `dvc remove` on a tracked file name will remove the corresponding `.dvc`
file and `gitignore` entry:

```dvc
$ dvc remove data.csv

$ ls
dvc.lock  dvc.yaml  data.csv  model.h5  logs  train.py

$ cat .gitignore
/model.h5
/logs
```

> The same procedure applies to tracked directories.
