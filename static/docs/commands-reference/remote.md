# remote

A set of commands to set up and manage data remotes:
[add](/doc/commands-reference/remote-add),
[default](/doc/commands-reference/remote-default),
[list](/doc/commands-reference/remote-list),
[modify](/doc/commands-reference/remote-modify), and
[remove](/doc/commands-reference/remote-remove).

## Synopsis

```usage
usage: dvc remote [-h] [-q | -v] {add,default,remove,modify,list} ...

positional arguments:
  COMMAND
    add                 Add remote.
    default             Set/unset default remote.
    remove              Remove remote.
    modify              Modify remote.
    list                List available remotes.
```

## Description

What is data remote?

The same way as Github serves as a master storage for Git-based projects, DVC
data remotes provide a central place to keep and share data and model files.
With a remote data storage, you can pull models and data files which were
created by your team members without spending time and resources to re-build
models and re-process data files. It also saves space on your local
environment - DVC can [fetch](/doc/commands-reference/fetch) into the local
cache only the data you need for a specific branch/commit.

> Depending on the [remote storage](/doc/commands-reference/remote) type you
> plan to use to keep and share your data you might need to specify one of the
> optional dependencies: `s3`, `gs`, `azure`, `ssh`. (Use `all_remotes` to
> include them all.) The command should look like this: `pip install "dvc[s3]"`.
> That particular example will include the `boto3` library along with the DVC
> installation in order to support AWS S3 storage. This is valid for the `pip`
> installation method only. Other ways to install DVC already include support
> for all remotes.

Using DVC with a remote data storage is optional. By default, DVC is configured
to use a local data storage only (usually `.dvc/cache` directory inside your
repository), which enables basic DVC usage scenarios out of the box.

[Add](/doc/commands-reference/remote-add),
[default](/doc/commands-reference/remote-default),
[list](/doc/commands-reference/remote-list),
[modify](/doc/commands-reference/remote-modify), and
[remove](/doc/commands-reference/remote-remove) commands read or modify DVC
[config files](/doc/commands-reference/config). Alternatively, `dvc config` can
be used or these files could be edited manually.

For the typical process to share the project via remote, see
[Share Data And Model Files](/doc/use-cases/share-data-and-model-files).

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

1. Let's for simplicity add a default local remote:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the machine where the project is stored, so it can be any directory
accessible to the same system. The "remote" part refers specifically to the
project/repository itself.

</details>

```dvc
$ dvc remote add -d myremote /path/to/remote
$ dvc remote list

myremote        /path/to/remote
```

DVC config file would look like:

```ini
['remote "myremote"']
url = /path/to/remote
[core]
remote = myremote
```

2. Add AWS S3 remote and modify its region:

> **Note!** Before adding a new remote be sure to login into AWS services and
> follow instructions at
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
> to create your bucket.

```dvc
$ dvc remote add mynewremote s3://mybucket/myproject
$ dvc remote modify mynewremote region us-east-2
```

3. Remove remote:

```dvc
$ dvc remote remove mynewremote
```
