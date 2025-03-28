# remote list

List all `dvc remote` names and locations.

## Synopsis

```usage
usage: dvc remote list [-h] [--global | --system | --project | --local]
                       [-q | -v]
```

## Description

Reads [DVC configuration] and prints the list of available remotes, including their
names and URLs/paths. Remotes are read from the system, global, project, and local
config files (in that order). The default remote (if set) will be prefixed with a
`*`.

[dvc configuration]: /doc/user-guide/project-structure/configuration#remote

## Options

- `--system` - only read remote configuration from the system config file (e.g.
  `/etc/xdg/dvc/config`) instead of `.dvc/config`.

- `--global` - only read remote configuration from the global config file (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--project` - only read remote configuration from the project's config file
  (`.dvc/config`) when reading remote configuration.

- `--local` - only read remote configuration from the Git-ignored local config
  file (located in `.dvc/config.local`) instead of `.dvc/config`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

For simplicity, let's add a default [local remote]:

```cli
$ dvc remote add -d myremote /path/to/remote
Setting 'myremote' as a default remote.
```

And now the list of remotes should look like:

```cli
$ dvc remote list
* myremote	/path/to/remote
  otherremote	/path/to/other/remote
```

The list will also include any previously added remotes, and the default remote
is indicated by a prefixed `*`.

[local remote]:
  /doc/user-guide/data-management/remote-storage#file-systems-local-remotes
