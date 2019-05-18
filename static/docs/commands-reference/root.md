# root

Returns relative path to project's directory.

Can be used to build a path to a dependency, command, or output.

```usage
usage: dvc root [-h] [-q] [-v]
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

1. Basic output:

```dvc
$ dvc root

.

$ cd subdir
$ dvc root

..
```

2. Referencing files:

```dvc
$ dvc root

../../../

$ dvc run -d $(dvc root)/data/file.cvs ... \
    python $(dvc root)/scripts/something.py
```
