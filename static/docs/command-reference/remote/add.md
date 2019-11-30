# remote add

Add a new data remote.

> Depending on your storage type, you may also need `dvc remote modify` to
> provide credentials and/or configure other remote parameters.

See also [default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list),
[modify](/doc/command-reference/remote/modify), and
[remove](/doc/command-reference/remote/remove) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote add [-h] [--global] [--system] [--local] [-q | -v]
                      [-d] [-f] name url

positional arguments:
  name           Name of the remote.
  url            URL. (See supported URLs in the examples below.)
```

## Description

`name` and `url` are required. `url` specifies a location to store your data. It
can be an SSH, S3 path, Azure, Google Cloud address, Aliyun OSS, local
directory, etc. (See all the supported remote storage types in the examples
below.) If `url` is a local relative path, it will be resolved relative to the
current working directory but saved **relative to the config file location**
(see LOCAL example below). Whenever possible DVC will create a remote directory
if it doesn't exists yet. It won't create an S3 bucket though and will rely on
default access settings.

> If you installed DVC via `pip`, depending on the remote storage type you plan
> to use you might need to install optional dependencies: `[s3]`, `[ssh]`,
> `[gs]`, `[azure]`, and `[oss]`; or `[all]` to include them all. The command
> should look like this: `pip install "dvc[s3]"`. This installs `boto3` library
> along with DVC to support Amazon S3 storage.

This command creates a section in the <abbr>DVC project</abbr>'s
[config file](/doc/command-reference/config) and optionally assigns a default
remote in the core section if the `--default` option is used:

```ini
['remote "myremote"']
url = /tmp/dvc-storage
[core]
remote = myremote
```

DVC supports the concept of a _default remote_. For the commands that accept a
`--remote` option (`dvc pull`, `dvc push`, `dvc status`, `dvc gc`, `dvc fetch`),
the default remote is used if that option is not used.

Use `dvc config` to unset/change the default remote as so:
`dvc config -u core.remote`.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

- `-d`, `-default` - commands that require a remote (such as `dvc pull`,
  `dvc push`, `dvc fetch`) will be using this remote by default to upload or
  download data (unless their `-r` option is used).

- `-f`, `--force` - overwrite existing remote with new `url` value.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Custom configuration of an S3 remote

Add an Amazon S3 remote as the _default_ (via `-d` option), and modify its
region:

```dvc
$ dvc remote add -d myremote s3://mybucket/myproject
Setting 'myremote' as a default remote.

$ dvc remote modify myremote region us-east-2
```

The <abbr>project</abbr>'s config file (`.dvc/config`) now looks like this:

```ini
['remote "myremote"']
url = s3://mybucket/myproject
region = us-east-2
[core]
remote = myremote
```

The list of remotes should now be:

```dvc
$ dvc remote list

myremote	s3://mybucket/myproject
```

You can overwrite existing remotes using `-f` with `dvc remote add`:

```dvc
$ dvc remote add -f myremote s3://mybucket/mynewproject
```

List remotes again to view the updated remote:

```dvc
$ dvc remote list

myremote	s3://mybucket/mynewproject
```
