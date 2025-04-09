# remote

A set of commands to set up and manage [remote storage]: [add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default), [list](/doc/command-reference/remote/list),
[modify](/doc/command-reference/remote/modify), [remove](/doc/command-reference/remote/remove),
and [rename](/doc/command-reference/remote/rename).

[remote storage]: /doc/user-guide/data-management/remote-storage

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

DVC remotes are distributed storage locations for your data sets and ML models
(similar to Git remotes, but for <abbr>cached</abbr> assets). This optional
feature is typically used to share or back up copies of all or some of your
data. Several types are supported: Amazon S3, Google Drive, SSH, HTTP, local
file systems, [among others].

[among others]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types

<admon icon="book">

Learn more about [remote storage].

</admon>

`dvc remote` subcommands read or modify DVC [config files] (`.dvc/config` by default).
Alternatively, the config files can be edited manually.

[types of storage]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types
[config files]: /doc/user-guide/project-structure/configuration

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Add a default local remote

<admon type="tip">

Learn more about
[local remotes](/doc/user-guide/data-management/remote-storage#file-systems-local-remotes).

</admon>

We use the `-d` (`--default`) option of `dvc remote add` for this:

```cli
$ dvc remote add -d myremote /path/to/remote
```

The <abbr>project</abbr>'s config file should now look like this:

```ini
['remote "myremote"']
    url = /path/to/remote
[core]
    remote = myremote
```

## Example: List all remotes in the project

```cli
$ dvc remote list
myremote    /path/to/remote    (default)
newremote    s3://mybucket/path
```

## Example: Customize an additional S3 remote

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```cli
$ dvc remote add newremote s3://mybucket/path
$ dvc remote modify newremote endpointurl https://object-storage.example.com
```

The project's config file should now look something like this:

```ini
['remote "myremote"']
    url = /path/to/remote
[core]
    remote = myremote
['remote "newremote"']
    url = s3://mybucket/path
    endpointurl = https://object-storage.example.com
```

## Example: Change the name of a remote

`dvc remote modify` can't change the name of a DVC remote, but there's a
specific subcommand for this:

```cli
$ dvc remote rename oldremote newremote
```

## Example: Remove a remote

```cli
$ dvc remote remove oldremote
```
