# Versioning Data and Model Files

> This document provides an overview the file versioning workflow with DVC. To
> get more hands-on experience on this, we recommend following along the
> [Versioning](/doc/tutorials/versioning) tutorial.

DVC allows versioning data files and directories, intermediate results, and ML
models using Git, but without storing the file contents in the Git repository.
It's useful when dealing with files that are too large for Git to handle
properly in general. DVC saves information about your data in special
[DVC-files](/doc/user-guide/dvc-file-format), and these metafiles can be used
for versioning. To actually store the data, DVC supports various types of
[remote storage](/doc/command-reference/remote). This allows easily saving and
sharing data alongside code.

![](/img/model-versioning-diagram.png)

In this basic scenario, DVC is a better replacement for `git-lfs` (see
[Related Technologies](/doc/understanding-dvc/related-technologies)) and for
ad-hoc scripts on top of Amazon S3 (or any other cloud) used to manage ML
<abbr>data artifacts</abbr> like raw data, models, etc. Unlike `git-lfs`, DVC
doesn't require installing a dedicated server; It can be used on-premises (e.g.
SSH, NAS) or with any major cloud storage provider (Amazon S3, Microsoft Azure
Blob Storage, Google Drive, Google Cloud Storage, etc).

Let's say you already have a Git repository and put a bunch of images in the
`images/` directory, and build a `model.pkl` ML model file using them.

```dvc
$ ls images
0001.jpg 0002.jpg 0003.jpg 0004.jpg ...

$ ls
model.pkl
```

To start using DVC we need to [initialize](/doc/command-reference/init) a
<abbr>DVC project</abbr> on top of the existing Git repo:

```dvc
$ dvc init
```

Start tracking the models and images directory with `dvc add`:

```dvc
$ dvc add images
$ dvc add model.pkl
```

> Refer also to `dvc run` for more advanced ways to version data and data
> processes.

Commit your changes:

```dvc
$ git status
...
Untracked files:
    .gitignore
    images.dvc
    model.pkl.dvc

$ git add .gitignore images.dvc model.pkl.dvc
$ git commit -m "Track images and model with DVC"
```

There are two ways to get to the previous version of the dataset or model: a
full <abbr>workspace</abbr> checkout, or checkout of a specific data or model
file. Let's consider the full checkout first. It's quite straightforward:

> `v1.0` below is a Git tag that identifies the dataset version you are
> interested in. Any
> [Git reference](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
> (for example `HEAD^` or a commit hash) can be used instead.

```dvc
$ git checkout v1.0
$ dvc checkout
M       images
M       model.pkl
```

These commands will restore the workspace to the first snapshot we made - code,
dataset and model files all matching each other. DVC can
[optimize](/doc/user-guide/large-dataset-optimization) this operation to avoid
copying files each time, so `dvc checkout` is quick even if you have large
dataset or model files.

On the other hand, if we want to keep the current version of code and go back to
the previous dataset only, we can do something like this (make sure that you
don't have uncommitted changes in the `data.dvc`):

```dvc
$ git checkout v1.0 images.dvc
$ dvc checkout images.dvc
M       images
```

If you run `git status` you will see that `data.dvc` is modified and currently
points to the `v1.0` version of the <abbr>cached</abbr> data. Meanwhile, code
and model files are their latest versions.

![](/img/versioning.png)

To share your data with others you need to setup a
[data storage](/doc/command-reference/remote). See the
[Sharing Data And Model Files](/doc/use-cases/sharing-data-and-model-files) use
case to get an overview on how to do this.

Please also don't forget to see the [Versioning](/doc/tutorials/versioning)
example to get a hands-on experience with datasets and models versioning.
