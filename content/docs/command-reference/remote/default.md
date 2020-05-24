# remote default

Set/unset the default data remote.

> Depending on your remote storage type, you may also need `dvc remote modify`
> to provide credentials and/or configure other remote parameters.

See also [add](/doc/command-reference/remote/add),
[list](/doc/command-reference/remote/list),
[modify](/doc/command-reference/remote/modify),
[remove](/doc/command-reference/remote/remove), and
[rename](/doc/command-reference/remote/rename) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote default [-h] [--global] [--system] [--local]
                          [-q | -v] [-u] [name]

positional arguments:
  name           Name of the remote.
```

## Description

You can query/set/replace/unset default remote using the options of this
command. If the `name` of the remote is not provided and `--unset` is not
specified, this command returns the name of the default remote.

```dvc
$ dvc remote default myremote
```

This command assigns the default remote in the core section of the DVC
[config file](/doc/command-reference/config).

```ini
[core]
remote = myremote
```

For the commands that accept a `--remote` option (`dvc pull`, `dvc push`,
`dvc status`, `dvc gc`, `dvc fetch`), the default remote is used if that option
is not used.

You can also use `dvc config`, `dvc remote add` and `dvc remote modify` commands
to set/unset/change the default remote configurations.

## Options

- `-u`, `--unset` - unsets default remote.

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

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
