# Configure

Once you install DVC, you will be able to start using it (in its local setup)
immediately. However, you can proceed to configure DVC. Most likely you need to
setup at least a remote storage to preserve and share your data.

As of this version, DVC supports six types of data storage (remotes):

* `local` - Local directory
* `s3` - Amazon Simple Storage Service
* `gs` - Google Cloud Storage
* `azure` - Azure Blob Storage
* `ssh` - Secure Shell
* `hdfs` - The Hadoop Distributed File System

For example, to setup an S3 remote:

```dvc
    $ dvc remote add -d myremote s3://mybucket/myproject
```

See `dvc config` to get information about more configuration options and `dvc
remote` to learn more about remotes and get more examples.
