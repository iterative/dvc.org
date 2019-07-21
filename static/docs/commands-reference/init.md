# init

This command initializes a DVC project on a directory.

Note that by default the current working directory is expected to contain a Git
repository, unless the `--no-scm` option is used.

## Synopsis

```usage
usage: dvc init [-h] [-q | -v] [--no-scm] [-f]
```

## Description

After DVC initialization, a new directory `.dvc/` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from the user generally and are not meant to be manipulated directly.

`.dvc/cache` is one of the most important
[DVC directories](/doc/user-guide/dvc-files-and-directories). It will hold all
the contents of tracked data files. Note that `.dvc/.gitignore` lists this
directory, which means that the <abbr>cache directory</abbr> is not under Git
control. This is your local cache and you cannot push it to any Git remote.

## Options

- `--no-scm` - skip Git specific initialization, `.dvc/.gitignore` will not be
  written.

- `-f`, `--force` - remove `.dvc/` if it exists before initialization. Will
  remove all local cache. Useful when first `dvc init` got corrupted for some
  reason.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Creating a new DVC repository (requires a Git repository).

```dvc
$ mkdir example && cd example
$ git init
$ dvc init
$ git status
...
        new file:   .dvc/.gitignore
        new file:   .dvc/config

$ git commit -m "Init DVC"
```

Note that the <abbr>cache</abbr> directory (among others) is not under Git
control. It contains data and model files, and will be managed by DVC.

```dvc
$ cat .dvc/.gitignore
/state
/lock
...
/cache
```
