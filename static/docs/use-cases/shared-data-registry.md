# Shared Data Registry

In the [Versioning Tutorial](/doc/tutorials/versioning) we use two ZIP files
containing parts of a dataset with labeled images of cat and dogs. For
simplicity, these archives are downloaded with `dvc get` from our
[dataset registry](https://github.com/iterative/dataset-registry), a <abbr>DVC
project</abbr> hosted on GitHub.

In this document we'll explain the idea behind shared data registries, how to
easily create one with DVC, and the best ways to version datasets based on the
same example above (without ZIP files!)

## Concept

We developed the `dvc get`, `dvc import`, and `dvc update` commands with the aim
to enable reusability of any <abbr>outputs</abbr> (datasets, intermediate
results, models, etc) between different projects. For example, project A may use
a raw dataset to begin a data [pipeline](/doc/command-reference/pipeline), but
project B also requires this same dataset; Instead of
[adding](/doc/command-reference/add) it to both projects, B can simply import it
from A. (This can bring many benefits that we'll explain a little later.)

Taking this idea to a useful extreme, we could setup a <abbr>project</abbr> that
is dedicated to
[tracking and versioning](/doc/use-cases/data-and-model-files-versioning)
datasets (or any kind of large files) – by mainly using `dvc add` to build it.
Such a project would not have [stages](/doc/command-reference/run), but its data
files may be updated manually as they evolve. Other projects can then share
these files by downloading (`dvc get`) or importing (`dvc import`) them for use
in different data processes – and these don't even have to be _DVC projects_, as
`dvc get` can work anywhere in your system.

The advantages of using a data registry are:

- Tracked files can be safely stored in a **centralized** remote location, with
  the ability to create any amount of distributed copies on other remote
  storage.
- Several projects can **share** the same files, trusting that everyone is using
  the same data versions.
- Projects that import data from the registry don't need to push these large
  files to their own remotes, **saving space** on storage – they may not even
  need to a remote at all, using only the local <abbr>cache</abbr>.
- Easier to manage **access control** per remote storage configured in a single
  data registry project.

A possible weakness of data registries is that, if the source project or its
remote storage are lost for any reason, several other projects depending on it
may stop being reproducible. So this strategy is best when the registry is owned
and controlled internally by the same team as the projects that employ it.
Trusting 3rd party data registries should be considered a risk.

## Example: A sub-optimal approach

For illustration purposes, our own

[dataset registry](https://github.com/iterative/dataset-registry) contains a
poorly handled dataset in the `tutorial/ver` directory. It contains 2
[DVC-files](/doc/user-guide/dvc-file-format) that track a couple of ZIP files
(problem #1). Each archive, when extracted, contains the same directory
structure, but with complementary files, that together form a single dataset
(problem #2) of 2000 images of cats and dogs.

> As mentioned in the introduction, these ZIP files are used as-is for
> simplicity in our [Versioning Tutorial](/doc/tutorials/versioning).

Let's download and extract the first half of this dataset to better understand
its structure:

```dvc
$ dvc get https://github.com/iterative/dataset-registry tutorial/ver/data.zip
...
$ unzip -q ...
$ rm data.zip
$ tree ... -L 3
...
```

```dvc
$ $ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/new-labels.zip
```

## A properly versioned registry

...
