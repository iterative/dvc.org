# cache

Contains a helper command to set the cache directory location:
[dir](/doc/commands-reference/cache-dir).

## Synopsis

```usage
usage: dvc cache [-h] [-q] [-v] {dir} ...

positional arguments:
    dir          Configure cache directory location.
```

## Description

After DVC initialization, a hidden directory `.dvc/` is created with the
[DVC internal files](/doc/user-guide/dvc-files-and-directories), including the
default `cache` directory.

The DVC cache is where your data files, models, etc (anything you want to
version with DVC) are actually stored. The corresponding files you see in the
working directory or "workspace" simply link to the ones in cache. (See
`dvc config cache` `type` setting for more information on file links on
different platforms.)

> For more cache-related configuration options refer to `dvc config cache`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

The main use of this command is to apply the `-v` and `-q` options to
`dvc cache dir` which doesn't have them:

```dvc
$ dvc cache --verbose dir mycache
DEBUG: Writing '/Users/user/myproject/.dvc/config'.
$ dvc config cache.dir
../mycache
```
