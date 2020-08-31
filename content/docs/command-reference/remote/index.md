# remote

A set of commands to set up and manage data remotes:
[add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list),
[modify](/doc/command-reference/remote/modify),
[remove](/doc/command-reference/remote/remove), and
[rename](/doc/command-reference/remote/rename).

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

The same way as GitHub provides storage hosting for Git repositories, DVC
remotes provide a location to store and share data and models. You can pull data
assets created by colleagues from DVC remotes without spending time and
resources to build or process them locally. Remote storage can also save space
on your local environment – DVC can [fetch](/doc/command-reference/fetch) into
the <abbr>cache directory</abbr> only the data you need for a specific
branch/commit.

Using DVC with remote storage is optional. DVC commands use the local cache
(usually in dir `.dvc/cache`) as data storage by default. This enables the main
DVC usage scenarios out of the box.

DVC supports several types of remote storage: local file system, SSH, Amazon S3,
Google Cloud Storage, HTTP, HDFS, among others. Refer to `dvc remote add` for
more details.

> If you installed DVC via `pip` and plan to use cloud services as remote
> storage, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to
> include them all. The command should look like this: `pip install "dvc[s3]"`.
> (This example installs `boto3` library along with DVC to support S3 storage.)

### Managing remote storage

> For the typical process to share the <abbr>project</abbr> via remote, see
> [Sharing Data And Model Files](/doc/use-cases/sharing-data-and-model-files).

The [add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list),
[modify](/doc/command-reference/remote/modify),
[remove](/doc/command-reference/remote/remove), and
[rename](/doc/command-reference/remote/rename) subcommands read or modify DVC
[config files](/doc/command-reference/config), where DVC remotes are setup.
Alternatively, `dvc config` can be used, or the config files can be edited
manually.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Add a default local remote

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the type of location where the storage is: another directory in the
same file system. "Remote" is how we call storage for <abbr>DVC projects</abbr>.
It's essentially a local backup for data tracked by DVC.

</details>

We use the `-d` (`--default`) option of `dvc remote add` for this:

```dvc
$ dvc remote add -d myremote /path/to/remote
```

The <abbr>project</abbr>'s config file should now look like this:

```ini
['remote "myremote"']
url = /path/to/remote
[core]
remote = myremote
```

## Example: Customize an additional S3 remote

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
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

## Example: List all remotes in the project

```dvc
$ dvc remote list
myremote	/path/to/remote
newremote	s3://mybucket/path
```

## Example: Change the name of a remote

Notice that `dvc remote modify` doesn't provide a way to change the name of a
DVC remote, but there's a specific subcommand for this:

```dvc
$ dvc remote rename newremote oldremote
```

## Example: Remove a remote

```dvc
$ dvc remote remove oldremote
```
