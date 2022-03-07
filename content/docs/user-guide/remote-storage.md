# Remote Storage

## Introduction

DVC can use remote storage instead of local disk space for storing previously
committed versions of your project. You may need to do this if, for example,

- You don't have enough disk space for storing all the old versions locally.
  Projects with very large data files that change frequently, or projects
  involving datasets with a massive number of smaller files (e.g.
  [ImageNet](https://www.image-net.org/)) that you are changing (e.g.
  preprocessing ) in different ways may run in to this problem. The default
  place that DVC stores this data is `.dvc\cache` in your local project folder,
  and this is updated everytime you issue `dvc commit`. If you are committing
  frequently, and making big changes with each commit, you could easily run out
  of local storage after a while.
- You want a backup of your project. Just as git projects can be pushed to
  [github.com](github.com) or similar after a `git commit`, DVC can push the
  project to remote storage after a DVC commit. This is a convenient and simple
  way to make frequent backups easily integrating with your normal workflows.
- You want to share large projects with your team while minimising both data
  transfer and cloud storage charges. A huge benefit of DVC remote storage is
  space optimisation. Using
  [content-addressable storage](/doc/user-guide/project-structure/internal-files),
  DVC ensures that duplicate files are stored once and once only, even if they
  are meant to be different files with different names. This feature enables
  efficient sharing of project files.

The following example illustrates the interplay between the project folder on
the local workstation, the local DVC cache, and remote storage:

![Local cache and remote storage](/img/remote_storage.png)

Multiple old versions of the project (six of them, in fact) are being archived
on remote storage. The current working version of the project (version 7) has
just been committed to the local cache with `dvc commit`, but not yet pushed to
remote storage. Locally, only the most recent three versions of the project are
stored. The data scientist recently cleared the local cache using DVC's garbage
collection command `dvc gc`. Periodically, she/he issues `dvc push` to send new
committed versions of the project to remote storage, and can retrieve old
versions using `dvc pull` if needed.

## Connecting and Pushing to Remote Storage

Multiple cloud storage providers can be used with DVC, and connecting is fairly
straightforward using the `dvc remote` command. For example, to connect your
project to an [Amazon AWS](https://aws.amazon.com) S3 bucket, name the remote
`s3remote`, and set it as your default remote storage, you would issue the
following command:

```dvc
$ dvc remote add --default s3remote s3://path/to/cache
```

The `dvc remote add` docs outline connecting DVC to other specific providers
such as [Microsoft Azure](https://azure.microsoft.com/), and we've also provided
an example specifically about
[Google Drive as a DVC remote](/doc/user-guide/setup-google-drive-remote). Once
your remotes are configured, you can double check that the remote storage was
added correctly using `dvc remote list`. In this example, two remotes are set
up, one on the cloud and one on a `work` folder on a mounted volume:

```dvc
$ dvc remote list
s3cache	s3://yourbucket/yourremotecache/
work  	/Volumes/ds_team/work
```

💡 Before adding cloud remote storage to your project, you need to ensure that
you have configured access to the remote storage correctly. This is dependent on
how your cloud storage provider works and will vary depending on the provider.
For example, for if you want to use an Amazon S3 bucket for remote storage then
you need to
[configure DVC for S3 access](/doc/command-reference/remote/add#supported-storage-types)
and [install the S3 version of DVC](/doc/install). Further instructions are
specific to the cloud service providers and may change from time to time.

One remote storage is correctly set up, there are three main steps you need to
take store versions of your project there:

1. Commit the project to your local cache with `dvc commit`; this makes a new
   local version of the project.
2. Push this new version to the remote storage with `dvc push` (use the `-r`
   option to specify which remote storage if you are not using the default
   storage).
3. Optionally clear out your local workstation cache with `dvc gc`, the garbage
   collector, to free up space on the local filesystem.

A local folder can also be used as remote storage as shown in the example above
where a remote storage named `work` has been configured. This is useful if, for
example, you have a network share mounted and want to use that instead of a
cloud provider.

## Content Addressable Storage Format

DVC optimises the storage space used in the local cache and remotes by ensuring
no duplicate files are stored. Duplicate files accumulate for lots of reasons,
for example:

- You commit a new version of a project without any changes to a very large
  file. It makes no sense to actually store two copies of these files, even
  though the file appears in two different versions of the project.
- You copy an image dataset so you can add new data to it, but want to keep the
  original dataset unchanged. The new version of the image dataset will contain
  an entire copy of the entire original dataset.
- You copy a large file, but don't change the copy, so you have two files with
  different names and other metadata but the exact same content.

The way that DVC determines if two different files are duplicates comes from a
computer science idea called
[content-addressable storage](/doc/user-guide/project-structure/internal-files).
Basically, a unique hash of the file's _content_ (ignoring file metadata) is
calculated. For every pair of files with different content, therefore, the
unique hashes should be different; but if two files have the same content (even
though they may differ in metadata such as file name and creation time), then
the hashes will be the same. DVC renames files with their hash and stores the
real names elsewhere. In this way, it can track files that change, track files
that don't change, and determine which (apparently different) files are
identical. DVC does a similar trick for directories, ensuring that directory
changes (e.g. adding new files) are also detectable and trackable.

💡 The specific type of hash used by DVC currently is the
[MD5 hash](https://en.wikipedia.org/wiki/MD5).

Let's look at a simple example: the file `a.dat`. After adding the file to the
project with `dvc add a.dat`, a new file `a.dat.dvc` is created in the project
folder. The new file contains the hash of `a.dat`, which can be looked at by
examining the file:

```dvc
$ cat a.dat.dvc
outs:
- md5: bba40b7807c80d3f44787b9c6a4aabee
  size: 1047565
  path: a.dat
```

The original `a.dat` has now been renamed to `bb\a40b7807c80d3f44787b9c6a4aabee`
and moved to the local cache. The version of `a.dat` that we now see in the
project directory is now a
[file link](doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
that refers to the hash-named version of the file.

💡 Note that DVC supports file links that are
[reflinks](https://blog.ram.rachum.com/post/620335081764077568/symlinks-and-hardlinks-move-over-make-room-for)
(the default, if possible), hard links, soft links, and basic copies. Please
check your operating systems capabilities and configure DVC to use the
appropriate file link type using `dvc config` if needed.

When the project is committed and pushed, the version of `a.dat` in the cache
will be copied to remote storage. If `a.dat` changes later and is committed
again, then a new hash for the file will be computed, a new version of the file
will be created in the cache, and the file link in the project directory is
updated.

The next brief example shows a directory `myDir` tracked by DVC containing two
files `a` and `b`:

![Local cache and remote storage](/img/cache_structure.png)

The cache in this example contains three versions of the directory. When the
project was first committed, the directory contained only the file `a`, as
illustrated by the directory in the cache with hash starting `6e..`. The second
version of the directory was committed after the file `b` was added and a new
hash `22...` for the directory was calculated. The third version of the
directory was committed after `b` was changed. This is reflected in new hashes
for both the directory and `b` (`ef...` and `6d...` specifically). DVC is
therefore storing two versions of `b` in the cache, but only one copy of `a`
(since, naturally, file `a` has not changed). Also shown in the figure is the
file `myDir.dvc`, the metadata file specifying the MD5 hash of the
``current'' version of `myDir` in the cache.

Both remote storage and local cache use the same format for organising and
naming your project files. If you have just committed and pushed your changes
from the local workstation to the remote storage, there should be identical
folders in both places.

## Sharing Files via Remote Storage

A disadvantage of content addressable storage is that the folder and file
structure of the local cache/remote storages is obfuscated and no longer
readable. The original directory and filenames are lost thanks to the use of
hashes as the new names, and there are many more objects than there are files in
the project because of the versioning (since deleted and changed files and
directories need to be kept around).

Consequently, you cannot simply browse the remote storage folders that DVC
controls in the same way you would browse a normal shared network/cloud drive.
Similarly, new files cannot be copied to the remote folder in the usual ways
(e.g. via drag and drop) if you want to share them. You can, however, share
files with your team using DVC. The basic approach is to follow the standard DVC
workflow:

1. Have the file(s) you want to share in your local project folder and add them
   with `dvc add`.
2. Commit the project using `git` and `dvc`, and push the changes to the
   DVC-configured remote storage.
3. Have your teammates checkout the latest version of the project, then pull
   from the remote storage. They should receive the file(s) being shared into
   their local project folder.
