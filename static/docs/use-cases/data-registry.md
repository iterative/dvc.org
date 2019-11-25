# Data Registry

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning).
This is provided by commands such as `dvc add` and `dvc run`, that allow
tracking of datasets and any other <abbr>data artifacts</abbr>.

With the aim to enable reusability of these versioned artifacts between
different projects (similar to package management systems, but for data), DVC
also includes the `dvc get`, `dvc import`, and `dvc update` commands. This means
that a project can depend on data from an external <abbr>DVC project</abbr>.

Keeping this in mind, we could build a <abbr>DVC project</abbr> dedicated to
tracking and versioning datasets (or any kind of large files). This way we would
have a repository with all the metadata and history of changes in the project's
data. We could see who updated what, and when, use pull requests to update data
(the same way we do with code), and avoid ad-hoc conventions to store different
data versions. This is what we call a data registry. Other projects can share
datasets in a registry by downloading (`dvc get`) or importing (`dvc import`)
them for use in different data processes.

Advantages of using a DVC **data registry** project:

- Data as code: Improve _lifecycle management_ with versioning of simple
  directory structures (like Git for your cloud storage), without ad-hoc
  conventions. Leverage Git and Git hosting features such as commits, branching,
  pull requests, reviews, and even continuous deployment of ML models.
- Reusability: Reproduce and organize _feature stores_ with a simple CLI
  (`dvc get` and `dvc import` commands, similar to software package management
  systems like `pip`).
- Persistence: The DVC registry-controlled
  [remote storage](/doc/command-reference/remote) (e.g. an S3 bucket) improves
  data security. There are less chances someone can delete or rewrite a model,
  for example.
- Storage Optimization: Track data
  [shared](/doc/use-cases/share-data-and-model-files) by multiple projects
  centralized in a single location (with the ability to create distributed
  copies on other remotes). This simplifies data management and optimizes space
  requirements.
- Security: Registries can be setup to have read-only remote storage (e.g. an
  HTTP location). Git versioning of DVC-files allows us to track and audit data
  changes.

## Example

A dataset we commonly use for several of our examples and tutorials contains
2800 images of cats and dogs, which was split it in two for our
[Versioning Tutorial](/doc/tutorials/versioning). Originally, the parts were
backed up on a storage server, and downloaded with
[`wget`](https://www.gnu.org/software/wget/). This was then revised in order to
download the parts with `dvc get` instead, so we created the
[dataset-registry](https://github.com/iterative/dataset-registry)
<abbr>project</abbr> to version the dataset (in the
[`tutorial/ver`](https://github.com/iterative/dataset-registry/tree/master/tutorial/ver)
directory).

However, there's a few problems with the way that dataset is versioned. Most
importantly, this split dataset is tracked by 2 different
[DVC-files](/doc/user-guide/dvc-file-format) (one for each part), instead of 2
versions of a single DVC-file. An initial version could have the first part
only, while an update would have the entire, unified dataset. Fortunately, we
have also prepared this improved alternative in the
[`use-cases/`](https://github.com/iterative/dataset-registry/tree/master/use-cases)
directory of the same <abbr>DVC repository</abbr>.

To create the
[initial version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v1/use-cases)
of our dataset, we extracted the first part into the `use-cases/cats-dogs`
directory, illustrated below:

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

Then we ran `dvc add use-cases/cats-dogs` to
[track the entire directory](https://dvc.org/doc/command-reference/add#example-directory).

At this point, we could have obtained this dataset in another DVC project with
the following command:

```dvc
$ dvc import git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

> Note that unlike `dvc get`, which can be used from any directory, `dvc import`
> always needs to run from an [initialized](/doc/command-reference/init) DVC
> project. Remember also that with both commands, the data comes from the source
> project's remote storage, not from the Git repository itself.

<details>

### Expand for actionable command (optional)

The command above is meant for informational purposes only. If you actually run
it, although it will work, it will import the latest version of
`use-cases/cats-dogs` from `dataset-registry`. The following command would
actually bring in the version in question:

```dvc
$ dvc import --rev cats-dogs-v1 \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

See the `dvc import` command reference for more details on the `--rev`
(revision) option.

</details>

Importing keeps the connection between the local <abbr>project</abbr> and the
data source (registry <abbr>repository</abbr>). This is achieved by creating a
particular kind of [DVC-file](/doc/user-guide/dvc-file-format) (a.k.a. _import
stage_) that includes a `repo` field. (This file can be used staged and
committed with Git.)

> For a sample DVC-file resulting from `dvc import`, refer to
> [this example](/doc/command-reference/import#example-data-registry).

Back in our **dataset-registry** project, the
[second version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v2/use-cases)
of our dataset was created by extracting the second part, with 1000 additional
images (500 cats, 500 dogs) on top of the existing directory structure. Then, we
simply ran `dvc add use-cases/cats-dogs` again.

All we would have to do in order to obtain this latest version in another
project where the first version was previously imported, is to run:

```dvc
$ dvc update cats-dogs.dvc
```

<details>

### Expand for actionable command (optional)

As with the previous hidden note, actually trying the command above will produce
the desired results, but not for obvious reasons. The initial `dvc import`
command would have already obtained the latest version of the dataset (as noted
before), so this `dvc update` is unnecessary and won't have any effect.

And if you ran the `dvc import --rev cats-dogs-v1 ...` command instead, its
import stage (DVC-file) would be
[fixed to that revision](/doc/command-reference/import#example-fixed-revisions-re-importing)
(`cats-dogs-v1` tag), so `dvc update` would also be ineffective. In order to
actually "update" it, re-import the data instead, by now running the initial
import command (the one without `--rev`):

```dvc
$ dvc import git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

</details>

This is possible because of the connection that the import stage saved among
local and source projects, as explained earlier. The update downloads new and
changed files in `cats-dogs/` based on the source project, and updates the
metadata in the import stage DVC-file.
