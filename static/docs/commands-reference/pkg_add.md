# pkg add

Add a DVC package. The package is registered in the DVC project configuration.

## Synopsis

```usage
usage: dvc pkg add [-h] [--global] [--system] [--local] [-q | -v] [-f]
                   [name] url

positional arguments:
  name           Package name.
  url            Package URL.
```

## Description

Any DVC project can be used as a DVC package in order to reuse its code, stages,
and related data artifacts in the current project workspace.

A valid `url` should be either an HTTP or SSH Git repository address such as
`https://github.com/iterative/example-get-started` or
`git@github.com:iterative/example-get-started.git` respectively – corresponding
to our sample [get started](/doc/get-started) DVC project. Note that
`dvc pkg add` does NOT validate the URL at this point, however inexistent or
unreachable addresses will result in a failure of the package
[install](/doc/commands-reference/pkg-install) and
[import](/doc/commands-reference/pkg-import) commands.

A `name` is required to identify the package configuration in the DVC project.
Such name can be any valid continuous alpha-numeric string like `my-pkg_name`.
However, the `name` argument is optional as it can be extracted from the `url`
path. If the name is already registered (check with `dvc pkg list`), the package
`url` is overwritten.

Adding a package registers it in the DVC config file (typically in `.dvc/config`
– see `dvc config`). Note that nothing is downloaded from the package URL. (Use
`dvc pkg install` or `dvc pkg import` to actually get files from the package).

## Options

- `-f`, `--force` - to overwrite existing package with new `url` value.

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
```

Results in the DVC config file (typically `.dvc/config`) being appended a `pkg`
section like:

```ini
['pkg "get-started"']
url = https://github.com/iterative/example-get-started
_cwd = /Users/username/dvcproject/.dvc
```
