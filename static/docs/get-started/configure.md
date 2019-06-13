# Configure

Once you install DVC, you will be able to start using it (in its local setup)
immediately.

However, remote storage should be set up (see `dvc remote`) if you need to share
data or models outside of the context of single project, for example with other
collaborators or even with yourself, in a different computing environment. It's
similar to the way you would use Github or any other Git server to store and
share your code.

For simplicity, let's setup a local remote:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the machine where the project is stored, so it can be any directory
accessible to the same system. The "remote" part refers specifically to the
project/repository itself.

</details>

```dvc
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "initialize DVC local remote"
```

> We only use a local remote in this guide for simplicity's sake in following
> these basic steps as you are learning to use DVC. We realize that for most
> [use cases](/doc/use-cases), other "more remote" types of remotes will be
> required.

Adding a remote should be specified by both its type prefix and its path. DVC
currently supports seven types of remotes:

- `local` - Local directory
- `s3` - Amazon Simple Storage Service
- `gs` - Google Cloud Storage
- `azure` - Azure Blob Storage
- `ssh` - Secure Shell
- `hdfs` - The Hadoop Distributed File System
- `http` - Support for HTTP and HTTPS protocol

> Depending on the [remote storage](/doc/commands-reference/remote) type you
> plan to use to keep and share your data you might need to specify one of the
> optional dependencies: `s3`, `gs`, `azure`, `ssh`. Or `all_remotes` to include
> them all. The command should look like this: `pip install 'dvc[s3]'` - it will
> install `boto3` library along with DVC to support AWS S3 storage. This is
> valid for `pip install` option only. Other ways to install DVC already include
> support for all remotes.

For example, to setup an S3 remote we would use something like:

```dvc
$ dvc remote add -d s3remote s3://mybucket/myproject
```

> This command is only shown for informational purposes. No need to actually run
> it in order to continue with this guide.

You can see, that DVC does not require installing any databases, servers, or
warehouses. It can use bare S3 or SSH to store data, intermediate results, and
your models.

See `dvc config` to get information about more configuration options and
`dvc remote` to learn more about remotes and get more examples.
