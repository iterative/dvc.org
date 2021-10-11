---
title: Data and Model Management Trail
---

As its name implies, DVC is used to control versions of data. It enables to keep
track of multiple versions of your datasets.

## Initialize a DVC project

Suppose we are working on a deep learning project to develop the next ground
breaking supervised learning model. We plan to test the classifier in MNIST
dataset, but we also plan to use a more difficult one, Fashion MNIST. We want to
keep track of these two datasets and replace with each other easily, without
changes in the code.

We need a way to track these two datasets as if they are versions of the same
text file. DVC is used for this kind of data and model file tracking as if they
are code files.

#### ✍🏻 We download MNIST data from a URL using wget/curl

We first download the example project from a point where only the source code
files are present.

```dvc
$ git clone https://github.com/iterative/example-data-management -b get-started
$ cd example-data-management
```

The data is not provided with the source code and we need to download it
separately.

```dvc
$ wget https://dvc.org/datasets/mnist.zip -o data/mnist.zip
```

> Later on, we'll see how to automate this procedure and how DVC can track the
> data along with the code. We're just starting journey.

## Adding data to DVC projects

We add data and model files (and directories) to DVC with `dvc add` command.

```dvc
$ dvc add data/mnist.zip
```

DVC stores information about the added file (or a directory) in a special `.dvc`
file named `data/mnist.zip.dvc` a small text file with a human-readable
[format](/doc/user-guide/project-structure/dvc-files). This metadata file is a
placeholder for the original data, and can be easily versioned like source code
with Git:

```dvc
$ git add data/mnist.zip.dvc data/.gitignore
$ git commit -m "Add zipped MNIST data"
```

The original data, meanwhile, is listed in `.gitignore`.

## Versioning data in DVC projects

Suppose you have run the [experiments] with MNIST and would like to see your
model's performance in another dataset. You can update the code to use a
different dataset but here, in order to demonstrate how DVC makes it easy to
update the data, we'll write Fashion-MNIST over MNIST.

```dvc
$ wget https://dvc.org/datasets/fashion-mnist.zip --force -o data/mnist.zip
```

Now, when we ask DVC about the changes in the workspace, it tells us that
`mnist.zip` has changed.

```dvc
$ dvc status
```

And we can add the newer version to DVC as well.

```dvc
$ dvc add data/mnist.zip
$ git add data/mnist.zip.dvc
$ git commit -m "Added Fashion MNIST dataset"
```

Now you have two different datasets in your cache, and you can switch between
them as if they are code files in a Git repository.

```dvc
$ git checkout HEAD~1
$ dvc checkout
```

Note that you can also keep these different version in separate Git branches or
tags. Their content is saved in `.dvc/cache` in the project root and only a
reference in the form of `.dvc` file is kept in Git.

Yes, DVC is technically not even a version control system! `.dvc` file contents
define data file versions. Git itself provides the version control. DVC in turn
creates these `.dvc` files, updates them, and synchronizes DVC-tracked data in
the <abbr>workspace</abbr> efficiently to match them.

<details>

### ℹ️ Large datasets versioning

In cases where you process very large datasets, you need an efficient mechanism
(in terms of space and performance) to share a lot of data, including different
versions. Do you use network attached storage (NAS)? Or a large external volume?
You can learn more about advanced workflows using these links:

- A [shared cache](/doc/user-guide/how-to/share-a-dvc-cache) can be set up to
  store, version and access a lot of data on a large shared volume efficiently.
