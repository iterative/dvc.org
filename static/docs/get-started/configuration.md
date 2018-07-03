# Configuration

Once you install DVC, you will be able to start using it (in its local setup)
immediately.

However, you can proceed to configure DVC (especially if you intend to use it in
a *cloud-based* scenario).


## DVC Files and Directories

Once installed, DVC populates its installation folder (hereafter referred to
as .dvc)

* `.dvc/config` - This is a configuration file.
  The config file can be edited with a command: `dvc config NAME VALUE`.
* `.dvc/cache` - the cache directory will contain your data files (the data
  directories of DVC repositories will only contain hardlinks to the data files
  in the global cache).
  **Note:** DVC includes the cache directory to `.gitignore` file during the
  initialization. And no data files (with actual content) will ever be pushed to
  Git repository, only dvc-files are needed to reproduce them.
* `.dvc/state` - this file is created for optimization. The file contains data
  files checksum, timestamps, inodes, etc.


## Cloud Data Storages

Using DVC with Cloud-based data storage is optional. By default, DVC is
configured to use a local data storage only (.dvc/cache directory), which
enables basic DVC usage scenarios out of the box.

DVC can use cloud storage as a common file storage.
With cloud storage, you might use models and data files which were created by
your team members without spending time and resources to re-build models and
re-process data files.

As of this version, DVC supports two types of cloud-based storage providers:

* `AWS` - Amazon Web Services
* `GCP` - Google Cloud Platform

The subsections below explain how to configure DVC to use each of them.


### Using AWS

To use AWS as cloud storage for your DVC repositories, you should update these
`.dvc/config` options

* `Cloud = AWS` in the `Global` section.
* `StoragePath = /mybucket/dvc/tag_classifier` in the `AWS` section - path to a
    cloud storage bucket and directory in the bucket.
* `CredentialPath = ~/aws/credentials` in the `AWS` section - path to AWS
    credentials in your local machine (AWS cli command line tools creates this
    directory). On Mac, default value is `~/.aws/credentials`, and it is
    *%USERPATH%/.aws/credentials` on Windows.

Instead of manual file modification, we recommend you run the following
commands:

```sh
    # This step is not needed for new DVC repositories
    $ dvc config Global.Cloud AWS
    $ dvc config AWS.StoragePath /mybucket/dvc/tag_classifier

    # Not needed if AWS CLI is installed to default path
    $ dvc config AWS.CredentialPath ~/.aws/credentials

    # Not needed if you have only one AWS account
    $ dvc config AWS.CredentialSection default

    $ git commit -am "Change cloud to AWS"
```

**Important:** do not forget to commit the config file change to Git:
`git commit -am "Change cloud to AWS"`


### Using Google Cloud

For using GCP (Google Cloud Platform) as cloud storage for your DVC
repositories, you should update these `.dvc/config` options

* `Cloud = GCP` in the `Global` section.
* `StoragePath = /mybucket/dvc/tag_classifier` in the GCP section - run
    `dvc config GCP.StoragePath /my/path/to/a/bucket`
* `ProjectName = MyCloud` - a GCP specific project name.

**Important:** do not forget to commit the config file change to Git:
`git commit -am "Change cloud to GCP"`

Instead of manual file modification, we recommend you run the following
commands:

```sh
    $ dvc config Global.Cloud GCP
    $ dvc config GCP.StoragePath /mybucket/dvc/tag_classifier
    $ dvc config GCP.ProjectName MyCloud
    $ git commit -am "Change cloud to AWS"
```
