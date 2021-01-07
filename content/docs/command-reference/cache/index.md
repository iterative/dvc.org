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

Tracked files and directories visible in the <abbr>workspace</abbr> are links\*
to the ones in the project's <abbr>cache</abbr>.

> \* Or copies. Refer to
> [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> for more information on supported linking on different platforms.

For cache configuration options, refer to `dvc config cache`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
