---
title: 'Get Started: Data Versioning'
description: 'Get started with data and model versioning in DVC. Learn how to
use a standard Git workflow for datasets and ML models, without storing large
files in Git.'
---

# Get Started: Data Versioning

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/kLKBcPonMYw

</details>

How cool would it be to make Git handle arbitrarily large files and directories
with the same performance it has with small code files? Imagine cloning a
repository and seeing data files and machine learning models in the workspace.
Or switching to a different version of a 100Gb file in less than a second with a
`git checkout`. Think "Git for data".

<details>

### ⚙️ Expand to get an example dataset.

Having initialized a project in the previous section, we can get the data file
(which we'll be using later) like this:

```cli
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

<admon type="info">

We use the fancy `dvc get` command to jump ahead a bit and show how a Git repo
becomes a source for datasets or models — what we call a [data registry].
`dvc get` can download any file or directory tracked in a <abbr>DVC
repository</abbr>.

[data registry]: /doc/use-cases/data-registry

</admon>

</details>

To start tracking a file or directory, use `dvc add`:

```cli
$ dvc add data/data.xml
```

DVC stores information about the added file in a special `.dvc` file named
`data/data.xml.dvc` -- a small text file with a human-readable [format]. This
metadata file is a placeholder for the original data, and can be easily
versioned like source code with Git:

```cli
$ git add data/data.xml.dvc data/.gitignore
$ git commit -m "Add raw data"
```

The data, meanwhile, is listed in `.gitignore`.

<details id="add-click-to-see-what-happens-under-the-hood">

### 💡 Click to see what happens under the hood.

`dvc add` moved the data to the project's <abbr>cache</abbr>, and
<abbr>linked</abbr> it back to the <abbr>workspace</abbr>. The `.dvc/cache`
should look like this:

```
.dvc/cache
└── 22
    └── a1a2931c8370d3aeedd7183606fd7f
```

The hash value of the `data.xml` file we just added (`22a1a29...`) determines
the cache path shown above. And if you check `data/data.xml.dvc`, you will find
it there too:

```yaml
outs:
  - md5: 22a1a2931c8370d3aeedd7183606fd7f
    path: data.xml
```

</details>

[format]: /doc/user-guide/project-structure/dvc-files

## Storing and sharing

You can upload DVC-tracked data or models with `dvc push`. This requires setting
up [remote storage] first, for example on Amazon S3:

[remote storage]: /doc/user-guide/data-management/remote-storage

```cli
$ dvc remote add -d storage s3://mybucket/dvcstore
$ dvc push
```

<details>

### ⚠️ That didn't work!

Instead of the S3 remote in the next block, use this "local remote" (another
directory in the local file system) to try `dvc push`:

<toggle>
<tab title="Mac/Linux">

```cli
$ mkdir /tmp/dvcstore
$ dvc remote add -d myremote /tmp/dvcstore
```

</tab>
<tab title="Windows (Cmd)">

```cli
$ mkdir %TEMP%/dvcstore
$ dvc remote add -d myremote %TEMP%\dvcstore
```

</tab>
</toggle>

<admon type="info">

DVC supports many remote [storage types], including Amazon S3, SSH, Google
Drive, Azure Blob Storage, and HDFS.

[storage types]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types

</admon>

</details>

<details id="push-click-to-see-what-happens-under-the-hood">

### 💡 Click to see what happens under the hood.

`dvc push` copied the data <abbr>cached</abbr> locally to the remote storage we
set up earlier. The remote storage directory should look like this:

```
.../dvcstore
└── 22
    └── a1a2931c8370d3aeedd7183606fd7f
```

If you prefer to keep human-readable filenames, you can use [cloud versioning].

[cloud versioning]: /doc/user-guide/data-management/cloud-versioning

</details>

Usually, we also want to `git commit` (and `git push`) the project config
changes.

## Retrieving

Having DVC-tracked data and models stored remotely, it can be downloaded with
`dvc pull` when needed (e.g. in other copies of this <abbr>project</abbr>).
Usually, we run it after `git clone` and `git pull`.

<details>

### ⚙️ Expand to delete locally cached data.

If you've run `dvc push` successfully, empty the <abbr>cache</abbr> and delete
`data/data.xml` for `dvc pull` to have an effect:

<toggle>
<tab title="Mac/Linux">

```cli
$ rm -rf .dvc/cache
$ rm -f data/data.xml
```

</tab>
<tab title="Windows (Cmd)">

```cli
$ rmdir .dvc\cache
$ del data\data.xml
```

</tab>
</toggle>

</details>

```cli
$ dvc pull
```

<admon icon="book">

See [Remote Storage] for more information on remote storage.

</admon>

## Making changes

When you make a change to a file or directory, run `dvc add` again to track the
latest version:

<details>

### ⚙️ Expand to make some changes.

Let's say we obtained more data from some external source. We can pretend this
is the case by doubling the dataset:

<toggle>
<tab title="Mac/Linux">

```cli
$ cp data/data.xml /tmp/data.xml
$ cat /tmp/data.xml >> data/data.xml
```

</tab>
<tab title="Windows (Cmd)">

```cli
$ copy data\data.xml %TEMP%\data.xml
$ type %TEMP%\data.xml >> data\data.xml
```

</tab>
</toggle>

</details>

```cli
$ dvc add data/data.xml
```

Usually you would also run `dvc push` and `git commit` to save the changes:

```cli
$ dvc push
$ git commit data/data.xml.dvc -m "Dataset updates"
```

## Switching between versions

The regular workflow is to use `git checkout` first (to switch a branch or
checkout a `.dvc` file version) and then run `dvc checkout` to sync data:

```cli
$ git checkout <...>
$ dvc checkout
```

<details>

### ⚙️ Expand to get the previous version of the dataset.

Let's go back to the original version of the data:

```cli
$ git checkout HEAD~1 data/data.xml.dvc
$ dvc checkout
```

Let's commit it (no need to do `dvc push` this time since this original version
of the dataset was already saved):

```cli
$ git commit data/data.xml.dvc -m "Revert dataset updates"
```

</details>

Yes, DVC is technically not a version control system! Git itself provides that
layer. DVC in turn manipulates `.dvc` files, whose contents define the data file
versions. DVC also synchronizes DVC-tracked data in the <abbr>workspace</abbr>
efficiently to match them.

## Discovering and accessing data

DVC helps you with accessing and using your data artifacts from outside of the
project where they are versioned, and your tracked data can be imported and
fetched from anywhere. For example, you may want to download a specific version
of an ML model to a deployment server or import a dataset into another project.
To learn about how DVC allows you to do this, see the [discovering and accessing
data] how-to guide.

[discovering and accessing data]:
  /doc/user-guide/how-to/discovering-and-accessing-data

## Large datasets versioning

In cases where you process very large datasets, you need an efficient mechanism
(in terms of space and performance) to share a lot of data, including different
versions. Do you use network attached storage (NAS)? Or a large external volume?
You can learn more about advanced workflows using these links:

- A [shared cache](/doc/user-guide/how-to/share-a-dvc-cache) can be set up to
  store, version and access a lot of data on a large shared volume efficiently.
- An advanced scenario is to track and version data directly on the remote
  storage (e.g. S3, SSH). See [Managing External Data] to learn more.

[managing external data]:
  https://dvc.org/doc/user-guide/data-management/managing-external-data
