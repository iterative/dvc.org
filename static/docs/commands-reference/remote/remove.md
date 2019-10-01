# remote remove

Remove a data remotes. This command affects DVC configuration files only, it
does not physically remove data files stored remotely.

See also [add](/doc/commands-reference/remote/add),
[default](/doc/commands-reference/remote/default),
[list](/doc/commands-reference/remote/list), and
[modify](/doc/commands-reference/remote/modify) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote remove [-h] [--global] [--system] [--local]
                         [-q | -v] name

positional arguments:
  name           Name of the remote to remove
```

## Description

Remote `name` is required.

This command removes a section in the DVC
[config file](/doc/commands-reference/config). Alternatively, it is possible to
edit config files manually.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/commands-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Add Amazon S3 remote and modify its region:

```dvc
$ dvc remote add myremote s3://mybucket/myproject
$ dvc remote modify myremote region us-east-2
```

Remove remote:

```dvc
$ dvc remote remove myremote
```
