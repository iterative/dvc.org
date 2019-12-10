# Data Registry

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning).
This is provided by commands such as `dvc add` and `dvc run`, that allow
tracking of datasets and any other <abbr>data artifacts</abbr>.

With the aim to enable reusability of these versioned artifacts between
different projects (similar to package management systems, but for data), DVC
also includes the `dvc get`, `dvc import`, and `dvc update` commands. For
example, project A may use a data file to begin its data
[pipeline](/doc/command-reference/pipeline), but project B also requires this
same file; Instead of
[adding it](/doc/command-reference/add#example-single-file) it to both projects,
B can simply import it from A. Furthermore, the version of the data file
imported to B can be an older iteration than what's currently used in A.

Keeping this in mind, we could build a <abbr>DVC project</abbr> dedicated to
tracking and versioning datasets (or any kind of large files). This way we would
have a repository that has all the metadata and change history for the project's
data. We can see who updated what, and when; use pull requests to update data
the same way you do with code; and we don't need ad-hoc conventions to store
different data versions. Other projects can share the data in the registry by
downloading (`dvc get`) or importing (`dvc import`) them for use in different
data processes.

The advantages of using a DVC **data registry** project are:

- Data as code: Improve _lifecycle management_ with versioning of simple
  directory structures (like Git for your cloud storage), without ad-hoc
  conventions. Leverage Git and Git hosting features such as change history,
  branching, pull requests, reviews, and even continuous deployment of ML
  models.
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

A dataset we use for several of our examples and tutorials is one containing
2800 images of cats and dogs. We partitioned the dataset in two for our
[Versioning Tutorial](/doc/tutorials/versioning), and backed up the parts on a
storage server, downloading them with `wget` in our examples. This setup was
then revised to download the dataset with `dvc get` instead, so we created the
[dataset-registry](https://github.com/iterative/dataset-registry)) repository, a
<abbr>DVC project</abbr> hosted on GitHub, to version the dataset (see its
[`tutorial/ver`](https://github.com/iterative/dataset-registry/tree/master/tutorial/ver)
directory).

However, there are a few problems with the way this dataset is structured. Most
importantly, this single dataset is tracked by 2 different
[DVC-files](/doc/user-guide/dvc-file-format), instead of 2 versions of the same
one, which would better reflect the intentions of this dataset... Fortunately,
we have also prepared an improved alternative in the
[`use-cases/`](https://github.com/iterative/dataset-registry/tree/master/use-cases)
directory of the same <abbr>DVC repository</abbr>.

To create a
[first version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v1/use-cases)
of our dataset, we extracted the first part into the `use-cases/cats-dogs`
directory (illustrated below), and ran `dvc add use-cases/cats-dogs` to
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

In a local DVC project, we could have downloaded this dataset at this point with
the following command:

```dvc
$ dvc import git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

> Note that unlike `dvc get`, which can be used from any directory, `dvc import`
> always needs to run from an [initialized](/doc/command-reference/init) DVC
> project.

<details>

### Expand for actionable command (optional)

The command above is meant for informational purposes only. If you actually run
it in a DVC project, although it should work, it will import the latest version
of `use-cases/cats-dogs` from `dataset-registry`. The following command would
actually bring in the version in question:

```dvc
$ dvc import --rev cats-dogs-v1 \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

See the `dvc import` command reference for more details on the `--rev`
(revision) option.

</details>

Importing keeps the connection between the local project and the source data
registry where we are downloading the dataset from. This is achieved by creating
a particular kind of [DVC-file](/doc/user-guide/dvc-file-format) that uses the
`repo` field (a.k.a. _import stage_). (This file can be used for versioning the
import with Git.)

> For a sample DVC-file resulting from `dvc import`, refer to
> [this example](/doc/command-reference/import#example-data-registry).

Back in our **dataset-registry** project, a
[second version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v2/use-cases)
of our dataset was created by extracting the second part, with 1000 additional
images (500 cats, 500 dogs), into the same directory structure. Then, we simply
ran `dvc add use-cases/cats-dogs` again.

In our local project, all we have to do in order to obtain this latest version
of the dataset is to run:

```dvc
$ dvc update cats-dogs.dvc
```

This is possible because of the connection that the import stage saved among
local and source projects, as explained earlier.

<details>

### Expand for actionable command (optional)

As with the previous hidden note, actually trying the commands above should
produced the expected results, but not for obvious reasons. Specifically, the
initial `dvc import` command would have already obtained the latest version of
the dataset (as noted before), so this `dvc update` is unnecessary and won't
have an effect.

If you ran the `dvc import --rev cats-dogs-v1 ...` command instead, its import
stage (DVC-file) would be fixed to that Git tag (`cats-dogs-v1`). In order to
update it, do not use `dvc update`. Instead, re-import the data by using the
original import command (without `--rev`). Refer to
[this example](http://localhost:3000/doc/command-reference/import#example-fixed-revisions-re-importing)
for more information.

</details>

This downloads new and changed files in `cats-dogs/` from the source project,
and updates the metadata in the import stage DVC-file.

As an extra detail, notice that so far our local project is working only with a
local <abbr>cache</abbr>. It has no need to setup a
[remotes](/doc/command-reference/remote) to [pull](/doc/command-reference/pull)
or [push](/doc/command-reference/push) this dataset.
