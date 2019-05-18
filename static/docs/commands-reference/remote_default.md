# remote default

To set/unset default data remote. Depending on your storage type you may need to
run `dvc remote modify` to provide credentials and/or configure other remote
parameters.

See also [add](/doc/commands-reference/remote-add),
[list](/doc/commands-reference/remote-list),
[modify](/doc/commands-reference/remote-modify), and
[remove](/doc/commands-reference/remote-remove) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote default [-h] [-q | -v] [-u]
                          [--global] [--system] [--local]
                          [name]

positional arguments:
    name           Name of the remote.
```

## Description

You can query/set/replace/unset default remote using options of this command. If
the `name` of the remote is not provided and `--unset` is not specified, this
command returns the name of the default remote.

```dvc
$ dvc remote default myremote
```

This command assigns the default remote in the core section of the DVC
[config file](/doc/user-guide/dvc-files-and-directories).

```ini
[core]
remote = myremote
```

For the commands which take a `--remote` option (`dvc pull`, `dvc push`,
`dvc status`, `dvc gc`, `dvc fetch`), default remote is used if that option is
not specified.

You can also use [`dvc config`](/doc/user-guide/dvc-files-and-directories),
[`dvc remote add`](/doc/commands-reference/remote-add) and
[`dvc remote modify`](/doc/commands-reference/remote-modify) commands to
set/unset/change the default remote configurations.

## Options

- `-u`, `--unset` - unsets default remote.

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - save the remote configuration to the
  [local](/doc/user-guide/dvc-files-and-directories) config
  (`.dvc/config.local`). This is useful when you need to specify private options
  or local environment specific settings in your config, that you don't want to
  track and share through Git (credentials, private locations, etc).

- `-h`, `--help` - prints the usage/help message and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

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
