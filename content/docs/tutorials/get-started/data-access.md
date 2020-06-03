# Data Access

We've seen how to share data among team members or environments of the same
<abbr>DVC project</abbr>. But what if we wanted to reuse a dataset or ML model
from a different DVC repository?

## Just download it

One way is to download the data with `dvc get` and use `dvc add` to track it (as
done in [Data Versioning](/doc/tutorials/get-started/data-versioning)):

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          use-cases/cats-dogs
$ dvc add cats-dogs
```

But the connection between the projects is lost this way: others won't know
where the data came from or whether new versions are available. Let's see better
ways:

## Find a dataset

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example:

```dvc
$ dvc list https://github.com/iterative/dataset-registry
.gitignore
README.md
get-started     # <- Let's see what's in this directory.
images
tutorial
use-cases
$ dvc list https://github.com/iterative/dataset-registry use-cases
.gitignore
cats-dogs       # <- Bingo!
cats-dogs.dvc
```

The benefit of this command over browsing a Git hosting website is that the list
shown includes files and directories tracked by **both Git and DVC**.

## Import the dataset

Let's replace `cats-dogs/` by importing it directly from its original source.
`dvc import` downloads the dataset, and tracks **it the same step**, so you
don't have to use `dvc add` separately:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             use-cases/cats-dogs
```

<details>

#### Expand to see what happened internally

DVC-files created by `dvc import` are called _import stages_. These have fields,
such as the data source `repo`, and `path` (under `deps`):

```yaml
deps:
  path: use-cases/cats-dogs
  repo:
    url: https://github.com/iterative/dataset-registry
    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

> Note that the
> [dataset registry](https://github.com/iterative/dataset-registry) repository
> doesn't actually contain a `cats-dogs/` directory. Like `dvc get`,
> `dvc import` downloads from [remote storage](/doc/command-reference/remote).

</details>

Additionally, the `cats-dogs.dvc` [DVC-file](/doc/user-guide/dvc-file-format)
now includes metadata to track changes in the source data. This allows you to
bring in changes from the data source later, using `dvc update`.

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
