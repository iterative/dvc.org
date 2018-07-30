# Configure

Once you install DVC, you will be able to start using it (in its local setup)
immediately.

However, a remote storage (or remote) should be set up if you need to share data outside of a local environment.

As of this version, DVC supports six types of remotes:

* `local` - Local directory
* `s3` - Amazon Simple Storage Service
* `gs` - Google Cloud Storage
* `azure` - Azure Blob Storage
* `ssh` - Secure Shell
* `hdfs` - The Hadoop Distributed File System

A remote can be specified by the remote type preffix and a path.
For example, to setup an S3 remote:

```dvc
    $ dvc remote add -d myremote s3://mybucket/myproject
```

See `dvc config` to get information about more configuration options and `dvc
remote` to learn more about remotes and get more examples.