- A quite advanced scenario is to track and version data directly on the remote
  storage (e.g. S3). See
  [Managing External Data](https://dvc.org/doc/user-guide/managing-external-data)
  to learn more.

</details>

## Sharing data and models

You can upload DVC-tracked data or model files with `dvc push`, so they're
safely stored [remotely](/doc/command-reference/remote). This also means they
can be retrieved on other environments later with `dvc pull`. First, we need to
set up a remote storage location:

```dvc
$ dvc remote add -d storage s3://mybucket/dvcstore
$ git add .dvc/config
$ git commit -m "Configure remote storage"
```

> DVC supports many remote storage types, including Amazon S3, SSH, Google
> Drive, Azure Blob Storage, and HDFS. See `dvc remote add` for more details and
> examples.

<details>

### ⚙️ Expand to set up remote storage.

DVC remotes let you store a copy of the data tracked by DVC outside of the local
cache (usually a cloud storage service). For simplicity, let's set up a _local
remote_:

```dvc
$ mkdir -p /tmp/dvcstore
$ dvc remote add -d myremote /tmp/dvcstore
$ git commit .dvc/config -m "Configure local remote"
```

> While the term "local remote" may seem contradictory, it doesn't have to be.
> The "local" part refers to the type of location: another directory in the file
> system. "Remote" is what we call storage for <abbr>DVC projects</abbr>. It's
> essentially a local data backup.

</details>

```dvc
$ dvc push
```

Usually, we also want to `git commit` and `git push` the corresponding `.dvc`
files.

## Pushing to/pulling from remotes

To demonstrate how we share the data files with DVC, let's clone the project to
a local directory.

```dvc
$ cd ..
$ git clone example-data-management example-data-management-clone
```

You can see that the clone doesn't contain the data files by checking the size
of both:

```dvc
$ du -hs example-data-management
$ du -hs example-data-management-clone
```

Now, we'll get the data files from the remote we configured earlier with a
single command.

```dvc
$ cd example-data-management-clone
$ dvc pull
```

> Note that `dvc pull` downloads only the files necessary in the workspace. To
> obtain all the cache files from all commits, use `--all-commits` flag.

```dvc
$ dvc pull
```

This is how we share the data and model files as attached to the repository.
Another person can just clone the Git repository and (if they have valid
credentials to access the DVC remote), `dvc pull` the files required to run the
project.

> 📖 See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Accessing public datasets and registries

Earlier, we got the data files with `wget` and downloaded to a directory in the
repository. DVC also provides an easier way to access the data files by the Git
repository they belong to.

For example, instead of downloading the dataset from a web URL, we can use its
reference in a Git repository:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          mnist/mnist.zip -o data/mnist.zip
```

If you observe the text file at
https://github.com/iterative/dataset-registry/mnist/mnist.zip.dvc, you'll see
that it's identical to the files `dvc add` produces. Similarly, you can publish
your dataset and models in Github by configuring a public DVC remote for them,
for anyone to access your work via the repository.

Read on or watch our video to see how to find and access models and datasets
with DVC.

https://youtu.be/EE7Gk84OZY8

### Find a file or directory

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example, let's see what's in the `mnist/` directory of our
[dataset-registry](https://github.com/iterative/dataset-registry) repo:

```dvc
$ dvc list https://github.com/iterative/dataset-registry
mnist/
```

The benefit of this command over browsing a Git hosting website is that the list
includes files and directories tracked by both Git and DVC (`mnist.zip` is not
visible if you
[check GitHub](https://github.com/iterative/dataset-registry/tree/master/mnist)).

## Track the data and models automatically

As `dvc get` can download the contents from a DVC repository, `dvc import` can
also download any file or directory, while also creating a `.dvc` file that
tracks the contents _from URL._

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             mnist/mnist.zip -o data/mnist.zip
```

This is similar to `dvc get` + `dvc add`, but the resulting `.dvc` files
includes metadata to track changes in the source repository. This allows you to
bring in changes from the data source later using `dvc update`.

`.dvc` files created by `dvc import` have special fields, such as the data
source `repo` and `path`, hence when the source changes DVC can follow the
origin and update the local datasets.

## Removing data from DVC projects

DVC copies the file contents to cache. Normally, all files referred by `.dvc`
files have their contents backed up in the cache, and if you have uploaded them,
they may have copies in the remotes as well.

You may want to delete these files from your local setup when you no longer need
them. It's possible to manually delete a `.dvc` file, but this won't remove the
content from cache. DVC provides two commands to remove a file from tracking,
and to remove the content from cache.

You can un-add a file from DVC using `dvc remove` command. When you don't want
to track `data/mnist.zip` with DVC, you can remove it using

```dvc
$ dvc remove data/mnist.zip.dvc
```

This command won't delete `data/mnist.zip` from the repository. It only removes
the tracking file, and updates `.gitignore`. It's the inverse operation of
`dvc add` for files.

`dvc remove` won't delete the cache contents either. If you the want to delete
the cache contents that doesn't have links from the workspace, DVC provides
`dvc gc` to clean up the cache.

```dvc
$ dvc gc --workspace
```

Note that, `dvc gc` requires a _scope_ argument to delete the files. It doesn't
operate on a default scope to prevent data loss.
