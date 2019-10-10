# Data Registry

In the [Versioning Tutorial](/doc/tutorials/versioning) we use two ZIP files
containing parts of a dataset with labeled images of cat and dogs. For
simplicity, these compressed archives are downloaded with `dvc get` from our
[dataset registry](https://github.com/iterative/dataset-registry), a <abbr>DVC
project</abbr> hosted on GitHub.

In this document we'll explain the idea behind **shared data registries**, how
to easily create one with DVC, and the best ways to version datasets based on
the same example above (without ZIP files!)

## Concept

We developed the `dvc get`, `dvc import`, and `dvc update` commands with the aim
to enable reusability of any <abbr>outputs</abbr> (raw data, intermediate
results, models, etc) between different projects. For example, project A may use
a data file to begin its data [pipeline](/doc/command-reference/pipeline), but
project B also requires this same file; Instead of
[adding it](/doc/command-reference/add#example-single-file) it to both projects,
B can simply import it from A. (This can bring many benefits that we'll explain
a little later.)

Taking this idea to a useful extreme, we could create a <abbr>project</abbr>
that is exclusively dedicated to
[tracking and versioning](/doc/use-cases/data-and-model-files-versioning)
datasets (or any kind of large files) – by mainly using `dvc add` to build it.
Such a project would not have [stages](/doc/command-reference/run), but its data
files may be updated manually as they evolve. Other projects can then share
these files by downloading (`dvc get`) or importing (`dvc import`) them for use
in different data processes – and these don't even have to be _DVC projects_, as
`dvc get` works anywhere in your system.

The advantages of using a data registry are:

- Tracked files can be safely stored in a **centralized** remote location, with
  the ability to create any amount of distributed copies on other remote
  storage.
- Several projects can **share** the same files, trusting that everyone is using
  the same data versions.
- Projects that import data from the registry don't need to push these large
  files to their own [remotes](/doc/command-reference/remote), **saving space**
  on storage – they may not even need to a remote at all, using only the local
  <abbr>cache</abbr>.
- Easier to manage **access control** per remote storage configured in a single
  data registry project.

A possible weakness of data registries is that, if the source project or its
remote storage are lost for any reason, several other projects depending on it
may stop being reproducible. So this strategy is best when the registry is owned
and controlled internally by the same team as the projects that employ it.
Trusting 3rd party registries should be considered a risk.

## Example: A sub-optimal approach

For illustration purposes, our own
[dataset registry](https://github.com/iterative/dataset-registry) contains a
poorly handled dataset, in the `tutorial/ver` directory. It contains 2
[DVC-files](/doc/user-guide/dvc-file-format) that track a couple of compressed
ZIP files (problem #1). Each archive, when extracted, contains the same
directory structure, but with complementary files, that together form a single
dataset (problem #2) of 2000 images of cats and dogs.

> As mentioned in the introduction, these ZIP files are used as-is for
> simplicity in our [Versioning Tutorial](/doc/tutorials/versioning).

Let's download and extract the first half of this dataset (in an empty
directory) to better understand its structure:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/data.zip
$ unzip -q data.zip
$ tree --filelimit 3
.
├── data
│   ├── train
│   │   ├── cats [500 entries ...]
│   │   └── dogs [500 entries ...]
│   └── validation
│       ├── cats [400 entries ...]
│       └── dogs [400 entries ...]
└── data.zip

7 directories, 1 file
$ rm -f data.zip
```

### Problem #1: Compressed data files

`dvc add`, the command to place existing data under DVC control, supports
tracking both files

[and directories](/doc/command-reference/add#example-directory). For this
reason, adding compressed directory contents to a <abbr>project</abbr> is not
recommended, especially when the files contained are already compressed (like
typical image file formats). Also, uncompressing files after downloading them is
an extra step we may prefer to avoid.

Let's add the entire `data/` dir to DVC instead, in a new Git-backed DVC
project:

```dvc
$ git init
$ dvc init
...
$ git commit -m "Initialize DVC project"
$ dvc add data
Adding 'data' to '.gitignore'...
Saving information to 'data.dvc'.
...
$	git add data.dvc .gitignore
$ git commit -m "Add 1800 cats and dogs images dataset"
```

> Refer to
> [Adding a directory example](/doc/command-reference/add#example-directory) and
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
> for more details on what happens under the hood when adding directories.

### Problem #2: Dataset partitioning

Consistent data partitioning can be very valuable for some applications, such as
distributed storage and distribution (p2p). Versioning parts of a dataset
separately with DVC, however, is an unnecessary complication. This would also
deprive us from neat performance features such as automatic "deduplication"
(avoidance of file repetition) among dataset versions on DVC <abbr>caches</abbr>
or [remotes](/doc/command-reference/remote).

Let's extract the remaining cats and dogs images from our example, to see what
changes in our data directory:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/new-labels.zip
$ unzip -q new-labels.zip
$ tree --filelimit 3
.
├── data
│   ├── train
│   │   ├── cats [1000 entries ...]
│   │   └── dogs [1000 entries ...]
│   └── validation
│       ├── cats [400 entries ...]
│       └── dogs [400 entries ...]
├── data.dvc
└── new-labels.zip

7 directories, 2 files
$ rm -f new-labels.zip
```

An additional 500 images of cats and another 500 of dogs have been added to the
corresponding `data/train` directories. To update the DVC <abbr>cache</abbr>
with this reconstructed dataset, we simply need to run `dvc add data` again:

```dvc
$ dvc add data
Computing md5 for a large number of files. This is only done once.
WARNING: Output 'data' of 'data.dvc' changed because it is 'modified'
...
Saving information to 'data.dvc'.
...
```

Note that when adding an updated data directory, DVC only needs to move the new
and changed files to the <abbr>cache</abbr>.

Finally, let's commit the new dataset version to Git, and list the 2 versions:

```dvc
$ git commit -am "Add 1000 more cats and dogs images to dataset"
$ git log --format="%h %s"
162b2e7 Add 1000 more cats and dogs images to dataset
cbcf466 Add 1800 cats and dogs images dataset
5b058a3 Initialize DVC project
```
