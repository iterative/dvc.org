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

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files),
that are hidden from the user.

The cache is where your data files, models, etc. (anything you want to version
with DVC) are actually stored. The corresponding files you see in the
<abbr>workspace</abbr> can simply link to the ones in cache. (Refer to
[File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
for more information on file links on different platforms.)

> For more cache-related configuration options refer to `dvc config cache`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
