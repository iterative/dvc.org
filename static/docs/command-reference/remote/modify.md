# remote modify

Modify configuration of data remotes.

> This command is commonly needed after `dvc remote add` or
> [default](/doc/command-reference/remote/default) to setup credentials or other
> customizations to each remote storage type.

See also [add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list), and
[remove](/doc/command-reference/remote/remove) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote modify [-h] [--global] [--system] [--local]
                         [-q | -v] [-u]
                         name option [value]

positional arguments:
  name           Name of the remote
  option         Name of the option to modify
  value          (optional) Value of the option
```

## Description

Remote `name` and `option` name are required. Option names are remote type
specific. See below examples and a list of remote storage types: Amazon S3,
Google Cloud, Azure, SSH, ALiyun OSS, among others.

This command modifies a `remote` section in the project's
[config file](/doc/command-reference/config). Alternatively, `dvc config` or
manual editing could be used to change the configuration.

## Options

- `-u`, `--unset` - delete configuration value for given `option`. Don't provide
  a `value` when using this flag.

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Customize an S3 remote

Let's first set up a _default_ S3 remote:

```dvc
$ dvc remote add -d myremote s3://mybucket/storage

Setting 'myremote' as a default remote.
```

Modify its endpoint URL:

```dvc
$ dvc remote modify myremote endpointurl https://object-storage.example.com
```

Now the config file should look like (run `cat .dvc/config`):

```ini
['remote "myremote"']
url = s3://mybucket/storage
endpointurl = https://object-storage.example.com
[core]
remote = myremote
```
