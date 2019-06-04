# pkg remove

Remove a DVC package. Undoes the [adding](/doc/commands-reference/pkg-add) of a
package.

## Synopsis

```usage
usage: dvc pkg remove [-h] [--global] [--system] [--local] [-q | -v]
                      name

positional arguments:
  name           Package name.
```

## Description

The `name` of the package must have been previously registered with the
[add](/doc/commands-reference/pkg-add) or
[install](/doc/commands-reference/pkg-install) commands previously.

> Keep in mind that the use of this command should match the cache location
> options used at the time of adding the package
> (`[--global] [--system] [--local]`).

This command removes the package from the DVC config file (typically in
`.dvc/config`). It does NOT remove any files that may have been downloaded by
`dvc pkg install`. (See `dvc pkg uninstall` for that purpose.)

> Try not to remove a package before its uninstalled, as the `.dvc/pkg/` folder
> may end up with directories that have to be removed manually.

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

Having the `get-started` package added in the example of `dvc pkg add`:

```dvc
$ dvc pkg list
get-started	https://github.com/iterative/example-get-started
```

The following command deletes the `pkg` section for the `get-started` package
from the DVC config file:

```dvc
$ dvc pkg remove get-started https://github.com/iterative/example-get-started
```

(Try `cat .dvc/config` to confirm.)
