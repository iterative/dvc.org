# cache

Contains a helper commands to manage the <abbr>cache</abbr> directory:
[dir](/command-reference/cache/dir),
[migrate](/command-reference/cache/migrate).

## Synopsis

```usage
usage: dvc cache [-h] [-q] [-v] {dir,migrate} ...

positional arguments:
    dir          Configure cache directory location.
    migrate      Migrate cached files to the DVC 3.0 cache location.
```

## Description

Tracked files and directories visible in the <abbr>workspace</abbr> are links\*
to the ones in the project's <abbr>cache</abbr>.

> \* Or copies. Refer to
> [File link types](/user-guide/data-management/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> for more information on supported linking on different platforms.

For cache configuration options, refer to `dvc config cache`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
