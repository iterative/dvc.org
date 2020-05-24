# remote list

List all available data remotes.

See also [add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default),
[modify](/doc/command-reference/remote/modify),
[remove](/doc/command-reference/remote/remove), and
[rename](/doc/command-reference/remote/rename) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote list [-h] [--global] [--system] [--local] [-q | -v]
```

## Description

Reads DVC configuration files and prints the list of available remotes,
including names and URLs.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - read a local [config file](/doc/command-reference/config) instead
  of `.dvc/config`. It is located in `.dvc/config.local` and is Git-ignored.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's for simplicity add a _default_ local remote:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the machine where the project is stored, so it can be any directory
accessible to the same system. The "remote" part refers specifically to the
project/repository itself. Read "local, but external" storage.

</details>

```dvc
$ dvc remote add -d myremote /path/to/remote
Setting 'myremote' as a default remote.
```

And now the list of remotes should look like:

```dvc
$ dvc remote list
myremote	/path/to/remote
```

The list will also include any previously added remotes.
