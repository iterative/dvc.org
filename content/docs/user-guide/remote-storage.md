# Remote Storage

## Introduction

DVC can use remote storage instead of local disk space for storing committed
versions of project files. Many ML pipelines have files that are very large
(e.g. large numeric datasets), or alternatively they have large quanitities of
smaller files (e.g. images), so it might be preferable for you to use remote
storage in these cases. In fact, there are four main reasons for using remote
storage in DVC:

- You don't have enough disk space for storing all the old previous committed
  versions of your project. The default place that DVC stores this data is
  `.dvc\cache` in your project folder, which is updated everytime you issue a
  `dvc commit` command. This is on your local workstation. If you are committing
  a lot, and making big changes, you may not necessarily want all this data
  locally!
- You want a backup of your project. Remote storage can be used for this purpose
  since a copy of the current project is made with every commit and push.
- You want to store large amounts of data while minimising both data transfer
  and cloud storage charges.
- You want to share your project with others on your team.

A huge benefit of DVC remote storage is space optimisation. Using
[content-addressable storage](/doc/user-guide/project-structure/internal-files),
DVC ensures that duplicate files are stored once and once only.

The following diagram illustrates the interplay between the project folder on
the local workstation, the local DVC cache, and remote storage:

![Local cache and remote storage](/img/remote_storage.png)

The figure shows multiple old versions of the project (six of them, in fact)
being archived on remote storage. The current working version of the project
(version 7) has just been committed to the local cache with `dvc commit`, but
not yet pushed to remote storage. Locally, only the most recent three versions
of the project are stored, with older versions having been cleared out of the
local cache using the garbage collection command `dvc gc`. Periodically, the
data scientist issues `dvc push` to send new committed versions of the project
to remote storage, and can retrieve old versions using `dvc pull` if needed.

## Connecting and Pushing to Remote Storage

Multiple cloud storage providers can be used with DVC, and connecting is pretty
easy using the `dvc remote` command. For example:

```dvc
$ dvc remote add --default s3remote s3://path/to/cache
```

will connect your project to an [Amazon AWS](https://aws.amazon.com) S3 bucket,
name the remote to ``s3remote", and set it as your default remote. The `dvc
remote
add`docs outline connecting DVC to other specific providers such as [Microsoft Azure](https://azure.microsoft.com/), and we've also provided an example specifically about [Google Drive as a DVC remote](/doc/user-guide/setup-google-drive-remote). Once your remotes are configured, you can double check that the remote storage was added correctly using`dvc
remote list`.

Once a remote set up, there are three main steps you need to take to send your
project files to the remote:

- commit the project to your local cache with `dvc commit`, creating a new
  version of the project;
- push this new version to the remote with `dvc push` (use the `-r` option to
  name the remote storage if the remote was not set up as the default);
- optionally clear out your local workstation cache with `dvc gc`.

💡 Before adding cloud remote storage to your project, you need to ensure that
you have configured access to the remote storage correctly. This is dependent on
how your cloud storage provider works and will vary depending on the provider.
For example, for if you want to use an Amazon S3 bucket for remote storage then
you need to
[configure DVC for S3 access](/doc/command-reference/remote/add#supported-storage-types)
and [install the S3 version of DVC](/doc/install).

Remote storage can also be a local folder outside of your project directory.
This is useful if, for example, you have a network share mounted and want to use
that instead of a cloud provider.

## Content Addressable Storage Format

DVC optimises the storage space used in the local cache and remotes by ensuring
that no duplicate files are stored. Duplicate files might accumulate for lots of
reasons, for example:

- You create a new version or branch of a project but only change some files,
  leaving other big files unchanged.
- You copy an image dataset so you can add new data to it, but want to keep the
  original dataset unchanged. The new version of the image dataset will contain
  an entire copy of the entire original dataset.
- You copy a large file, but don't change the copy, so you have two files with
  different names but the same content.

The way that DVC determines if two different files are duplicates is based on an
idea called
[content-addressable storage](/doc/user-guide/project-structure/internal-files).
Basically, a hash of the file is calculated based on the file content. For every
different pair of files, the hashes should be different; but if two files are
identical, then the hashes will be the same. DVC then names the file with its
hash, and stores the real names elsewhere. In this way, DVC can track files that
change and don't change and determine if different files are identical. DVC also
computes hashes for directories, ensuring that changes to directories can be
tracked as well.

💡 The specific type of hash used by DVC currently is the
[MD5 hash](https://en.wikipedia.org/wiki/MD5).

In the following example, the hashes for multiple versions of one directory
named `myDir` and two files `a` and `b` contained inside the directory are
shown:

![Local cache and remote storage](/img/cache_structure.png)

The cache contains three versions of the directory. When the project was
initially committed, the directory contained only the file `a`. The second
version of the directory was committed after the file `b` was added. The third
version of the directory was committed after `b` was changed, and so DVC has
stored both versions of `b`. Through the entire life of the project so far, the
file `a` has not changed, and so only one copy of it is ever stored by DVC (even
through it appears in three versions of `myDir`). Also shown in the figure is
the file `myDir.dvc`, a metadata file specifying which version of the directory
is the ``current'' version.

💡 This type of naming is an example of
[Indirection](https://en.wikipedia.org/wiki/Indirection), a common concept from
computer science. The names `myDir`, `a` and `b` in the figure are indirect
references to actual objects which are identified by their hash.

Both remote storage and local cache use the same format for organising and
naming your project files. If you have just committed and pushed your changes
from the local workstation to the remote storage, there should be identical
folders in both places.

## Sharing Files via Remote Storage

A disadvantage of content addressable storage is that the local cache/remote
storage becomes obfuscated: original filenames are lost and there is no
one-to-one mapping between project files and objects in storage. Therefore you
can't browse remote storage folders in the same way you can browse a normal
shared drive. Similarly, new files cannot simplied be copied into the remote
folder and shared with others. Despite this, browsing and sharing files on the
remote storage is possible using DVC. You just need to do it in the ``DVC way'':

1. Have the file you want to share in your local project folder.
2. Commit and push the changes to the remote storage.
3. Have your teammates pull the latest version of the project from remote
   storage.
