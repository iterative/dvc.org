# pkg modify

Modify DVC package settings.

See also [install](/doc/commands-reference/pkg-install),
[uninstall](/doc/commands-reference/pkg-uninstall),
[add](/doc/commands-reference/pkg-add),
[remove](/doc/commands-reference/pkg-remove),
[list](/doc/commands-reference/pkg-list), and
[import](/doc/commands-reference/pkg-import).

## Synopsis

```usage
usage: dvc pkg modify [-h] [--global] [--system] [--local] [-q | -v]
                      [-u] name option [value]

positional arguments:
  name           Package name.
  option         Option.
  value          Value.
```

## Description

Package `name` and `option` name are required.

This command modifies a `pkg` section in the DVC
[config file](/doc/user-guide/dvc-files-and-directories). Alternatively,
`dvc config` or manual editing could be used to change settings.

## Options

- `-u`, `--unset` - delete configuration value for given `option`. Don't provide
  a `value` when using this flag.

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
$ dvc pkg add example-get-started https://github.com/username/example-get-started
$ dvc pkg modify example-get-started https://github.com/iterative/example-get-started
```

The above command first registers a `example-get-started` with the URL of the
username's fork of the original repository from "iterative", and then corrects
the mistake.
