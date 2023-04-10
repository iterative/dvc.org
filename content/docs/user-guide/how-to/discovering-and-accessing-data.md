---
title: 'Get Started: Discovering and accessing data'
description: 'Get started with accessing data and models with DVC. Learn how to
bring, explore, and access data artifacts from outside the project'
---

# Get Started: Discovering and accessing data

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/EE7Gk84OZY8

</details>

We've learned how to _track_ data and models with DVC, and how to commit their
versions to Git. The next questions are: How can we _use_ these artifacts
outside of the project? How do we download a model to deploy it? How to download
a specific version of a model? Or reuse datasets across different projects?

<admon type="tip">

These questions tend to come up when you browse the files that DVC saves to
[remote storage] (e.g.
`s3://dvc-public/remote/get-started/fb/89904ef053f04d64eafcc3d70db673` 😱
instead of the original file name such as `model.pkl` or `data.xml`).

[remote storage]: /doc/user-guide/data-management/remote-storage

</admon>

Remember those `.dvc` files `dvc add` generates? Those files (and `dvc.lock`,
which we'll cover later) have their history in Git. DVC's remote storage config
is also saved in Git, and contains all the information needed to access and
download any version of datasets, files, and models. It means that a Git
repository with <abbr>DVC files</abbr> becomes an entry point, and can be used
instead of accessing files directly.

## Find a file or directory

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example, let's see what's in the `get-started/` directory of our
[dataset-registry](https://github.com/iterative/dataset-registry) repo:

```cli
$ dvc list https://github.com/iterative/dataset-registry get-started
.gitignore
data.xml
data.xml.dvc
```

The benefit of this command over browsing a Git hosting website is that the list
includes files and directories tracked by both Git and DVC (`data.xml` is not
visible if you
[check GitHub](https://github.com/iterative/dataset-registry/tree/master/get-started)).

## Download

One way is to simply download the data with `dvc get`. This is useful when
working outside of a <abbr>DVC project</abbr> environment, for example in an
automated ML model deployment task:

```cli
$ dvc get https://github.com/iterative/dataset-registry \
          use-cases/cats-dogs
```

When working inside another DVC project though, this is not the best strategy
because the connection between the projects is lost — others won't know where
the data came from or whether new versions are available.

## Import file or directory

`dvc import` also downloads any file or directory, while also creating a `.dvc`
file (which can be saved in the project):

```cli
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

This is similar to `dvc get` + `dvc add`, but the resulting `.dvc` files
includes metadata to track changes in the source repository. This allows you to
bring in changes from the data source later using `dvc update`.

<details>

### 💡 Expand to see what happens under the hood.

<admon type="info">

The [dataset registry] repository doesn't actually contain a
`get-started/data.xml` file. Like `dvc get`, `dvc import` downloads from [remote
storage].

[dataset registry]: https://github.com/iterative/dataset-registry

</admon>

`.dvc` files created by `dvc import` have special fields, such as the data
source `repo` and `path` (under `deps`):

```git
+deps:
+- path: get-started/data.xml
+  repo:
+    url: https://github.com/iterative/dataset-registry
+    rev_lock: 96fdd8f12c14fa58a1b7354f15c7adb50e4e8542
 outs:
 - md5: 22a1a2931c8370d3aeedd7183606fd7f
   path: data.xml
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

</details>

## Python API

It's also possible to integrate your data or models directly in source code with
DVC's [Python API](/doc/api-reference). This lets you access the data contents
directly from within an application at runtime. For example:

```py
import dvc.api

with dvc.api.open(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry'
) as f:
    # f is a file-like object which can be processed normally
```
