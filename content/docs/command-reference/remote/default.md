# remote default

Set/unset the default [data remote](/doc/command-reference/remote).

> Depending on your remote storage type, you may also need `dvc remote modify`
> to provide credentials and/or configure other remote parameters.

## Synopsis

```usage
usage: dvc remote default [-h] [--global | --system | --project | --local]
                          [-q | -v] [-u]
                          [name]

positional arguments:
  name           Name of the remote.
```

## Description

You can query/set/replace/unset the _default remote_ using the options of this
command. If the `name` of the remote is not provided and `--unset` is not
specified, this command returns the name of the default remote.

When reading (`name` is not provided), the value ise read from the system,
global, repo and local configuration files by default, and options `--system`,
`--global`, `--project`, and `--local` can be used to tell the command to read
from only that location.

When writing (`name` is provided), the new value is written to the projects
configuration file by default (`.dvc/config`), and options `--system`,
`--global` and `--local` can be used to tell the command to write to that
location (you can say `--project` but that is the default).

```dvc
$ dvc remote default myremote
```

This command assigns the default remote in the core section of the DVC
[config file](/doc/command-reference/config).

```ini
[core]
remote = myremote
```

Default remotes are expected by commands that accept a `-r`/`--remote` option
(`dvc pull`, `dvc push`, `dvc status`, `dvc gc`, `dvc fetch`) when that option
is omitted.

You can also use `dvc config`, `dvc remote add` and `dvc remote modify` commands
to set/unset/change the default remote configurations.

## Options

- `-u`, `--unset` - unsets default remote.

- `--global` - use a global config file (e.g. `~/.config/dvc/config`) instead of
  `.dvc/config`.

- `--system` - use a system config file (e.g. `/etc/dvc/config`) instead of
  `.dvc/config`.

- `--project` - use a project's config file (`.dvc/config`).

- `--local` - use a local [config file](/doc/command-reference/config) instead
  of `.dvc/config`. It is located in `.dvc/config.local` and is Git-ignored.
  This is useful when you need to specify private config options in your config
  that you don't want to track and share through Git (credentials, private
  locations, etc).

- `-h`, `--help` - prints the usage/help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Set `myremote` as default remote:

```dvc
$ dvc remote default myremote
```

Get default remote:

```dvc
$ dvc remote default

myremote
```

Change default remote value:

```dvc
$ dvc remote default mynewremote
```

In the DVC config file, the updated value of default remote can be found in the
core section (run `cat .dvc/config`):

```ini
[core]
remote = mynewremote
```

Clear/unset default remote value:

```dvc
$ dvc remote default -u
```
