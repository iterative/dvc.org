# Configuration

Once you install DVC, you will be able to start using it (in its local setup)
immediately.

However, you can proceed to configure DVC. Most likely you need to setup at
least a remote storage to preserve and share your data artifacts.


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


## Remote Data Storages

Using DVC with a remote data storage is optional. By default, DVC is
configured to use a local data storage only (`.dvc/cache` directory), which
enables basic DVC usage scenarios out of the box.

The same way as Github serves as a master storage for Git-based projecs, DVC
remotes provide a central place to keep and share data and model files. With a
remote data storage, you can pull models and data files which were created by
your team members without spending time and resources to re-build models and
re-process data files. It also saves space on your local environment - DVC can
fetch into the local cache only the data you need for a specific branch/commit.

As of this version, DVC supports five types of data storages (remotes):

* `local` - Local directory
* `s3` - Amazon Simple Storage Service
* `gs` - Google Cloud Storage
* `ssh` - Secure Shell
* `hdfs` - The Hadoop Distributed File System

The subsections below explain how to configure DVC to use each of them.


#### S3

```sh
    $ dvc remote add -d myremote s3://mybucket/myproject
```

#### GS

```sh
    $ dvc remote add -d myremote gs://mybucket/myproject
```

#### SSH

```sh
    $ dvc remote add -d myremote ssh://user@example.com:/path/to/myproject
```

#### HDFS

```sh
   $ dvc remote add -d myremote hdfs://user@example.com/path/to/myproject
```
