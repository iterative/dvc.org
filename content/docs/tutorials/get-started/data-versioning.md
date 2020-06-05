# Data Versioning

To **track** a large file or directory, place it in the <abbr>workspace</abbr>,
and use `dvc add`:

<details>

### 👉 Expand to get an example dataset

Having [initialized](/doc/tutorials/get-started#initialize) a project, do this:

```dvc
$ dvc get --rev cats-dogs-v1 \
          https://github.com/iterative/dataset-registry \
          use-cases/cats-dogs -o datadir
```

> `dvc get` can download any <abbr>data artifact</abbr> tracked in a <abbr>DVC
> repository</abbr>. It's like `wget`, but for DVC or Git repos. In this case we
> use a specific version (`cats-dogs-v1` tag) of our
> [dataset registry](https://github.com/iterative/dataset-registry) repo as the
> data source.

Note that while the source data directory was called `cats-dogs/`, we are able
to rename it locally to `datadir/`.

</details>

```dvc
$ dvc add datadir
```

DVC stores information about the added directory in a special _DVC-file_ named
`datadir.dvc`, a small text file with a human-readable
[format](/doc/user-guide/dvc-file-format). This file can be easily **versioned
like source code** with Git, as a placeholder for the original data (which is
listed in `.gitignore`):

```dvc
$ git add .gitignore datadir.dvc
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
04afb96060aad90176268345e10355.dir
```

The hash value of the `datadir/` directory we just added (`a304afb...`)
determines the cache path shown above. And if you check `datadir.dvc`, you will
find it there too:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: datadir
    cache: true
```

> \* See
> [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
> `dvc config cache` for more information on file linking.

</details>

## Tracking changes

`dvc status` can notice when tracked data has changed (among other situations).
To record a new version of the data, just use `dvc add` again:

<details>

### 👉 Expand to get an updated dataset

```dvc
$ dvc get --rev cats-dogs-v2 \
          https://github.com/iterative/dataset-registry \
          use-cases/cats-dogs -o datadir
```

</details>

```dvc
$ dvc status
datadir.dvc:
        changed outs:
                modified:           datadir
$ dvc add datadir
```

DVC caches the changes to the `datadir/` directory, and updates the
`datadir.dvc` [DVC-file](/doc/user-guide/dvc-file-format) to match the changes.
Let's commit this new version with Git:

<details>

### Expand to see what happened internally

Use `git diff` to show the change in `datadir.dvc`:

```diff
 outs:
-- md5: a304afb96060aad90176268345e10355
+- md5: 558a00881d4a6815ba625c13e27c5b7e
   path: datadir
   cache: true
```

Since the contents of `datadir/` changed, its hash value is updated (to
`558a008...`).

</details>

```dvc
$ git add datadir.dvc
$ git commit -m "Change data"
```

## Switching versions

When we have more than one data version, we may want to switch between them. We
can use `dvc checkout` for this. Let's say we want to revert back to the first
`datadir/`:

```dvc
$ git checkout HEAD^ datadir.dvc
$ dvc checkout datadir.dvc
```

<details>

### Expand to see what happened internally

`git checkout` brought the `datadir.dvc` DVC-file back to the version, with the
previous hash value of the data (`a304afb...`):

```yaml
outs:
  md5: a304afb96060aad90176268345e10355
  path: datadir
```

All `dvc checkout` does is putting the corresponding files, stored in the
<abbr>cache</abbr>, back into the <abbr>workspace</abbr>. This brings
DVC-tracked data up to date with the current Git commit.

</details>

> Note that you can use `dvc install` to set up a Git hooks that automate common
> actions, like checking out DVC-tracked data after every Git checkout.

## Storing and sharing

You can **upload** DVC-tracked data or models with `dvc push`, so they're safely
stored [remotely](/doc/command-reference/remote). This also means they can be
retrieved on other environments later.

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

Usually, we also want to `git commit` and `git push` the corresponding
[DVC-files](/doc/user-guide/dvc-file-format).

<details>

### Expand to see what happened internally

`dvc push` copied the data <abbr>cached</abbr> locally to the remote storage we
set up earlier. You can check that the data has been stored in the DVC remote
with:

```dvc
$ ls -R /tmp/dvc-storage
...
/tmp/dvc-storage/55:
8a00881d4a6815ba625c13e27c5b7e
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

Note that both versions of the data are stored. (This should match
`.dvc/cache`.)

</details>

## Retrieving

Having DVC-tracked data stored remotely, it can be **downloaded** when needed in
other copies of this <abbr>project</abbr> with `dvc pull`. Usually, we run it
after `git clone` and `git pull`.

<details>

### 👉 Expand to simulate a fresh clone of this repo

Let's remove the directory added so far, both from <abbr>workspace</abbr>
and <abbr>cache</abbr>:

```dvc
$ rm -f datadir .dvc/cache/a3/04afb96060aad90176268345e10355
$ dvc status
datadir.dvc:
        changed outs:
                deleted:            datadir
```

`dvc status` detects when DVC-tracked data is missing (among other situations).

</details>

```dvc
$ dvc pull
```

> 📖 See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Other ways to track data

In the [Pipelines](/doc/tutorials/get-started/data-pipelines) and
[Access](/doc/tutorials/get-started/data-access) pages you'll learn more
advanced ways to track data. Mainly, `dvc run` can track the intermediate and
final results of complex data processes, and `dvc import` which brings in an
<abbr>artifact</abbr> from an external <abbr>DVC repository</abbr>.
