# Data Access

Okay, now that we've learned how to _track_ data and models with DVC and how to
version them with Git, next question is how can we _use_ these artifacts outside
of the project? How do I download a model to deploy it? How do I download a
specific version of a model? How do I reuse datasets across different projects?

> These questions tend to come up when you browse the files that DVC saves to
> remote storage, e.g.
> `s3://dvc-public/remote/get-started/fb/89904ef053f04d64eafcc3d70db673` 😱
> instead of the original files, name such as `model.pkl` or `data.xml`.

Read on or watch our video to see how to find and access models and datasets
with DVC.

https://youtu.be/EE7Gk84OZY8

Remember those `.dvc` files `dvc add` generates? Those files (and `dvc.lock`
that we'll cover later), have their history in Git, DVC remote storage config
saved in Git contain all the information needed to access and download any
version of datasets, files, and models. It means that Git repository with DVC
files becomes an entry point and can be used instead of accessing files
directly.

## Find a file or directory

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example, let's see what's in the `get-started/` directory of our
[dataset-registry](https://github.com/iterative/dataset-registry) repo:

```dvc
$ dvc list https://github.com/iterative/dataset-registry get-started
.gitignore
data.xml
data.xml.dvc
```

The benefit of this command over browsing a Git hosting website is that the list
includes files and directories tracked by both Git and DVC (`data.xml` is not
visible if you check
[GitHub](https://github.com/iterative/dataset-registry/tree/master/get-started)).

## Download

One way is to simply download the data with `dvc get`. This is useful when
working outside of a <abbr>DVC project</abbr> environment, for example in an
automated ML model deployment task:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          use-cases/cats-dogs
```

When working inside another DVC project though, this is not the best strategy
because the connection between the projects is lost — others won't know where
the data came from or whether new versions are available.

## Import file or directory

`dvc import` also downloads any file or directory, while also creating a `.dvc`
file that can be saved in the project:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

This is similar to `dvc get` + `dvc add`, but the resulting `.dvc` files
includes metadata to track changes in the source repository. This allows you to
bring in changes from the data source later, using `dvc update`.

<details>

#### 💡 Expand to see what happens under the hood.

> Note that the
> [dataset registry](https://github.com/iterative/dataset-registry) repository
> doesn't actually contain a `get-started/data.xml` file. Like `dvc get`,
> `dvc import` downloads from [remote storage](/doc/command-reference/remote).

`.dvc` files created by `dvc import` have special fields, such as the data
source `repo`, and `path` (under `deps`):

```diff
+ deps:
+ - path: get-started/data.xml
+   repo:
+     url: https://github.com/iterative/dataset-registry
+     rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
 outs:
 - md5: a304afb96060aad90176268345e10355
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
        ) as fd:
    # ... fd is a file descriptor that can be processed normally.
```
