# init

This command initializes a DVC environment in a current Git repository.

## Synopsis

```usage
usage: dvc init [-h] [-q] [-v] [--no-scm]
```

## Options

- `--no-scm` - skip Git specific initializations, `.dvc/.gitignore` will not be
  populated and added to Git.

- `-f`, `--force` - remove `.dvc/` if it exists before initialization. Will
  remove all local cache. Useful when first `dvc init` got corrupted for some
  reason.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Details

After DVC initialization, a new directory `.dvc/` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from the user generally and are not meant to be manipulated directly.

`.dvc/cache directory` is one of the most important parts of any DVC
repositories. The directory contains all content of data files. The most
important part about this directory is that `.dvc/.gitignore` file is containing
this directory which means that the cache directory is not under Git control —
this is your local directory and you cannot push it to any Git remote.

## Examples

- Creating a new DVC repository:

```dvc
$ mkdir tag_classifier
$ cd tag_classifier

$ git init
$ dvc init
$ git status

        new file:   .dvc/.gitignore
        new file:   .dvc/config

$ git commit -m "Init DVC"
```

- Cache directory is not under git control, it contains data and model files and
  is managed by DVC:

```dvc
$ cat .dvc/.gitignore
cache
state
lock
```
