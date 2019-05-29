# pkg install

Install a DVC package.

## Synopsis

```usage
usage: dvc pkg install [-h] [--global] [--system] [--local] [-q | -v]
                       [-s OUT] [-f FILE]
                       [address] [target]

positional arguments:
  address       Package address: git://<url> or https://github.com/...
  target        Target directory to deploy package outputs. Default
                value is the current dir.
```

## Description

Install DVC package at `address`, deploying its outputs to the `target`
directory.

## Options

- `-s OUT`, `--select OUT` - Select and persist only specified outputs from a
  package. The parameter can be used multiple times. All outputs will be
  selected by default.

- `-f FILE`, `--file FILE` - Specify name of the stage file. It should be either
  'Dvcfile' or have a '.dvc' suffix (e.g. 'prepare.dvc', 'clean.dvc', etc). By
  default the file has 'mod\_' prefix and imported package name followed by .dvc

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--system` - modify a system config file (e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

- `--local` - modify a local config file instead of `.dvc/config`. It is located
  in `.dvc/config.local` and is Git-ignored. This is useful when you need to
  specify private config options in your config, that you don't want to track
  and share through Git.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples: ...
