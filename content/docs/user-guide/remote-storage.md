# Remote Storage

_📖 ⚠️💡_

## Introduction

Remote storage is used by DVC as place for storing versions of files that are
being tracked. Since many ML pipeline files are large, you might prefer to store
your data on a remote instead of your local workstation. 
There are three main use cases for remotes:

- You don't have enough disk space to store all old versions of your project in
  your project directory. By default, DVC uses a local cache directory
  `.dvc\cache` for storing old versions every time you issue a `dvc commit` command.
  If you are making many changes to these files, there may be many
  versions of these large files that you don't necessary want on your local hard
  drive!
- You want a backup of your project. Remotes can be a useful
  backup, and you can store as many old versions of the project as you need.
- You want to share your project with others on your team efficiently,
  minimising both data transfer and cloud storage charges.

A huge benefit of DVC remote storage is space optimisation. Using
[content-addressable storage](/doc/user-guide/project-structure/internal-files),
DVC ensures that duplicate files are stored once and once only.

The following diagram illustrates the interplay between the project folder on
the local workstation, the local DVC cache, and a remote storage:

![Local cache and remote storage](/img/remote_storage.png)

The figure shows all of the old versions of the project being archived on the
remote.
The current working version of the project has just been committed to the local
cache with `dvc commit`, where it is stored with a few but not all of the
earlier project versions. 
Periodically the data scientist issues `dvc push` to send committed versions of the project to the remote and
and `dvc gc` to clear out out versions from
the local cache.
If a really old version of the project is ever needed, it can be retrieved with
`dvc pull`.

## Connecting and Pushing to Remote Storage

Multiple cloud storage providers can be used with DVC,
and connecting is pretty easy. For example:
```dvc
$ dvc remote add --default s3remote s3://path/to/cache
```
will connect your project to an [Amazon AWS](https://aws.amazon.com) S3 bucket
and set that as your default remote.
The `dvc remote add` docs outline connecting DVC
to other specific providers such as [Microsoft
Azure](https://azure.microsoft.com/),
and we've also provided an example specifically about
[Google Drive as a DVC remote](/doc/user-guide/setup-google-drive-remote).
Once your remotes are configured,
you can double check that the remote storage was added correctly using 
`dvc remote list`.

Once a remote set up, there are three main steps you need to take to send your
project files to the remote:
- commit the project to the local cache with `dvc commit`, creating a new
  project version;
- push this new version to the remote with `dvc push` (use the `-r`
  option to name the remote storage if the remote was not set up as the default);
- optionally clear out your local workstation cache with DVC's garbage
  collection command, `dvc gc`.

## Content Addressable Storage Format

_explain the content addressible storage: hashes, indirection, multiple
versions; why obfuscation;_

DVC optimises the storage space used in the local cache and remotes
by ensuring no duplicate files are stored,
using an idea called [content-addressable storage](/doc/user-guide/project-structure/internal-files).
Duplicate files might accumulate for lots of reasons, for example:
- You create a new version or branch of a project but only change some files, leaving
  others unchanged.
- You copy an image dataset so you can add new data to it, but want to keep the
  original dataset unchanged. In this case, the second version of the dataset
  will contain an entire copy of the entire original dataset.
- You copy a large file, but don't change the copy, so you have two files with
  different names but the same content.

The way that DVC determines if two files are the same is via a hash:
two files with the same hash have the same content.
DVC also computes hashes for directories, ensuring that different versions
of directories can be tracked as well.

In the following example, the hashes for one directory named `myDir` and two
files `a` and `b` are shown: 

![Local cache and remote storage](/img/cache_structure.png)

The (local and/or remote) cache contains three
versions of the directory. The first version of the directory contained only
`a`. The second version of the directory was committed when `b` was added. The
third version of the directory was committed after `b` was changed. The file `a`
does not change at all. DVC maintains a `myDir.dvc` file associated with the
`myDir` directory: this file specifies which version of the directory is
``current", and details file associated with the directory version (a file
ending in `.dir`) specifies which versions of `a` and `b` are current.

## Sharing Files via Remote Storage

A disadvantage of content addressable storage is that the local cache/remote storage becomes
``obfuscated": 
original filenames are lost and there is no one-to-one mappings between roject
files and objects in storage. 
Therefore the remote storage folder cannot be used like a normal shared drive:
you cannot browse the folder for a specific file,
and new files cannot be dropped into the folder to be shared with others in your
team. 
However, sharing files is possible using DVC, and can be done in this way:
firstly, have the file you want to share in your local project folder;
secondly, commit and push the changes to the remote storage;
thirdly, have your teammates pull the latest version of the project from remote storage.
