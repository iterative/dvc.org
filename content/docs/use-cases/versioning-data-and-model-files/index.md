# Versioning Data and Model Files

> This document provides an overview the file versioning workflow with DVC. To
> get more hands-on experience on this, we recommend following along the
> [versioning tutorial](/doc/tutorials/versioning).

DVC enables versioning large files and directories such as datasets, data
science features, and machine learning models with Git, without storing the file
contents in Git. DVC saves information about your data in special
[metafiles](/doc/user-guide/dvc-files-and-directories) that replace the data in
the repository. These can versioned with regular Git workflows (commits,
branches, pull requests, etc.) To actually store the data, DVC uses a built-in
<abbr>cache</abbr>, and supports synchronizing it with various types of
[remote storage](/doc/command-reference/remote). This allows easily storing and
sharing data alongside code.

![](/img/model-versioning-diagram.png) _Code and data flows in DVC_

In a basic scenario, DVC is a better replacement for Git-LFS (and
[the like](/doc/user-guide/related-technologies)) and for ad-hoc scripts on top
of cloud storage that are used to manage ML <abbr>artifacts</abbr> like training
data, models, etc. DVC doesn't depend on 3rd party services and can leverage
on-premises storage (e.g. SSH, NAS) as well as any major cloud storage provider
(Amazon S3, Microsoft Azure, Google Drive,
[among others](/doc/command-reference/remote/add#supported-storage-types)).

Let's say you already have a Git repo and put a bunch of images in the `images/`
directory, Then you build a `model.pkl` using them.

## Track data (DVC) and version it (Git)

```dvc
$ ls images
0001.jpg 0002.jpg 0003.jpg 0004.jpg ...

$ ls
model.pkl
```

To start using DVC, we need to [initialize](/doc/command-reference/init) a
<abbr>DVC project</abbr> in the existing repo:

```dvc
$ dvc init
```

Start tracking the data directory and the model with `dvc add`:

```dvc
$ dvc add images
$ dvc add model.pkl
```

> See [Data Pipelines](/doc/start/data-pipelines) for more advanced ways to
> version ML projects.

This generates `.dvc` files, and puts the originals in `.gitignore`. Commit this
project's version:

```dvc
$ git status
...
Untracked files:
    .gitignore
    images.dvc
    model.pkl.dvc

$ git add images.dvc model.pkl.dvc .gitignore
$ git commit -m "Track images and model with DVC."
$ git tag -a "v1.0" -m "images and model 1.0"
```

## Switching versions

After iterating on this process and producing several versions, there are two
ways to get the original version of the dataset or model, using `dvc checkout`.
You can either do a full <abbr>workspace</abbr> checkout, or checkout specific
parts of the project. Let's consider the full checkout first:

```dvc
$ git checkout v1.0
$ dvc checkout
M       images
M       model.pkl
```

These commands will restore the workspace to the first snapshot we made - code,
dataset and model files all matching each other. DVC can
[optimize](/doc/user-guide/large-dataset-optimization) this operation by
avoiding copying files each time, so checking out data is quick even if you have
large dataset or model files.

> See `dvc install` to auto-checkout data after `git checkout`, and other useful
> hooks.

On the other hand, if we want to keep the current version of code and go back to
the previous dataset only, we can do something like this (assuming no
uncommitted changes in `images.dvc`):

```dvc
$ git checkout v1.0 images.dvc
$ dvc checkout images.dvc
M       images
```

If you run `git status` you will see that `images.dvc` matches the `v1.0`
version of the <abbr>cached</abbr> images. Meanwhile, code and model files
remain on their latest versions.

![](/img/versioning.png)

To share your data with others you need to setup a
[data storage](/doc/command-reference/remote). See the
[Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files) use
case to get an overview on how to do this.
