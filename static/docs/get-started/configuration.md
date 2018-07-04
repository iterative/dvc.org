# Configuration

Once you install DVC, you will be able to start using it (in its local setup)
immediately.

However, you can proceed to configure DVC (especially if you intend to use it in
a *cloud-based* scenario).


## DVC Files and Directories

Once installed, DVC populates its installation folder (hereafter referred to
as .dvc)

* `.dvc/config` - This is a configuration file.
  The config file can be edited by hand or with a special command: `dvc config`.
* `.dvc/cache` - the cache directory will contain your data files (the data
  directories of DVC repositories will only contain links to the data files
  in the cache).
  **Note:** DVC includes the cache directory to `.gitignore` file during the
  initialization. And no data files (with actual content) will ever be pushed to
  Git repository, only dvc-files that are needed to reproduce them.
* `.dvc/state` - this file is used for optimization. The file contains data
  files checksums with respective timestamps and inodes to avoid unnecessary
  checksum computations.


## Cloud Data Storages

Using DVC with Cloud-based data storage is optional. By default, DVC is
configured to use a local data storage only (.dvc/cache directory), which
enables basic DVC usage scenarios out of the box.

DVC can use cloud storage as a common file storage.
With cloud storage, you might use models and data files which were created by
your team members without spending time and resources to re-build models and
re-process data files.

As of this version, DVC supports four types of cloud-based storage providers:

* `S3` - Amazon Simple Storage Service
* `GS` - Google Cloud Storage
* `SSH` - Secure Shell
* `HDFS` - The Hadoop Distributed File System

The subsections below explain how to configure DVC to use each of them.


### S3

```sh
    $ dvc remote add -d myremote s3://mybucket/myproject
```

### GS

```sh
    $ dvc remote add -d myremote gs://mybucket/myproject
```

### SSH

```sh
    $ dvc remote add -d myremote ssh://user@example.com:/path/to/myproject
```

### HDFS

```sh
   $ dvc remote add -d myremote hdfs://user@example.com/path/to/myproject
```
