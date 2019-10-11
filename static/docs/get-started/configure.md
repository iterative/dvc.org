# Configure

Once you install DVC, you'll be able to start using it (in its local setup)
immediately.

However, remote storage should be set up (see `dvc remote`) if you need to share
data or models outside of the context of a single project, for example with
other collaborators or even with yourself, in a different computing environment.
It's similar to the way you would use GitHub or any other Git server to store
and share your code.

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
$ git commit .dvc/config -m "Configure local remote"
```

> We only use a local remote in this guide for simplicity's sake as you learn to
> use DVC. For most [use cases](/doc/use-cases), other "more remote" types of
> remotes will be required.

Adding a remote should be specified by both its type prefix (protocol) and its
path. DVC currently supports seven types of remotes:

- `local`: Local Directory
- `s3`: Amazon Simple Storage Service
- `gs`: Google Cloud Storage
- `azure`: Azure Blob Storage
- `ssh`: Secure Shell
- `hdfs`: Hadoop Distributed File System
- `http`: HTTP and HTTPS protocols

> If you installed DVC via `pip`, depending on the remote type you plan to use
> you might need to install optional dependencies: `[s3]`, `[ssh]`, `[gs]`,
> `[azure]`, and `[oss]`; or `[all]` to include them all. The command should
> look like this: `pip install "dvc[s3]"`. This installs `boto3` library along
> with DVC to support Amazon S3 storage.

For example, to setup an S3 remote we would use something like this (make sure
that `mybucket` exists):

```dvc
$ dvc remote add -d s3remote s3://mybucket/myproject
```

> This command is only shown for informational purposes. No need to actually run
> it in order to continue with this guide.

You can see that DVC doesn't require installing any databases, servers, or
warehouses. It can use bare S3 or SSH to store data, intermediate results, and
models.

See `dvc config` to get information about more configuration options and
`dvc remote` to learn more about remotes and get more examples.
