# Data Registry

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning),
with commands such as `dvc add`. With the aim to enable reusability of these
<abbr>data artifacts</abbr> between different projects, DVC also provides the
`dvc get`, `dvc import`, and `dvc update` commands. This means that a project
can depend on data from an external <abbr>DVC project</abbr>, **similar to
package management systems, but for data**.

<!-- TODO: Insert diagram image here. -->

Keeping this in mind, we could build a <abbr>DVC project</abbr> dedicated to
tracking and versioning datasets (or any large data). This way we would have a
repository with all the metadata and history of changes of different datasets.
We could see who updated what, and when, and use pull requests to update data
(the same way we do with code). This is what we call a **data registry**, which
can work as data management _middleware_ between ML projects and cloud storage.

Advantages of using a DVC **data registry** project:

- Data as code: Improve _lifecycle management_ with versioning of simple
  directory structures (like Git on cloud storage), without ad-hoc conventions.
  Leverage Git and Git hosting features such as commits, branching, pull
  requests, reviews, and even continuous deployment of ML models.
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
  HTTP location). Git versioning of [DVC-files](/doc/user-guide/dvc-file-format)
  allows us to track and audit data changes.

## Building data registries

Data registries can be created locally like any other <abbr>DVC
repositories</abbr> with `git init` and `dvc init`, and pushed to a Git server
for sharing with others.

A good way to organize these DVC-files is in different directories that group
the data into separate uses, for example `images/`, `natural-language/`, etc. As
an example, our
[dataset-registry](https://github.com/iterative/dataset-registry) uses a
directory for each of our website documentation sections, such as `get-started/`
and `use-cases/`.

> We use this example registry for all of our docs, where needed, for example in
> the [Versioning tutorial](/doc/tutorials/versioning),
> [in Get Started](/doc/get-started/add-files), and some Command Reference
> examples.

### Adding datasets to a registry

...

What makes data registries special, is that they mainly contain simple
[DVC-files](/doc/user-guide/dvc-file-format) (probably no source code or
[pipelines](/doc/command-reference/pipeline)). These [DVC-files track the
different datasets we may want to version. The actual data will be stored in one
or more [remote storage](/doc/command-reference/remote) locations configured in
the <abbr>project</abbr>.

## Using a data registry

...

## Example

Imagine a training dataset with 1000 images of cats and dogs that will be used
to build an ML model. Without DVC, in order for a team to collaborate on this
project, we could just upload it to cloud storage (e.g. Amazon S3) and provide
everyone with access.

At some point though, we need to add another 1000 images to the dataset, but the
colleagues already have work based on the initial set. For simplicity, we keep
the dataset split into 2 directories (or compressed files) uploaded separately
to the cloud.

We actually versioned such a dataset (without split) in the `use-cases/`
directory of our
[dataset-registry](https://github.com/iterative/dataset-registry)
<abbr>project</abbr> (hosted on GitHub). Let's see how this was done.

To create the
[initial version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v1/use-cases),
we extracted the first part (`data.zip`) into `use-cases/cats-dogs` and used
`dvc add` to
[track the entire directory](https://dvc.org/doc/command-reference/add#example-directory),
and committed this state with Git:

```dvc
$ mkdir use-cases
$ cp path/to/data-part-one/ use-cases/cats-dogs
$ tree use-cases/cats-dogs --filelimit 3
use-cases/cats-dogs
└── data
    ├── train
    │   ├── cats [500 image files]
    │   └── dogs [500 image files]
    └── validation
        ├── cats [400 image files]
        └── dogs [400 image files]
$ dvc add use-cases/cats-dogs

... This creates DVC-file `use-cases/cats-dogs.dvc`

$ git add .gitignore use-cases/cats-dogs.dvc
$ git commit -m 'Add 1800 cats and dogs images dataset.'
```

The
[second version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v2/use-cases)
was created by extracting the remaining part of the dataset, with 1000
additional training images (500 cats, 500 dogs), on top of the same directory
structure. Then we simply added the directory again! DVC recognizes the changes
and updates the [DVC-file](/doc/user-guide/dvc-file-format), which can then be
committed with Git again:

```dvc
$ dvc add use-cases/cats-dogs
$ git add use-cases/cats-dogs.dvc
$ git commit -m 'Add 1000 more cats and dogs images to dataset.'
```

> The versioned dataset was then uploaded to
> [remote storage](/doc/command-reference/remote) with `dvc push`. This is
> necessary for others being able to access the data from other projects and
> locations.

The result is a properly versioned dataset, with 2 versions of a single DVC-file
representing the entire (merged) data. This is in contrast to having one single
version of 2 separate DVC-files, one for each part of the data split (as in the
Versioning example).

## Example: Consuming

Let's say at the time of creating the
[initial version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v1/use-cases)
of the dataset example above, we want to obtain it in another DVC project. This
could easily be done with the following command:

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

Then, once the
[second version](https://github.com/iterative/dataset-registry/tree/cats-dogs-v2/use-cases)
of the dataset is created, we can easily bring the dataset up to date locally
with `dvc update`:

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
