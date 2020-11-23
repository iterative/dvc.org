# cache

Contains a helper command to set the <abbr>cache</abbr> directory location:
[dir](/doc/command-reference/cache/dir).

## Synopsis

```usage
usage: dvc cache [-h] [-q] [-v] {dir} ...

positional arguments:
  COMMAND
    dir          Configure cache directory location.
```

## Description

The DVC Cache is where your data files, models, etc. (anything you want to
version with DVC) are actually stored. The data files and directories visible in
the <abbr>workspace</abbr> are links\* to (or copies of) the ones in cache.
Learn more about it's
[structure](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).

> \* Refer to
> [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> for more information on file links on different platforms.

For cache configuration options, refer to `dvc config cache`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
