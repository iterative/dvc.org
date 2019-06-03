# pkg uninstall

Uninstall DVC package(s).

## Synopsis

```usage
usage: dvc pkg uninstall [-h] [--global] [--system] [--local] [-q | -v]
                         [targets [targets ...]]

positional arguments:
  targets        Package name.
```

## Description

...

## Options

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
