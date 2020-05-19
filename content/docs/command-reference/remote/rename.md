# remote rename

Rename a DVC remote. This command affects DVC configuration files only, it does
not physically remove data files stored remotely.

See also [add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list), and
[modify](/doc/command-reference/remote/modify) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote rename [-h] [--global] [--system] [--local]
                         [-q | -v] name new

positional arguments:
  name           Remote to be renamed
  new            New name of the remote
```

## Description

Both Remote `name` and `new` are required.

This command modify a section in the DVC
[config file](/doc/command-reference/config). Alternatively, it is possible to
edit config files manually.

## Options

- `--global` - modify remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - modify remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Add Amazon S3 remote:

```dvc
$ dvc remote add myremote s3://mybucket/myproject
```

Rename it:

```dvc
$ dvc remote rename myremote mys3remote 
```
