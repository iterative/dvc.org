---
title: 'Get Started: Data and Model Versioning'
description: 'Get started with data and model versioning in DVC. Learn how to use a
regular Git workflow for datasets and ML models, without storing large files in
Git.'
---

# Get Started: Data Versioning

How cool would it be to make Git handle arbitrarily large files and directories
with the same performance it has with small code files? Imagine doing a
`git clone` and seeing data files and machine learning models in the workspace.
Or switching to a different version of a 100Gb file in less than a second with a
`git checkout`.

The foundation of DVC consists of a few commands you can run along with `git` to
track large files, directories, or ML model files. Think "Git for data". Read on
or watch our video to learn about versioning data with DVC!

https://youtu.be/kLKBcPonMYw

To start tracking a file or directory, use `dvc add`:

<details>

### ⚙️ Expand to get an example dataset.

Having initialized a project in the previous section, we can get the data file
(which we'll be using later) like this:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

We use the fancy `dvc get` command to jump ahead a bit and show how a Git repo
becomes a source for datasets or models — what we call a "data/model registry".
`dvc get` can download any file or directory tracked in a <abbr>DVC
repository</abbr>. It's like `wget`, but for DVC or Git repos. In this case we
download the latest version of the `data.xml` file from the
[dataset registry](https://github.com/iterative/dataset-registry) repo as the
data source.

</details>

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added file (or a directory) in a special `.dvc`
file named `data/data.xml.dvc` — a small text file with a human-readable
[format](/doc/user-guide/project-structure/dvc-files). This metadata file is a
placeholder for the original data, and can be easily versioned like source code
with Git:

```dvc
$ git add data/data.xml.dvc data/.gitignore
$ git commit -m "Add raw data"
```

The original data, meanwhile, is listed in `.gitignore`.

<details>

### 💡 Expand to see what happens under the hood.

`dvc add` moved the data to the project's <abbr>cache</abbr>, and
<abbr>linked</abbr> it back to the <abbr>workspace</abbr>.

```dvc
$ tree .dvc/cache
../.dvc/cache
└── a3
    └── 04afb96060aad90176268345e10355
```

The hash value of the `data.xml` file we just added (`a304afb...`) determines
the cache path shown above. And if you check `data/data.xml.dvc`, you will find
it there too:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
```

</details>

## Storing and sharing

You can upload DVC-tracked data or model files with `dvc push`, so they're
safely stored [remotely](/doc/command-reference/remote). This also means they
can be retrieved on other environments later with `dvc pull`. First, we need to
set up a remote storage location:

```dvc
$ dvc remote add -d storage s3://mybucket/dvcstore
$ git add .dvc/config
$ git commit -m "Configure remote storage"
```

> DVC supports many remote storage types, including Amazon S3, SSH, Google
> Drive, Azure Blob Storage, and HDFS. See `dvc remote add` for more details and
> examples.

<details>

### ⚙️ Expand to set up remote storage.

DVC remotes let you store a copy of the data tracked by DVC outside of the local
cache (usually a cloud storage service). For simplicity, let's set up a _local
remote_:

```dvc
$ mkdir -p /tmp/dvcstore
$ dvc remote add -d myremote /tmp/dvcstore
$ git commit .dvc/config -m "Configure local remote"
```

> While the term "local remote" may seem contradictory, it doesn't have to be.
> The "local" part refers to the type of location: another directory in the file
> system. "Remote" is what we call storage for <abbr>DVC projects</abbr>. It's
> essentially a local data backup.

</details>

```dvc
$ dvc push
```

Usually, we also want to `git commit` and `git push` the corresponding `.dvc`
files.

<details>

### 💡 Expand to see what happens under the hood.

`dvc push` copied the data <abbr>cached</abbr> locally to the remote storage we
set up earlier. You can check that the data has been stored in the DVC remote
with:

```dvc
$ ls -R /tmp/dvcstore
/tmp/dvcstore/:
a3

/tmp/dvcstore/a3:
04afb96060aad90176268345e10355
```

</details>

## Retrieving

Having DVC-tracked data and models stored remotely, it can be downloaded when
needed in other copies of this <abbr>project</abbr> with `dvc pull`. Usually, we
run it after `git clone` and `git pull`.

<details>

### ⚙️ Expand to delete locally cached data.

If you've run `dvc push`, you can delete the cache (`.dvc/cache`) and
`data/data.xml` to experiment with `dvc pull`:

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

When you make a change to a file or directory, run `dvc add` again to track the
latest version:

<details>

### ⚙️ Expand to make some changes.

Let's say we obtained more data from some external source. We can pretend this
is the case by doubling the dataset:

```dvc
$ cp data/data.xml /tmp/data.xml
$ cat /tmp/data.xml >> data/data.xml
```

</details>

```dvc
$ dvc add data/data.xml
```

Usually you would also run `git commit` and `dvc push` to save the changes:

```dvc
$ git commit data/data.xml.dvc -m "Dataset updates"
$ dvc push
```

## Switching between versions

The regular workflow is to use `git checkout` first (to switch a branch or
checkout a `.dvc` file version) and then run `dvc checkout` to sync data:

```dvc
$ git checkout <...>
$ dvc checkout
```

<details>

### ⚙️ Expand to get the previous version of the dataset.

Let's go back to the original version of the data:

```dvc
$ git checkout HEAD~1 data/data.xml.dvc
$ dvc checkout
```

Let's commit it (no need to do `dvc push` this time since this original version
of the dataset was already saved):

```dvc
$ git commit data/data.xml.dvc -m "Revert dataset updates"
```

</details>

Yes, DVC is technically not even a version control system! `.dvc` file contents
define data file versions. Git itself provides the version control. DVC in turn
creates these `.dvc` files, updates them, and synchronizes DVC-tracked data in
the <abbr>workspace</abbr> efficiently to match them.

## Large datasets versioning

In cases where you process very large datasets, you need an efficient mechanism
(in terms of space and performance) to share a lot of data, including different
versions. Do you use network attached storage (NAS)? Or a large external volume?
You can learn more about advanced workflows using these links:

- A [shared cache](/doc/user-guide/how-to/share-a-dvc-cache) can be set up to
  store, version and access a lot of data on a large shared volume efficiently.
- A quite advanced scenario is to track and version data directly on the remote
  storage (e.g. S3). See
  [Managing External Data](https://dvc.org/doc/user-guide/managing-external-data)
  to learn more.
