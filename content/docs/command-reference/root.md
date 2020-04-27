# root

Return the relative path to the root of the <abbr>DVC project</abbr>.

## Synopsis

```usage
usage: dvc root [-h] [-q | -v]
```

## Description

This command returns the path to the root directory of the <abbr>DVC
project</abbr>, relative to the current working directory. It can be used to
build a path to a dependency, script, or <abbr>data artifact</abbr>, for
example. Useful when working in a subdirectory of the project, and needing to
refer to a file in another directory.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Basic output

```dvc
$ dvc root

.

$ cd subdir
$ dvc root

..
```

## Example: Referencing files

```dvc
$ dvc root

../../../

$ dvc run -d $(dvc root)/data/file.cvs ... \
    python $(dvc root)/scripts/something.py
```
