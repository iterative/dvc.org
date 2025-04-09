# remote default

Set/unset the default `dvc remote`.

## Synopsis

```usage
usage: dvc remote default [-h]
                          [--global | --system | --project | --local]
                          [-q | -v] [-u]
                          [name]

positional arguments:
  name           Name of the remote.
```

## Description

You can query/set/replace/unset the _default remote_ using the options of this
command. If the `name` of the remote is not provided and `--unset` is not
specified, this command returns the name of the default remote.

```cli
$ dvc remote default myremote
```

This command assigns the default remote in the [`core`] section of the DVC
config file.

[`core`]: /doc/user-guide/project-structure/configuration#core

```ini
[core]
remote = myremote
```

Default remotes are expected by commands that accept a `-r`/`--remote` option
(`dvc pull`, `dvc push`, `dvc status`, `dvc gc`, `dvc fetch`) when that option
is omitted.

You can also use `dvc config`, `dvc remote add`, or `dvc remote modify` commands
to set/unset/change the default remote.

If a default remote is set, the output of the `dvc remote list` command will
specify it, see [the examples below](#examples).

Remotes are read from the system, global, project, and local config files (in
that order).

## Options

- `-u`, `--unset` - unset the current default remote from a config file.

- `--system` - save or only read remote configuration to/from the system config
  file (e.g. `/etc/xdg/dvc/config`) instead of `.dvc/config`.

- `--global` - save or only read remote configuration to/from the global config
  file (e.g. `~/.config/dvc/config`) instead of `.dvc/config`.

- `--project` - save or only read remote configuration to/from the project's
  config file (`.dvc/config`) (this is the default behavior).

- `--local` - save or only read remote configuration to/from the Git-ignored
  local config file (located in `.dvc/config.local`) instead of `.dvc/config`.
  This is useful to save private remote config that you don't want to track and
  share with Git.

- `-h`, `--help` - prints the usage/help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Set `myremote` as default remote:

```cli
$ dvc remote default myremote
```

Get default remote:

```cli
$ dvc remote default

myremote
```

See the default remote (if set) by listing all remotes:

```cli
$ dvc remote list
myremote    /path/to/remote    (default)
otherremote    /path/to/other/remote
```

Change default remote value:

```cli
$ dvc remote default mynewremote
```

In the DVC config file, the updated value of default remote can be found in the
core section (run `cat .dvc/config`):

```ini
[core]
remote = mynewremote
```

Clear/unset default remote value:

```cli
$ dvc remote default -u
```
