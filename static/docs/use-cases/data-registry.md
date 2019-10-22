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

- Tracked data is stored in a **centralized** remote location, with the ability
  to create distributed copies on other remotes.
- Several projects can **share** the same files, guaranteeing that everyone has
  access to the same data versions. See
  [Share Data and Model Files](/doc/use-cases/share-data-and-model-files) for
  more information.
- Projects that import data from the registry don't need to push these large
  files to their own [remotes](/doc/command-reference/remote), **saving space**
  on storage – they may not even need a remote at all, using only their local
  <abbr>cache</abbr>.
- DVC data registries can handle multiple versions of data and ML modes with a
  familiar CLI. See
  [Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning)
  for more information.
- DVC data registries are versioned with Git, so you can always track the
  history of the project the same as you manage your source code repository.

## Using properly versioned registries

In the [Versioning Tutorial](/doc/tutorials/versioning) we use a ZIP file
containing images of cats and dogs, and then we update the dataset with more
images from a second ZIP file. These compressed archives are downloaded from our
own
[iterative/dataset-registry](https://github.com/iterative/dataset-registry)), a
<abbr>DVC project</abbr> hosted on GitHub using `dvc get`. They can be found as
<abbr>outputs</abbr> of 2 separate
[DVC-files](/doc/user-guide/dvc-files-and-directories) in the `tutorial/ver`
directory.

There are a few problems with the way this dataset is structured (in 2 parts, as
compressed archives). One is that dataset partitioning is an unnecessary
complication; It can cause data duplication, among other hurdles. Another issue
is that extra steps are needed to bundle or extract file archives. The data
compression also raises questions. But most importantly, this single dataset is
tracked by 2 different DVC-files, instead of 2 versions of the same one,
preventing us from leveraging Git's central features to track changes.

Fortunately, we have also prepared a better alternative in the `use-cases/`
directory of the same
[repository](https://github.com/iterative/dataset-registry)). First, we used
<code>dvc add cats-dogs</code> to
[track the entire directory](https://dvc.org/doc/command-reference/add#example-directory)
(without bundling or compression) in first version of this dataset, which looks
like this:

```
 cats-dogs
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
command:

```dvc
$ dvc import --rev cats-dogs-v1 \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

> Unlike downloading with `dvc get`, which can be used from any directory,
> `dvc import` has to be run from an [initialized](/doc/command-reference/init)
> DVC project. For illustrative purposes, the optional `--rev` option is used in
> the example above to specify an exact version of the dataset.

Importing keeps the connection between the local project and an external DVC
repository (e.g. a data registry) where we are downloading data from. This is
achieved by creating a special DVC-file a.k.a. an _import stage_, in this case
`cats-dogs.dvc` – which can be used for versioning the import with Git in the
local project. This connection will come in handy when the source data changes,
and we want to obtain these updates...

Back in our **dataset-registry** repository, the second (and last) version of
our dataset exists under the
[`cats-dogs-v2`](https://github.com/iterative/dataset-registry/tree/cats-dogs-v2/use-cases)
tag. It was created by placing the additional 500 cat images in
`cats-dogs/training/cats` and 500 dog images in `cats-dogs/training/dogs`, and
simply running <code>dvc add cats-dogs</code> again.

In our local project, all we have to do in order to obtain this latest version
of the dataset is to run:

```dvc
$ dvc update cats-dogs.dvc
```

This downloads new and changed files in `cats-dogs/` from the source project,
and updates the metadata in `cats-dogs.dvc`.
