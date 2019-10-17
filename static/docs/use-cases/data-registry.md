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
  on storage – they may not even need a remote at all, using only their local
  <abbr>cache</abbr>.
- It may be easier to manage **access control** for remote storage configured in
  a single data registry project. A possible setup would use a read-only remote,
  so other projects can't affect each other accidentally.

A possible risk of shared data registries is that, if the source project or its
remote storage are lost for any reason, several other projects depending on it
may stop being reproducible. So this strategy is best when the registry is owned
and controlled internally by the same team as the projects that employ it.

## Implementing proper data versioning

In the [Versioning Tutorial](/doc/tutorials/versioning) we use a ZIP file
containing images of cats and dogs, and then we update the dataset with more
images from a second ZIP file. These compressed archives are downloaded from our
own
[iterative/dataset-registry](https://github.com/iterative/dataset-registry)), a
<abbr>DVC project</abbr> hosted on GitHub. They can be found as
<abbr>outputs</abbr> of 2 separate
[DVC-files](/doc/user-guide/dvc-files-and-directories) in the `tutorial/ver`
directory.

There are a few possible problems with the way this dataset is stored (in 2
parts, as compressed archives). One is that dataset partitioning is an
unnecessary complication; It can cause data duplication and other hurdles.
Another issue is that extra steps are needed to bundle and extract file
archives. The data compression also raises questions. But most importantly, this
single dataset is tracked by 2 different DVC-files, instead of 2 versions of the
same one, as we'll explain next.

Let's download and extract the first archive we discussed above (in an empty
directory) to visualize the structure of the dataset:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/data.zip
$ unzip -q data.zip
$ rm -f data.zip
$ tree --filelimit 3
.
└── data
    ├── train
    │   ├── cats [500 entries ...]
    │   └── dogs [500 entries ...]
    └── validation
        ├── cats [400 entries ...]
        └── dogs [400 entries ...]
...
```

Instead of creating an archive containing the `data/` directory, we can simply
put it under DVC control as-is! This is done with the `dvc add` command, which
accepts entire directories. We can then save this first version using Git:

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

Let's add the remaining images from the second archive (500 of each kind), and
see what changes in our data directory. To save the updates in our
<abbr>project</abbr>, we simply run `dvc add` again on the same directory, and
commit the new version with Git:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/new-labels.zip
$ unzip -q new-labels.zip
$ rm -f new-labels.zip
$ tree --filelimit 3
.
├── data
│   ├── train
│   │   ├── cats [1000 entries ...]
│   │   └── dogs [1000 entries ...]
...
$ dvc add data
Computing md5 for a large number of files. This is only done once.
WARNING: Output 'data' of 'data.dvc' changed because it is 'modified'
...
Saving information to 'data.dvc'.
...
$ git commit -am "Add 1000 more cats and dogs images to dataset"
```

> Note that when adding updates to a tracked data directory, DVC only moves new
> and changed files to the cache. This optimizes file system performance, and
> avoids file duplication in cache and [remotes](/doc/command-reference/remote).

Done! We now have a straightforward dataset stored as a full directory in our
data registry. Its first version tracks 1800 images, while the updated second
version tracks 1000 more. This strategy enables easy reproducibility of any
experiments (matching their dataset versions, see `dvc checkout`). It also
provides the ability to track the history of changes to the dataset with Git.

## Taking full advantage of data registries

If we want to keep the connection between the current <abbr>project</abbr> and
an external DVC repository (e.g. A data registry)) we would use `dvc import`
instead of `dvc get`. Let's try this with our example
[dataset registry](https://github.com/iterative/dataset-registry), where we
already registered the dataset in the `use-cases` directory (with
[2 versions](https://github.com/iterative/dataset-registry/commits/master/use-cases),
as described in the previous section):

```dvc
dvc import --rev 0547f58 \
           git@github.com:iterative/dataset-registry.git \
           use-cases/data
```

This downloads the `data/` directory from Git version
[0547f58](https://github.com/iterative/dataset-registry/tree/0547f58), which
corresponds to the 1800 image dataset, and creates a local `data.dvc` _import
stage_. Unlike typical DVC-files, this one records the source (project) of the
imported data. This connection between projects allows us to check for updates
in the data, using `dvc update`:

```dvc
$ dvc update data.dvc
```

This brings the `data/` directory up to its
[latest version](https://github.com/iterative/dataset-registry/commit/99d1cdb)
with 2800 images. Note that DVC only downloads new and changed files when
updating imports.
