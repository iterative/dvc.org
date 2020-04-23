# Data Versioning

The first layer of DVC provides a basic framework for versioning, storing, and
sharing data files or directories, ML models, and intermediate results. This can
be done on a regular Git workflow, but without actually storing the file
contents with Git.

<details>

### TLDR: Get the complete project

In case you'd like to get the complete code base and final results, or have any
issues along the way, please note that we have a fully reproducible
[example-get-started](https://github.com/iterative/example-get-started) repo on
Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ dvc pull
```

</details>

👉 Having [initialized](/doc/tutorials/get-started#initialize) DVC, let's get an
example dataset:

```dvc
$ mkdir data
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

> `dvc get` can download any <abbr>data artifact</abbr> tracked in a <abbr>DVC
> repository</abbr>. It's like `wget`, but for DVC/Git repos. In this case we
> use our [dataset registry](https://github.com/iterative/dataset-registry) repo
> as the data source.

## Start tracking data

To track a file or directory that is too large for Git, just run `dvc add` on
it:

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added file in a special _DVC-file_ named
`data/data.xml.dvc`, a small text file with a human-readable
[format](/doc/user-guide/dvc-file-format). This also tells Git to ignore the
added file, so that this version of the repository can be safely committed with
Git:

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data"
```

<details>

### Expand to see what happened internally

`dvc add` moves the data to the <abbr>cache</abbr>, and links\* it back to the
<abbr>workspace</abbr>.

```dvc
$ ls -R .dvc/cache
...
.dvc/cache/a3:
04afb96060aad90176268345e10355
```

The hash value of the `data/data.xml` file we just added,
`a304afb96060aad90176268345e10355`, determines the path and file name shown
above. And if you check `data/data.xml.dvc`, you will see that it stores this
value.

> \* See
> [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
> `dvc config cache` for more information on file linking.

</details>

> 📖 See
> [Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files)
> for more information on versioning data with DVC.

## Configure remote storage

Because we'll want to share data, models, etc. outside of the local context
where it's <abbr>cached</abbr>, we're going to set up a default
[remote storage](/doc/command-reference/remote). As a simple example, let's set
up a _local remote_:

```dvc
$ mkdir -p /tmp/dvc-storage
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the type of location where the storage is: another directory in the
same file system. "Remote" is how we call storage for <abbr>DVC projects</abbr>.
It's essentially a local backup for data tracked by DVC.

</details>

That's it! DVC doesn't require installing databases, storage servers, or
warehouses. It can simply use cloud services or local/network file systems to
store data, intermediate results, ML models, etc.

💡 Note that DVC supports many remote storage types: Google Drive, Amazon S3,
Azure Blob Storage, Google Cloud Storage, Aliyun OSS, SSH, HDFS, and HTTP.
Please refer to `dvc remote add` for more details and examples.

> Refer to `dvc config` for other configuration information.

## Store and retrieve data

To share data tracked with DVC, you can push it from your <abbr>project</abbr>
to [remote storage](/doc/command-reference/remote):

```dvc
$ dvc push
```

<details>

### Expand to see what happened internally

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
[DVC-files](/doc/user-guide/dvc-file-format) (which should be committed with
Git).

</details>

Now that `dvc push` uploaded the data to a DVC remote, it can be pulled by
yourself or colleagues when needed in other copies of this project.

<details>

### Expand to simulate a fresh clone of this repo

The difference between a working <abbr>DVC repository</abbr> and its underlying
Git repo is that the data tracked with DVC is **not stored by Git**. So let's
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

> Other related commands are `dvc fetch` and `dvc checkout`.

> 📖 See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Get older data version

Now that we have multiple experiments, models, processed datasets, the question
is how do we revert back to an older version of a model file? Or how can we get
the previous version of the dataset if it was changed at some point?

The answer is the `dvc checkout` command, and we already touched briefly the
process of switching between different data versions in previous sections.

Let's say we want to get the previous `model.pkl` file. The short answer is:

```dvc
$ git checkout baseline-experiment train.dvc
$ dvc checkout train.dvc
```

These two commands will bring the previous model file to its place in the
<abbr>workspace</abbr>.

<details>

### Expand to see what happened internally

DVC uses special [DVC-files](/doc/user-guide/dvc-file-format) to track data
files, directories, end results. In this case, `train.dvc` among other things
describes the `model.pkl` file this way:

```yaml
outs:
md5: a66489653d1b6a8ba989799367b32c43
path: model.pkl
```

`a664...2c43` is the "address" of the file in the local or remote DVC storage.

It means that if we want to get to the previous version, we need to restore the
DVC-file first with the `git checkout` command. Only after that can DVC restore
the model file using the new "address" from the DVC-file.

</details>

To fully restore the previous experiment we just run `git checkout` and
`dvc checkout` without specifying a target:

```dvc
$ git checkout baseline-experiment
$ dvc checkout
```

Read the `dvc checkout` command reference and a dedicated data versioning
[example](/doc/tutorials/versioning) for more information.

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
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

`dvc import` downloads and overwrites the same `data/data.xml`, tracking it with
DVC in the same step, so you don't have to use `dvc add` separately.
Additionally, `data.xml.dvc` now has special metadata that allows DVC to track
changes in the source data. This allows you to bring in changes from the data
source later, using `dvc update`.

<details>

### Expand to see what happened internally

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

📖 Please refer to the [DVC Python API](/doc/api-reference) for more details.
