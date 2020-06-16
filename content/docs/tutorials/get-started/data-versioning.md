# Data Versioning

How cool would it be to make Git handle arbitraty large files and directories
with the same performance as Git itself? Imagine you can do a `git clone` and
see data files and ML model files in the workspace. Or do `git checkout` and
switch to a different version of a 100Gb size file in a less than a second?

The core part of DVC is a few commands that you can run along with Git to track
a large file, ML model or a directory. To start tracking a file or directory,
use `dvc add`:

<details>

### ⚙️ Expand to get an example dataset

Having initialized a project in the previous section, get the data file we will
be using later like this:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

We use the fancy `dvc get` command to jump ahead a bit and show how Git repo
becomes a source for datasets or models - what we call "data registry" or "model
registry". `dvc get` can download any <abbr>data artifact</abbr> tracked in a
<abbr>DVC repository</abbr>. It's like `wget`, but for DVC or Git repos. In this
case we download the latest version of the `data.xml` file from the
[dataset registry](https://github.com/iterative/dataset-registry) repo as the
data source.

</details>

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added file (or a directory) in a special `.dvc`
file named `data/data.dvc`, a small text file with a human-readable
[format](/doc/user-guide/dvc-files-and-directories#dvc-files). This file can be
easily versioned like source code with Git, as a placeholder for the original
data (which is listed in `.gitignore`):

```dvc
$ git add .gitignore datadir.dvc
$ git commit -m "Add raw data"
```

<details>

### 💡Expand to see what happens under the hood

`dvc add` moved the data to the project's <abbr>cache</abbr>, and linked\* it
back to the <abbr>workspace</abbr>.

```dvc
$ tree .dvc/cache
../.dvc/cache
└── a3
    └── 04afb96060aad90176268345e10355
```

The hash value of the `data.xml` file we just added (`a304afb...`) determines
the cache path shown above. And if you check `data/data.dvc`, you will find it
there too:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
```

> \* See
> [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
> `dvc config cache` for more information on file linking.

</details>

## Storing and sharing

You can upload DVC-tracked data or models with `dvc push`, so they're safely
stored [remotely](/doc/command-reference/remote). This also means they can be
retrieved on other environments later with `dvc pull`. First, we need to setup a
storage.

```dvc
$ dvc remote add -d storage s3://my-bucket/dvc-storage
$ git commit .dvc/config -m "Configure remote storage"
```

> DVC supports the following remote storage types: Google Drive, Amazon S3,
> Azure Blob Storage, Google Cloud Storage, Aliyun OSS, SSH, HDFS, and HTTP.
> Please refer to `dvc remote add` for more details and examples.

<details>

### ⚙️ Set up a remote storage

DVC remotes let you store a copy of the data tracked by DVC outside of the local
cache, usually a cloud storage service. For simplicity, let's set up a _local
remote_:

```dvc
$ mkdir -p /tmp/dvc-storage
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

> While the term "local remote" may seem contradictory, it doesn't have to be.
> The "local" part refers to the type of location: another directory in the file
> system. "Remote" is how we call storage for <abbr>DVC projects</abbr>. It's
> essentially a local data backup.

</details>

```dvc
$ dvc push
```

Usually, we also want to `git commit` and `git push` the corresponding
[`.dvc` files](/doc/user-guide/dvc-files-and-directories#dvc-files).

<details>

### 💡 Expand to see what happens internally

`dvc push` copied the data <abbr>cached</abbr> locally to the remote storage we
set up earlier. You can check that the data has been stored in the DVC remote
with:

```dvc
$ ls -R /tmp/dvc-storage
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

</details>

## Retrieving

Having DVC-tracked data stored remotely, it can be downloaded when needed in
other copies of this <abbr>project</abbr> with `dvc pull`. Usually, we run it
after `git clone` and `git pull`.

<details>

### ⚙️ Expand to explode 💣 the project

If you've run `dvc push` successfully previously, you can just safely delete the
cache `.dvc/cache` and `data/data.xml` to experiment with `dvc pull`:

```dvc
$ rm -rf .dvc/cache
$ rm -f data/data.xml
```

</details>

```dvc
$ dvc pull
```

> 📖 See also
> [Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files)
> for more on basic collaboration workflows.

## Making changes

When you make a change to a file or directory, run `dvc add` again to track
changes:

```dvc
$ dvc add data/data.xml
```

<details>

### ⚙️ Expand to make some changes

For the sake of simplicity let's just double the dataset artificially (and
pretend that we got more data from some external source):

```dvc
$ cp data/data.xml /tmp/data.xml
$ cat /tmp/data.xml >> data/data/xml
```

</details>

Usually you would do `git commit` and `dvc push` to save the changes:

```dvc
$ git commit data/data.xml.dvc -m "Dataset updates"
$ dvc push
```

## Switching between versions

The regular worfklow is to use `git checkout` first to switch a branch, checkout
a commit, checkout a revision of a file, and then run `dvc checkout` to sync
data:

```dvc
$ git checkout <...>
$ dvc checkout
```

<details>

### ⚙️ Expand to get the previous version of the dataset

Let's cleanup the previous artificial changes we made and get the previous :

```dvc
$ git checkout HEAD^1 data/data.xml.dvc
$ dvc checkout
```

Let's commit it (no need to do `dvc push` this time since the previous version
of this dataset was save before):

```dvc
$ git commit data/data.xml.dvc -m "Revert dataset updates"
```

</details>

As you can see, DVC technically is not even a version control system. `.dvc`
files content defines data file versions. Git itself serves as a version control
system. DVC in turn is a tool to create these `.dvc` files, update them, and
update DVC-tracked files in the workspace efficiently to match the `.dvc` files.

## Large datasets versioning

There are cases when you process very large datasets, you need efficient (in
terms of space and performance) mechanism to share a lot of data including
different versions of it (you use some network attached storage? or some
external large volume?). There is no goal to cover these cases in the Get
Started, but we would recommend to read these sections next to learn more about
advanced workflow:

- The shared extental cache idea described, for example,
  [here](https://dvc.org/doc/use-cases/shared-development-server) can be applied
  to store, version and access very efficienlty a lot of data on some (large)
  shared volume.
- A quite advanced scenario is to track and version data directly on the remote
  storage (e.g. S3). Check the
  [Managing External Data](https://dvc.org/doc/user-guide/managing-external-data)
  to learn more.
