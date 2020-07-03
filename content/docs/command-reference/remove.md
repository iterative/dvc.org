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
(see `-n` option of `dvc run`) or
[`.dvc` files](/doc/user-guide/dvc-files-and-directories#dvc-files) as target,
removes it, and optionally removes all of its outputs (`outs` field).

Note that it does not remove files from the DVC cache or remote storage (see
`dvc gc`). However, remember to run `dvc push` to save the files you actually
want to use or share in the future.

Refer to [Updating Tracked Files](/doc/user-guide/updating-tracked-files) to see
how it can be used to replace or modify files that are tracked by DVC.

## Options

- `--outs` - remove the outputs described in the given `targets` as well.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: remove a tracked file (or directory)

Let's imagine we have `foo.csv` and `bar.csv` files, that are already
[tracked](/doc/command-reference/add) by DVC:

```dvc
$ ls *.csv*
bar.csv
bar.csv.dvc
foo.csv
foo.csv.dvc
$ cat .gitignore
/bar.csv
/foo.csv
```

This removed the `foo.csv.dvc` file, and lists `.gitignore` to double check that
the corresponding entry is gone from there:

```dvc
$ dvc remove foo.csv.dvc
$ ls
bar.csv
bar.csv.dvc
foo.csv
$ cat .gitignore
/bar.csv
```

> The same procedure applies to tracked directories.

## Example: remove a stage

Let's imagine we have a stage named `train` in our
[`dvc.yaml` file](/doc/user-guide/dvc-files-and-directories#dvcyaml-file), and
corresponding files in the <abbr>workspace</abbr>:

```yaml
train:
  deps:
    - foo.csv
  outs:
    - model
```

```dvc
$ ls
dvc.yaml dvc.lock
... foo.csv model
```

Running `dvc remove` on the stage name will remove this entire entry from
`dvc.yaml`, and delete its outputs:

```dvc
$ dvc remove train
$ ls
dvc.yaml dvc.lock
... foo.csv
```

Notice that the dependency `foo.csv` is not removed, since it may be the output
of a previous stage.
