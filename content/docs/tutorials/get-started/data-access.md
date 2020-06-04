# Data Access

We've seen how to [version data](/doc/tutorials/get-started/data-versioning) for
sharing among team members or environments of the same project. But what about
reusing your data and models from an existing DVC project in other projects, or
on a production deployment?

<abbr>DVC repositories</abbr> serve as an entry point for your data. The
following CLI commands and an API are available to access any version of it,
from any machine where DVC is installed.

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

## Import the dataset

> Requires an [initialized](/doc/tutorials/get-started#initialize) <abbr>DVC
> project</abbr>.

`dvc import` downloads a dataset, while also tracking it **in the same step**:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             use-cases/cats-dogs
```

This is similar to `dvc get`+`dvc add`, but the resulting
[DVC-file](/doc/user-guide/dvc-file-format) includes metadata to track changes
in the source repository. This allows you to bring in changes from the data
source later, using `dvc update`.

<details>

#### Expand to see what happened internally

> Note that the
> [dataset registry](https://github.com/iterative/dataset-registry) repository
> doesn't actually contain a `cats-dogs/` directory. Like `dvc get`,
> `dvc import` downloads from [remote storage](/doc/command-reference/remote).

DVC-files created by `dvc import` are called _import stages_. These have special
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

It's also possible to integrate your data or models directly in source code with
DVC's _Python API_. This lets you **access the data contents directly** from
within an application at runtime. For example:

```py
import dvc.api

with dvc.api.open(
        'use-cases/cats-dogs',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    # ... fd is a file descriptor that can be processed normally.
```

📖 Please refer to the [DVC Python API](/doc/api-reference) for more details.
