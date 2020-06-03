# Data Versioning

To **track** a large file or directory in a <abbr>DVC project</abbr>, use
`dvc add`:

<details>

### 👉 Expand to get an example dataset

Having [initialized](/doc/tutorials/get-started#initialize) the project, do
this:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

> `dvc get` can download any <abbr>data artifact</abbr> tracked in a <abbr>DVC
> repository</abbr>. It's like `wget`, but for DVC or Git repos. In this case we
> use our [dataset registry](https://github.com/iterative/dataset-registry) repo
> as the data source.

</details>

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added file in a special _DVC-file_ named
`data/data.xml.dvc`, a small text file with a human-readable
[format](/doc/user-guide/dvc-files-and-directories). This `.dvc` file can
committed with Git instead, as a placeholder for the original data (which is
added to `.gitignore`):

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data"
```

<details>

### Expand to see what happened internally

`dvc add` moved the data to the project's <abbr>cache</abbr>, and linked\* it
back to the <abbr>workspace</abbr>.

```dvc
$ ls -R .dvc/cache
...
.dvc/cache/a3:
04afb96060aad90176268345e10355
```

The hash value of the `data/data.xml` file we just added (`a304afb...`)
determines the cache path shown above. And if you check `data/data.xml.dvc`, you
will find it there too:

```yaml
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

## Changes

`dvc status` can notice when tracked data has changed (among other situations).
To record a new version of the data, just use `dvc add` again:

<details>

### 👉 Expand to clean up the data !

Let's first get some code to work with:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
$ ls src
cleanup.py  evaluate.py  featurization.py
prepare.py  requirements.txt  train.py
```

Let's clean up our raw dataset in-place, by using the `src/cleanup.py` script:

```dvc
$ python src/cleanup.py data/data.xml
```

Please stage or commit `src/cleanup.py` with Git at this point.

</details>

```dvc
$ dvc status
data\data.xml.dvc:
        changed outs:
                modified:           data\data.xml
$ dvc add data/data.xml
```

DVC updates the `data/data.xml.dvc`
[DVC-file](/doc/user-guide/dvc-files-and-directories) to match the updated data.
Let's commit this new version with Git:

<details>

### Expand to see what happened internally

Use `git diff` to show the change in `data/data.xml.dvc`:

```diff
 outs:
-- md5: a304afb96060aad90176268345e10355
+- md5: 558a00881d4a6815ba625c13e27c5b7e
   path: data.xml
   cache: true
```

Since `data/data.xml` changed, its hash value is updated (to `558a008...`).

</details>

```dvc
$ git add data/data.xml.dvc
$ git commit -m "Clean up data"
```

## Switching versions

When we have more than one data version, we may want to switch between them. We
can use `dvc checkout` for this. Let's say we want to revert back to the raw
`data/data.xml`:

```dvc
$ git checkout HEAD^ data/data.xml.dvc
$ dvc checkout data/data.xml.dvc
```

<details>

### Expand to see what happened internally

`git checkout` brought the `data/data.xml.dvc` DVC-file back to the version,
with the previous hash value of the data (`a304afb...`):

```yaml
outs:
  md5: a304afb96060aad90176268345e10355
  path: data.xml
```

All `dvc checkout` does is putting the corresponding file, stored in the
<abbr>cache</abbr>, back into the <abbr>workspace</abbr>. This brings
DVC-tracked data up to date with the current Git commit.

</details>

## Backing up & sharing

To **upload** data tracked by DVC to
[remote storage](/doc/command-reference/remote), use `dvc push`:

<details>

### 👉 Set up remote storage first

DVC remotes let you store a copy of the data tracked by DVC outside of the local
cache, usually a **cloud storage** service. For simplicity, let's set up a
_local remote_:

```dvc
$ mkdir -p /tmp/dvc-storage
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

> While the term "local remote" may seem contradictory, it doesn't have to be.
> The "local" part refers to the type of location: another directory in the file
> system. "Remote" is how we call storage for <abbr>DVC projects</abbr>. It's
> essentially a local data backup.

💡 DVC supports the following **remote storage types**: Google Drive, Amazon S3,
Azure Blob Storage, Google Cloud Storage, Aliyun OSS, SSH, HDFS, and HTTP.
Please refer to `dvc remote add` for more details and examples.

</details>

```dvc
$ dvc push
```

> Usually, we also want to `git commit` and `git push` the corresponding
> [DVC-files](/doc/user-guide/dvc-files-and-directories).

Pushing data or models ensures they're safely backed up remotely. This also
means they can be retrieved from other environments.

<details>

### Expand to see what happened internally

`dvc push` copied the data <abbr>cached</abbr> locally to the remote storage we
set up earlier. You can check that the data has been backed up to the DVC remote
with:

```dvc
$ ls -R /tmp/dvc-storage
...
/tmp/dvc-storage/55:
8a00881d4a6815ba625c13e27c5b7e
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

Note that both versions of the data file are stored. (This should match
`.dvc/cache`.)

</details>

## Restoring

Having DVC-tracked data stored remotely, it can be **downloaded** when needed in
other copies of this <abbr>project</abbr> with `dvc pull`. Usually, we run it
after `git clone` and `git pull`.

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

`dvc status` detects when DVC-tracked data is missing (among other situations).

</details>

```dvc
$ dvc pull
```

> 📖 See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Data access

We've seen how to share data among team members or environments of the same
<abbr>DVC project</abbr>. But what if we wanted to reuse a dataset or ML model
from a different DVC repository?

One way is to download the data with `dvc get` and use `dvc add` to track it (as
done in the beginning of this page). But the connection between the projects is
lost this way: others won't know where the data came from or whether new
versions are available. Let's see better alternatives:

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
> doesn't actually contain a `get-started/data.xml` file. Like `dvc get` and
> `dvc import` download from [remote storage](/doc/command-reference/remote).

</details>

Additionally, the `data/data.xml`
[DVC-file](/doc/user-guide/dvc-files-and-directories) now includes metadata to
track changes in the source data. This allows you to bring in changes from the
data source later, using `dvc update`.

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
