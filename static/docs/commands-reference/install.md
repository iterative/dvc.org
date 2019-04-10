# install

Install dvc hooks into the repository

## Synopsis

```usage
    usage: dvc install [-h] [-q] [-v]
```

## Installed hooks
- pre-commit : dvc status
- post-checkout : dvc checkout

## Options

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

## Examples

```dvc
    $ dvc install
    $ cat .git/hooks/pre-commit
      #!/bin/sh
      exec dvc status
    $ cat .git/hooks/post-checkout
      #!/bin/sh
      exec dvc checkout
    $ git checkout mybranch # will call `dvc checkout` automatically
```
