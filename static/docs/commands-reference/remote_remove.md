# remote remove

Remove a specified remote. This command affects DVC configuration files only, it
does not physically remove your data files stored remotely.

See also [add](/doc/commands-reference/remote-add),
[default](/doc/commands-reference/remote-default),
[list](/doc/commands-reference/remote-list), and
[modify](/doc/commands-reference/remote-modify) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote remove [-h] [-q | -v]
                         [--global] [--system] [--local]
                         name

positional arguments:
  name           Name of the remote to remove
```

## Description

Remote `name` is required.

This command removes a section in the DVC
[config file](/doc/user-guide/dvc-files-and-directories). Alternatively, it is
possible to edit config files manually.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - remove remote specified in the
  [local](/doc/user-guide/dvc-files-and-directories) configuration file
  (`.dvc/config.local`). Local configuration files stores private settings or
  local environment specific settings that should not be tracked by Git.

## Examples

Add AWS S3 remote and modify its region:

```dvc
$ dvc remote add myremote s3://mybucket/myproject
$ dvc remote modify myremote region us-east-2
```

Remove remote:

```dvc
$ dvc remote remove myremote
```
