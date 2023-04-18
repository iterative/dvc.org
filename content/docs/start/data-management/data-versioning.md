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
`git checkout`. Think _"Git for data"_.

### Getting example data.

Working inside an [initialized project](/doc/start#initializing-a-project)
directory, we'll first need to pick a piece of data to work with. Any text or
binary file will do. We can get the example `data.xml` file by running:

```cli
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

<admon type="info">

We use `dvc get` command here to show how a DVC turns any Git repo to a source
for datasets or models (a "[data registry]"). `dvc get` can download any file or
directory tracked in a <abbr>DVC repository</abbr>.

[data registry]: /doc/use-cases/data-registry

</admon>

To start tracking a file or directory, use `dvc add`:

```cli
$ dvc add data/data.xml
```

DVC stores information about the added file in a special `.dvc` file named
`data/data.xml.dvc` -- a small metadata file with a human-readable textual
[format]. This file will act as a placeholder for the original file for the
purpose of Git tracking.

The _metadata about your data_ will now be versioned as source code, while the
original data file is added to `.gitignore` (so expect it to be modified as
well). Run the following commands to track the changes with Git:

```cli
$ git add data/data.xml.dvc data/.gitignore
$ git commit -m "Add raw data"
```

<details id="add-click-to-get-a-peek-under-the-hood">

### 💡 Click to get a peek under the hood

`dvc add` moved the data to the project's <abbr>cache</abbr>, and
<abbr>linked</abbr> it back to the <abbr>workspace</abbr>. The `.dvc/cache` will
look like this:

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

### Configuring shared storage

You can upload DVC-tracked data to a variety of different storage systems
(remote and local), referred to as "remotes". Before pushing data remotely, you
will need to set up such a remote.

To keep this guide simple, instead of using cloud storage, we will set up and
use a "local remote", which is simply a directory in the local file system.
Configure this now according to your OS:

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

A very common use case will be to configure an [Amazon S3] remote:

```cli
$ dvc remote add -d storage s3://mybucket/dvcstore
```

For this to work, though, you'll need an AWS account and credentials set up to
allow access.

[Amazon S3]: /doc/user-guide/data-management/remote-storage/amazon-s3
[storage types]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types

</admon>

</details>

### Pushing

Now, all that's left is to `dvc push` the data to the configured remote:

```cli
$ dvc push
```

<details id="push-click-to-get-a-peek-under-the-hood">

#### 💡 Click to get a peek under the hood

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

Usually, we would also want to `git commit` and `git push` the project config
changes.

### Retrieving data

Once DVC-tracked data and models are stored remotely, they can be downloaded
with `dvc pull` whenever needed (e.g. in other copies of this
<abbr>project</abbr>). Usually, we run it after `git pull` or `git clone`.

#### Before you pull

If you've run `dvc push` above, we need to empty the <abbr>cache</abbr> and
delete `data/data.xml` locally to demonstrate the effects of `dvc pull`, or the
pull would be short-circuited for efficiency:

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

#### Pulling

Now we will physically pull the data back to the project and its
<abbr>cache<abbr> by running:

```cli
$ dvc pull
```

<admon icon="book">

See [Remote Storage] for more information on remote storage.

</admon>

[remote storage]: /doc/user-guide/data-management/remote-storage

## Making changes

Now, let's say we obtained more data from some external source. We will simulate
this by doubling the dataset contents:

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

When you make a change to a file or directory, run `dvc add` again to track the
latest version:

```cli
$ dvc add data/data.xml
```

Let's also run `dvc push` to upload the changes to the remote storage. Often,
this will be followed by a `git commit`, to commit the changes locally to Git:

```cli
$ dvc push
$ git commit data/data.xml.dvc -m "Dataset updates"
```

## Switching between versions

The very popular workflow is to use `git checkout` to switch a branch or
checkout a `.dvc` file from a specific revision, followed by `dvc checkout` to
sync data:

```cli
$ git checkout <...>
$ dvc checkout
```

<details>

### ⚙️ Expand to get the previous version of the dataset

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

Yes, DVC is technically not a version control system! DVC manipulates `.dvc`
files with metadata, whose contents define the data file versions. Git, which is
already used to version your code, now also versions your data alongside it. DVC
also synchronizes DVC-tracked data in the <abbr>workspace</abbr> efficiently to
match the `.dvc` files.

## Discovering and accessing data

With DVC, your tracked data can be imported and fetched from anywhere. For
example, you may want to download a specific version of an ML model to a
deployment server or import a dataset into another project. To learn about how
DVC allows you to do this, see the
[discovering and accessing data guide](/doc/user-guide/data-management/discovering-and-accessing-data).
