# remote list

List all available [data remotes](/doc/command-reference/remote).

## Synopsis

```usage
usage: dvc remote list [-h] [--global | --system | --local] [-q | -v]
```

## Description

Reads DVC configuration files and prints the list of available remotes,
including names and URLs.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc/config`) instead of `.dvc/config`.

- `--local` - read a local [config file](/doc/command-reference/config) instead
  of `.dvc/config`. It is located in `.dvc/config.local` and is Git-ignored.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

For simplicity, let's add a default local remote:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the type of location where the storage is: another directory in the
same file system. "Remote" is how we call storage for <abbr>DVC projects</abbr>.
It's essentially a local backup for data tracked by DVC.

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
