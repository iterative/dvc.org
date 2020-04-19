# Data Versioning

The first layer of DVC provides a basic framework for versioning, storing, and
sharing data files or directories, ML models, and intermediate results. This can
be done on a regular Git workflow, but without actually tracking the file
contents with Git.

👉 Please follow the [intro](/doc/tutorials/get-started/) of this tutorial
before continuing.

To get started, let's get an example dataset:

```dvc
$ mkdir data
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

> `dvc get` can download any <abbr>data artifact</abbr> tracked in a <abbr>DVC
> repository</abbr>. It's like `wget`, but for DVC/Git repos. In this case we
> use our [dataset-registry](https://github.com/iterative/dataset-registry)) as
> the source repository.

This data will be used later in the tutorial to train a simple NLP model.

## Start tracking data

To track a file in your <abbr>DVC project</abbr>, just run `dvc add` on it:

```dvc
$ dvc add data/data.xml
```

DVC <abbr>caches</abbr> `data/data.xml` locally and stores information about the
added data in a special **DVC-file** named `data/data.xml.dvc`, a small text
file with a human-readable [format](/doc/user-guide/dvc-file-format). It also
tells Git to ignore the added file, so that this version of the repository can
be safely committed with Git:

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data"
```

<details>

### Expand to learn about DVC internals

`dvc add` moves the data file to the project's cache (see
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)), and
makes file links (or copies) with the original file names back in the
<abbr>workspace</abbr>, which is what you see inside the project.

```dvc
$ ls -R .dvc/cache
...
    .dvc/cache/a3:
    04afb96060aad90176268345e10355
```

The hash value of the `data/data.xml` file we just added,
`a304afb96060aad90176268345e10355` determines the path and file name shown
above. And if you check the `data/data.xml.dvc` DVC-file created by DVC, you
will see that it has this string inside.

### Important note on cache performance

DVC tries to use reflinks\* by default to link your data files from the
<abbr>DVC cache</abbr> to the workspace, optimizing speed and storage space.
However, reflinks are not widely supported yet and DVC falls back to actually
copying data files to/from the cache. **Copying can be very slow with large
files**, and duplicates storage requirements.

Hardlinks and symlinks are also available for optimized cache linking but,
(unlike reflinks) they carry the risk of accidentally corrupting the cache if
tracked data files are modified in the workspace.

