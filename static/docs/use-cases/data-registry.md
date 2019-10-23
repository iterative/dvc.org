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
[tracking and versioning](/doc/use-cases/versioning-data-and-model-files)
datasets (or any kind of large files) – by mainly using `dvc add` to build it.
Such a project would not have [stages](/doc/command-reference/run), but its data
files may be updated manually as they evolve. Other projects can then share
these artifacts by downloading (`dvc get`) or importing (`dvc import`) them for
use in different data processes – and these don't even have to be _DVC
projects_, as `dvc get` works anywhere in your system.

The advantages of using a data registry are:

- Tracked data is stored in a **centralized** remote location, with the ability
  to create distributed copies on other remotes.
- Several projects can **share** the same files, guaranteeing that everyone has
  access to the same data versions. See
  [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
  for more information.
- Projects that import data from the registry don't need to push these large
  files to their own [remotes](/doc/command-reference/remote), **saving space**
  on storage – they may not even need a remote at all, using only their local
  <abbr>cache</abbr>.
- DVC data registries can handle multiple versions of data and ML modes with a
  familiar CLI. See
  [Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files)
  for more information.
- DVC data registries are versioned with Git, so you can always track the
  history of the project the same as you manage your source code repository.

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
