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

A possible risk of shared data registries is that, if the source project or its
remote storage are lost for any reason, several other projects depending on it
may stop being reproducible. So this strategy is best when the registry is owned
and controlled internally by the same team as the projects that employ it.

## Example: A sub-optimal approach

In the [Versioning Tutorial](/doc/tutorials/versioning) we use a ZIP file
containing a dataset with images of cats and dogs, and later on we get a second
archive to update the dataset with more images. For simplicity, these compressed
archives are downloaded with `dvc get` from our own
[iterative/dataset-registry](https://github.com/iterative/dataset-registry)), a
<abbr>DVC project</abbr> hosted on GitHub. These data files can be found as
<abbr>outputs</abbr> of 2 separate
[DVC-files](/doc/user-guide/dvc-files-and-directories) in the `tutorial/ver`
directory.

There are a few possible problems with the way this dataset is stored (as 2
parts, in compressed archives). One is that dataset partitioning is complicated.
It can cause data duplication and other hurdles, so it's best to avoid. Another
issue is that storing file archives requires the extra steps of bundling and
extracting them. The data compression also raises questions in this approach.

## Example: Better dataset versioning

Let's download and extract the first archive we discussed above (in an empty
directory) to visualize the structure of the dataset:

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

Instead of creating an archive containing the `data/` directory, we can simply
put it under DVC control as-is! This is done with the `dvc add` command, and
this first version can be saved with Git:

```dvc
$ git init  # Initialize Git repository
$ dvc init  # Initialize DVC project
...
$ git commit -m "Initialize DVC project"
...
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

Let's add the remaining cats and dogs images from the archive, to see what
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

Now that an additional 500 images of each kind have been added to their
corresponding subdirectories, we'll want to save the updates with DVC. To do
this, we simply need to use `dvc add` again, commit the new dataset version with
Git:

```dvc
$ dvc add data
Computing md5 for a large number of files. This is only done once.
WARNING: Output 'data' of 'data.dvc' changed because it is 'modified'
...
Saving information to 'data.dvc'.
...
$ git commit -am "Add 1000 more cats and dogs images to dataset"
$ git log --format="%h %s"
162b2e7 Add 1000 more cats and dogs images to dataset
cbcf466 Add 1800 cats and dogs images dataset
5b058a3 Initialize DVC project
```

Note that when adding an updated data directory, DVC only needs to move the new
and changed files to the <abbr>cache</abbr>, as all the previous ones were
already there after the initial use of `dvc add`.
