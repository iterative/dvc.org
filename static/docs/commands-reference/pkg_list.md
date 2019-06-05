# pkg list

List DVC packages that have been previously added.

See also [install](/doc/commands-reference/pkg-install),
[uninstall](/doc/commands-reference/pkg-uninstall),
[add](/doc/commands-reference/pkg-add),
[remove](/doc/commands-reference/pkg-remove),
[modify](/doc/commands-reference/pkg-modify),
[list](/doc/commands-reference/pkg-list), and
[import](/doc/commands-reference/pkg-import).

## Synopsis

```usage
usage: dvc pkg list [-h] [--global] [--system] [--local] [-q | -v]
```

## Description

This command accepts no arguments. It reads the appropriate config file (see the
command options) and lists the packages specified in its `pkg` sections. (See
also `dvc config`.)

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

## Example

```dvc
$ dvc pkg add get-started https://github.com/iterative/example-get-started
$ dvc pkg list
get-started
```
