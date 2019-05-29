# pkg

Contains a helper command to install a DVC package:
[install](/doc/commands-reference/pkg-install).

## Synopsis

```usage
usage: dvc pkg [-q | -v] {install} ...

positional arguments:
  {install}      Use dvc pkg CMD --help for command-specific help.
    install      Install package.
```

## Description

Manage DVC packages. See [dvc pkg install](/doc/commands-reference/pkg-install).

## Options

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
