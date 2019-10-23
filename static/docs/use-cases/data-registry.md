# Data Registry

We developed the `dvc get`, `dvc import`, and `dvc update` commands with the aim
to enable reusability of any <abbr>data artifacts</abbr> (raw data, intermediate
results, models, etc) between different projects. For example, project A may use
a data file to begin its data [pipeline](/doc/command-reference/pipeline), but
project B also requires this same file; Instead of
[adding it](/doc/command-reference/add#example-single-file) it to both projects,
B can simply import it from A.

Taking this idea to a useful extreme, we could create a <abbr>project</abbr>
that is exclusively dedicated to
[tracking and versioning](/doc/use-cases/data-and-model-files-versioning)
datasets (or any kind of large files) – by mainly using `dvc add` to build it.
Such a project would not have [stages](/doc/command-reference/run), but its data
files may be updated manually as they evolve. Other projects can then share
these artifacts by downloading (`dvc get`) or importing (`dvc import`) them for
use in different data processes – and these don't even have to be _DVC
projects_, as `dvc get` works anywhere in your system.

The advantages of using a data registry are:

- Centralization: Data [shared](/doc/use-cases/share-data-and-model-files) by
  multiple projects can be stored in a single location (with the ability to
  create distributed copies on other remotes). This simplifies data management
  and helps use storage space efficiently.
- [Versioning](/doc/use-cases/data-and-model-files-versioning): Any version of
  the stored data or ML modes can be used in other <abbr>projects</abbr> at any
  time.
- Persistence: The registry controlled
  [remote storage](/doc/command-reference/remote) (e.g. an S3 bucket) improves
  data security. There are less chances someone can delete or rewrite a model,
  for example.
- Lifecycle management: Manage your data like you do with code, leveraging Git
  and GitHub features such as version history, pull requests, reviews, or even
  continuous deployment of ML models.
- Security: Registries can be setup to have read-only remote storage (e.g. an
  HTTP location). Git versioning of DVC-files allows us to track and audit data
  changes.
- Reusability: Reproduce and organizing _feature stores_ with `dvc get` and
  `dvc import`.

## Example

A dataset we use for several of our examples and tutorials in these docs is one
containing 2800 images of cats and dogs. We partitioned the dataset in two for
our [Versioning Tutorial](/doc/tutorials/versioning), and backed up the parts on
a storage server, downloading them with `wget` in our examples. This setup was
then revised to download the dataset with `dvc get` instead, so we created the
[dataset-registry](https://github.com/iterative/dataset-registry)) project, a
<abbr>DVC project</abbr> hosted on GitHub, to version the dataset (see its
[`tutorial/ver`](https://github.com/iterative/dataset-registry/tree/master/tutorial/ver)
directory).

However, there are a few problems with the way this dataset is structured (in 2
parts). Most importantly, this single dataset is tracked by 2 different
[DVC-files](/doc/user-guide/dvc-file-format), instead of 2 versions of the same
one, which would better reflect the intentions of this dataset... Fortunately,
we have also prepared an improved alternative in the
[`use-cases/`](https://github.com/iterative/dataset-registry/tree/master/use-cases)
directory of the same repository.

As step one, we extracted the first part of the dataset into the
`use-cases/cats-dogs` directory (illustrated below), and ran <code>dvc add
use-cases/cats-dogs</code> to
[track the entire directory](https://dvc.org/doc/command-reference/add#example-directory).

```dvc
$ tree use-cases/cats-dogs --filelimit 3
use-cases/cats-dogs
└── data
    ├── train
    │   ├── cats [500 image files]
    │   └── dogs [500 image files]
    └── validation
        ├── cats [400 image files]
        └── dogs [400 image files]
```

This first version uses the
[`cats-dogs-v1`](https://github.com/iterative/dataset-registry/tree/cats-dogs-v1/use-cases)
Git tag. In a local DVC project, we can obtain this dataset with the following
command (note the usage of `--rev`):

```dvc
$ dvc import --rev cats-dogs-v1 \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

> Note that unlike `dvc get`, which can be used from any directory, `dvc import`
> always needs to run from an [initialized](/doc/command-reference/init) DVC
> project.

Importing keeps the connection between the local project and data registry where
we are downloading the dataset from. This is achieved by creating a special
DVC-file (a.k.a. an _import stage_) – which can be used for versioning the
import with Git in the local project. This connection will come in handy when
the source data changes, and we want to obtain these updates...

Back in our **dataset-registry** repository, the second (and last) version of
our dataset exists under the
[`cats-dogs-v2`](https://github.com/iterative/dataset-registry/tree/cats-dogs-v2/use-cases)
tag. It was created by extracting the second part of the dataset, with 1000
additional images (500 cats, 500 dogs) in the same directory structure, and
simply running <code>dvc add use-cases/cats-dogs</code> again.

In our local project, all we have to do in order to obtain this latest version
of the dataset is to run:

```dvc
$ dvc update cats-dogs.dvc
```

This downloads new and changed files in `cats-dogs/` from the source project,
and updates the metadata in the import stage DVC-file.

As an extra detail, notice that so far our local project is working only with a
local <abbr>cache</abbr>. It has no need to setup a
[remotes](/doc/command-reference/remote) to [pull](/doc/command-reference/pull)
or [push](/doc/command-reference/push) this dataset.
