# Data Versioning

The first layer of DVC provides a basic framework for versioning, storing, and
sharing data files or directories, ML models, and intermediate results. This can
be done on a regular Git workflow, but without actually storing the file
contents with Git.

- You'll need [Python](https://www.python.org/) to follow this tutorial.

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
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

> `dvc get` can download any <abbr>data artifact</abbr> tracked in a <abbr>DVC
> repository</abbr>. It's like `wget`, but for DVC or Git repos. In this case we
> use our [dataset registry](https://github.com/iterative/dataset-registry) repo
> as the data source.

## Tracking data

To track a file or directory that is too large for Git, just run `dvc add` on
it:

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added file in a special _DVC-file_ named
`data/data.xml.dvc`, a small text file with a human-readable
[format](/doc/user-guide/dvc-file-format). This also causes Git to ignore the
added data, so that this version of the repository can be safely committed with
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

The hash value of the `data/data.xml` file we just added, `a304afb...`,
determines the path and file name shown above. If you check `data/data.xml.dvc`,
you will find it there too:

```yaml
md5: 301598c8348f8ac0c95abc6fc19da952
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    cache: true
```

> \* See
> [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
> `dvc config cache` for more information on file linking.

</details>

> 📖 See
> [Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files)
> for more information on versioning data with DVC.

## Remote storage

Because we'll want to share data and models outside of the local context where
they're <abbr>cached</abbr>, we're going to set up a default
[DVC remote](/doc/command-reference/remote). As a simple example, let's set up a
_local remote_:

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

💡 DVC supports the following **remote storage types**: Google Drive, Amazon S3,
Azure Blob Storage, Google Cloud Storage, Aliyun OSS, SSH, HDFS, and HTTP.
Please refer to `dvc remote add` for more details and examples.

## Backup and share data

To **upload** tracked data by DVC to
[remote storage](/doc/command-reference/remote), use `dvc push`:

```dvc
$ dvc push
```

<details>

### Expand to see what happened internally

`dvc push` copied the data we [added](#tracking-data) earlier from the
<abbr>cache</abbr> to the default remote storage we [set up](#remote-storage)
before. You can check that the data has been backed up to the DVC remote
(`/tmp/dvc-storage` local directory) with:

```dvc
$ ls -R /tmp/dvc-storage
...
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

</details>

Pushing data or models ensures they're safely backed up remotely for yourself or
others to access from other environments. Usually, we also want to `git commit`
and `git push` the corresponding [DVC-files](/doc/user-guide/dvc-file-format).

## Retrieve data

Now that there's data stored remotely, it can be **downloaded** when needed to
other copies of this project with `dvc pull`:

<details>

### 👉 Expand to simulate a fresh clone of this repo

Let's just remove the data file added so far, both from <abbr>workspace</abbr>
and <abbr>cache</abbr>:

```dvc
$ rm -f data/data.xml .dvc/cache/a3/04afb96060aad90176268345e10355
$ dvc status
data\data.xml.dvc:
        changed outs:
                deleted:            data\data.xml
```

`dvc status` detects when DVC-tracked data is missing (among other
<abbr>project</abbr> states).

</details>

```dvc
$ dvc pull
```

This pulls the data files and directories referenced in all present
[DVC-files](/doc/user-guide/dvc-file-format). Usually, we run it after
`git clone` and `git pull`.

> 📖 See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Navigate versions

[Tracking](#tracking-data) files or directories means that DVC becomes aware of
them, and it can notice when they change. To register a new version of the data,
just use `dvc add` again:

<details>

### 👉 Expand to update the data

Let's clean up our raw dataset in-place, by using the `src/cleanup.py` script:

```dvc
$ python src/cleanup.py data/data.xml
$ dvc status
data\data.xml.dvc:
        changed outs:
                modified:           data\data.xml
```

`dvc status` detects when DVC-tracked data is modified (among other
<abbr>project</abbr> states).

</details>

```dvc
$ dvc add data/data.xml
```

DVC updates the `data/data.xml.dvc` [DVC-file](/doc/user-guide/dvc-file-format)
to match the updated data. Let's commit this new version with Git:

<details>

### Expand to see what happened internally

Use `git diff` to show the change in `data/data.xml.dvc`:

```diff
-md5: 301598c8348f8ac0c95abc6fc19da952
+md5: a7aed3f683025c61e0f8e120279ed854
 outs:
-- md5: a304afb96060aad90176268345e10355
+- md5: 558a00881d4a6815ba625c13e27c5b7e
   path: data.xml
   cache: true
```

Since `data/data.xml` changed, its hash value is updated to `558a008...` (under
`outs`). And given this change inside the DVC-file, it's own hash value is
updated to `a7aed3f...`.

</details>

```dvc
$ git add data/data.xml.dvc
$ git commit -m "Clean up data"
```

Since we have multiple [data versions](#navigate-versions), we may want to
switch between them. We can use `dvc checkout` for this. Let's say we want to
revert to the raw `data/data.xml` (before cleaning):

```dvc
$ git checkout HEAD^ data/data.xml.dvc
$ dvc checkout data/data.xml.dvc
```

<details>

### Expand to see what happened internally

`git checkout` brought the `data/data.xml.dvc`
[DVC-file](/doc/user-guide/dvc-file-format) back to the version with the
previous hash value of the data, `a304afb...`:

```yaml
outs:
  md5: a304afb96060aad90176268345e10355
  path: data.xml
```

All `dvc checkout` does is linking the corresponding file from the
<abbr>cache</abbr> to the <abbr>workspace</abbr>.

</details>

## Advanced data access

We've seen how to share data among team members or environments of the same
<abbr>DVC project</abbr>. But what if we wanted to reuse a dataset or ML model
from a different DVC repository?

One way is to manually download the data and use `dvc add` to track it (as done
in the beginning of this page). But the connection between the projects is lost
this way: others won't know where the data came from or whether new versions are
available. Let's see better alternatives:

### Find a dataset

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example:

```dvc
$ dvc list https://github.com/iterative/dataset-registry
.gitignore
README.md
get-started     # <- Let's see what's in this directory.
images
tutorial
use-cases
$ dvc list https://github.com/iterative/dataset-registry get-started
.gitignore
data.xml        # <- Bingo!
data.xml.dvc
```

The benefit of this command over browsing a Git hosting website is that the list
shown includes files and directories tracked by **both Git and DVC**.

### Import the dataset

Let's replace `data/data.xml` by importing it directly from its original source.
`dvc import` downloads the dataset, and tracks **it the same step**, so you
don't have to use `dvc add` separately:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

<details>

#### Expand to see what happened internally

DVC-files created by `dvc import` are called _import stages_. These have fields,
such as the data source `repo`, and `path` (under `deps`):

```yaml
deps:
  path: get-started/data.xml
  repo:
    url: https://github.com/iterative/dataset-registry
    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

> Note that the
> [dataset registry](https://github.com/iterative/dataset-registry) repository
> doesn't actually contain a `get-started/data.xml` file. Like `dvc get`,
> importing downloads from [remote storage](/doc/command-reference/remote).

</details>

Additionally, the `data/data.xml` [DVC-file](/doc/user-guide/dvc-file-format)
now includes metadata to track changes in the source data. This allows you to
bring in changes from the data source later, using `dvc update`.

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