See [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
`dvc config cache` for more information.

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.

</details>

> Refer to
> [Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files)
> for more information on versioning data with DVC.

## Configure remote storage

Because we'll want to share data and models outside of the local context where
the data tracked by DVC is <abbr>cached</abbr>, we're going to set up a default
[remote storage](/doc/command-reference/remote) for the <abbr>DVC
project</abbr>. For simplicity, let's set up a _local remote_:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the type of location where the storage is: another directory in the
same file system. "Remote" is how we call storage for DVC projects. It's
essentially a local storage backup.

</details>

```dvc
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

That's it! DVC doesn't require installing databases, storage servers, or
warehouses. It can simply use cloud services or local/network file systems to
store data, intermediate results, ML models, etc.

💡 Note that **DVC supports many other remote storage types**: Google Drive,
Amazon S3, Azure Blob Storage, Google Cloud Storage, Aliyun OSS, SSH, HDFS, and
HTTP. Please refer to `dvc remote add` for more details and examples.

> There are many other configuration options that can be tweaked in DVC. Please
> see `dvc config` for more information.

## Store and retrieve shared data

Having some data tracked by DVC, you can push it from your <abbr>project</abbr>
to [remote storage](/doc/command-reference/remote) with:

```dvc
$ dvc push
```

<details>

### Expand to learn more about DVC internals

You can check that the data has been backed up to the DVC remote
(`/tmp/dvc-storage` local directory) with:

```dvc
$ ls -R /tmp/dvc-storage
...
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

> Note that the remote storage should mirror your local <abbr>cache</abbr> (by
> default in `.dvc/cache`) at this point.

Similar to pushing source code to a _Git remote_, `dvc push` ensures that your
data files and models are safely backed up remotely. Usually, we also want to
`git push` to share or back up the corresponding
[DVC-files](/doc/user-guide/dvc-file-format), which should be committed with
Git.

</details>

Now that `dvc push` uploaded the data to a DVC remote, it can be pulled by
yourself or colleagues when needed in other copies of this project.

<details>

### Expand to simulate a fresh clone of this repo

The difference between a working <abbr>DVC repository</abbr> and its underlying
Git repo is that the data tracked by DVC is **not stored by Git**. So let's
remove the data file added so far, both from <abbr>workspace</abbr> and
<abbr>cache</abbr>:

```dvc
$ rm -f data/data.xml
$ rm -f .dvc/cache/a3/04afb96060aad90176268345e10355
$ dvc status
data\data.xml.dvc:
        changed outs:
                deleted:            data\data.xml
```

`dvc status` detects when DVC-tracked data is missing, among other
<abbr>project</abbr> states.

</details>

To restore data from remote storage, use:

```dvc
$ dvc pull
```

`dvc pull` downloads the data files and directories referenced in all present
[DVC-files](/doc/user-guide/dvc-file-format) from remote storage. Usually, we
run it after `git clone` and `git pull`.

> Other related commands are `dvc fetch` and `dvc checkout`. See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Accessing data

We've seen how to share data among team members or environments of the same
<abbr>DVC project</abbr>. But what if we wanted to reuse a dataset or ML model
from a different DVC repository?

One way is to manually download the data and use `dvc add` to track it, like we
did in the beginning of this page, but the connection between the projects is
lost this way. Others won't be able to tell where the data came from or whether
there's a new version available.

Fortunately DVC provides better alternatives! But first let's learn how to
browse DVC repos without cloning them.

### Find a dataset

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example:

```dvc
$ dvc list https://github.com/iterative/dataset-registry
.gitignore
README.md
get-started
images
tutorial
use-cases
$ dvc list https://github.com/iterative/dataset-registry get-started
.gitignore
data.xml        # <-- Bingo!
data.xml.dvc
```

Another benefit of this command over browsing a Git hosting website is that the
list generated by DVC includes files and directories tracked by both Git and
DVC.

### Import the dataset

Let's replace `data/data.xml` by importing it directly from the same source:

```dvc
$ cd ~/so-tag-predict
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

`dvc import` downloads and overwrites the same `data/data.xml`, tracking it with
DVC in the same step, so you don't have to use `dvc add` separately.
Additionally, `data.xml.dvc` now has special metadata that allows DVC to track
changes in the source data. This allows you to bring in changes from the data
source later, using `dvc update`.

<details>

### Expand to learn more about DVC internals

DVC-files created by `dvc import` are called _import stages_. If we check the
difference against the regular DVC-file we previously had, we can see that the
latter has more fields, such as the data source `repo`, and `path` within it:

```dvc
$ git diff
...
--- a/data/data.xml.dvc
+++ b/data/data.xml.dvc
...
+deps:
+- path: get-started/data.xml
+  repo:
+    url: https://github.com/iterative/dataset-registry
+    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

Note that the [dataset-registry](https://github.com/iterative/dataset-registry)
repository doesn't actually contain a `get-started/data.xml` file. Like with
`dvc get`, importing also downloads the data from the appropriate
[remote storage](/doc/command-reference/remote).

</details>

Let's wrap up by committing the import stage changes with Git:

```dvc
$ git add data/data.xml.dvc
$ git commit -m "Import raw data (overwrite)"
$ dvc push
```

### Python API

Besides command line access to data files tracked in remote <abbr>DVC
repositories</abbr>, you can also use DVC's _Python API_ to **access the data
contents directly** from your code. For example:

```py
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    # ... fd is a file descriptor that can be processed normally.
```

Please refer to the [DVC Python API](/doc/api-reference) for many more details.

---

Go to the next page to continue ↘
