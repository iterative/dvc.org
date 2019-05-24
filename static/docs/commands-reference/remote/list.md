# remote list

Show all available remotes.

See also [add](/doc/commands-reference/remote-add),
[default](/doc/commands-reference/remote-default),
[modify](/doc/commands-reference/remote-modify), and
[remove](/doc/commands-reference/remote-remove) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote list [-h] [-q | -v]
                       [--global] [--system] [--local]

List remotes.
```

## Description

Reads DVC configuration files and prints the list of available remotes.
Including names and URLs.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - list remotes specified in the
  [local](/doc/user-guide/dvc-files-and-directories) configuration file
  (`.dvc/config.local`). Local configuration files stores private settings that
  should not be tracked by Git.

## Examples

Let's for simplicity add a default local remote:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the machine where the project is stored, so it can be any directory
accessible to the same system. The "remote" part refers specifically to the
project/repository itself.

</details>

```dvc
$ dvc remote add -d myremote /path/to/remote
Setting 'myremote' as a default remote.
```

And now the list of remotes should look like:

```dvc
$ dvc remote list

myremote        /path/to/remote
```
