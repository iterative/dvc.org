# remote rename

Rename a [data remote](/doc/command-reference/remote). The remote's URL is not
changed by this command.

## Synopsis

```usage
usage: dvc remote rename [-h]
                         [--global | --system | --project | --local]
                         [-q | -v]
                         name new

positional arguments:
  name           Remote to be renamed
  new            New name of the remote
```

## Description

This command modify a section in the DVC
[config file](/doc/command-reference/config). Alternatively, it is possible to
edit config files manually.

See also `dvc remote modify` to change other aspects of remote configuration,
such as the URL or access credentials.

Both `name` and `new` arguments are required, with the old and new names for the
DVC remote, respectively.

## Options

- `--system` - modify the system config file (e.g. `/etc/xdg/dvc/config`)
  instead of `.dvc/config`.

- `--global` - modify the global config file (e.g. `~/.config/dvc/config`)
  instead of `.dvc/config`.

- `--project` - modify the project's config file (`.dvc/config`). This is the
  default behavior.

- `--local` - modify the Git-ignored local config file (located in
  `.dvc/config.local`) instead of `.dvc/config`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Add Amazon S3 remote:

```dvc
$ dvc remote add myremote s3://mybucket/path
```

Rename it:

```dvc
$ dvc remote rename myremote s3remote
```
