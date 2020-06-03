# Data Access

We've seen how to
[version and share](/doc/tutorials/get-started/data-versioning) data among team
members or environments of the same <abbr>DVC project</abbr>. But what if we
wanted to reuse a dataset or machine learning model from an existing DVC
repository? For example to leverage a
[dataset registry](/doc/use-cases/data-registries) in another DVC project, or as
a way to implement DevOps for data.

## Find a dataset

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example, let's see what's in the `use-cases/` directory of out
[dataset-registry](https://github.com/iterative/dataset-registry) repo:

```dvc
$ dvc list https://github.com/iterative/dataset-registry use-cases
.gitignore
cats-dogs
cats-dogs.dvc
```

The benefit of this command over browsing a Git hosting website is that the list
includes files and directories tracked by **both Git and DVC**.

## Just download it

An easy way is to simply download the data, by using `dvc get`. This is useful
when working outside of a DVC project, for example in an automated ML model
deployment task:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          use-cases/cats-dogs
```

When working inside another DVC project though, this is not the best strategy,
because the connection between the projects is lost — others won't know where
the data came from or whether new versions are available. Let's see better ways:

## Import the dataset

`dvc import` also downloads the dataset, while also tracking it (like `dvc add`)
**in the same step**:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             use-cases/cats-dogs
```

The `cats-dogs.dvc` [DVC-file](/doc/user-guide/dvc-file-format) includes
metadata to track changes in the source data. This allows you to bring in
changes from the data source later, using `dvc update`.

<details>

#### Expand to see what happened internally

> Note that the
> [dataset registry](https://github.com/iterative/dataset-registry) repository
> doesn't actually contain a `cats-dogs/` directory. Like `dvc get`,
> `dvc import` downloads from [remote storage](/doc/command-reference/remote).

DVC-files created by `dvc import` are called _import stages_. These have speicl
fields, such as the data source `repo`, and `path` (under `deps`):

```yaml
deps:
  path: use-cases/cats-dogs
  repo:
    url: https://github.com/iterative/dataset-registry
    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

</details>

## Python API

Besides command line access to data files tracked in remote <abbr>DVC
repositories</abbr>, you can also use DVC's _Python API_ to **access the data
contents directly** from your code. For example:

```py
import dvc.api

with dvc.api.open(
        'use-cases/cats-dogs',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    # ... fd is a file descriptor that can be processed normally.
```

📖 Please refer to the [DVC Python API](/doc/api-reference) for more details.
