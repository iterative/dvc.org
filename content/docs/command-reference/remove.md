# remove

Remove stage, `.gitignore` entry, and unprotect outputs.

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
(see `-n` option of `dvc run`) or `.dvc` files as target, removes it, and
optionally removes all of its outputs (`outs` field).

If there are no stages left in
[dvc.yaml](/doc/user-guide/dvc-files-and-directories#dvcyaml-file) after stage
removal then both
[dvc.yaml](/doc/user-guide/dvc-files-and-directories#dvcyaml-file) and
[dvc.lock](/doc/user-guide/dvc-files-and-directories#dvclock-file) are removed
from the workspace.

Note that in the case when `targets` are `.dvc` files, the tracked files or
directories (`outs` in the `.dvc` file) are _not_ removed by this command unless
`--outs` is specified.

`dvc remove` does not remove files from the DVC cache or remote storage (see
`dvc gc`). However, remember to run `dvc push` to save the files you actually
want to use or share in the future.

Refer to [Updating Tracked Files](/doc/user-guide/how-to/update-tracked-files)
to see how it can be used to replace or modify files that are tracked by DVC.

## Options

- `--outs` - remove the outputs of any stage `targets` as well. This is always
  applied automatically for `.dvc` file targets.

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
