# remote remove

Remove a [data remote](/doc/command-reference/remote). This command affects DVC
configuration files only, it does not physically remove data files stored
remotely.

## Synopsis

```usage
usage: dvc remote remove [-h] [--global | --system | --local] [-q | -v]
                         name

positional arguments:
  name           Name of the remote to remove
```

## Description

This command removes a section in the DVC
[config file](/doc/command-reference/config). Alternatively, it is possible to
edit config files manually.

The `name` argument is required.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc/config`) instead of `.dvc/config`.

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
$ dvc remote add myremote s3://mybucket/path
```

Remove it:

```dvc
$ dvc remote remove myremote
```
