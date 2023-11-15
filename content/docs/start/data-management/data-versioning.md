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

How cool would it be to track large datasets and machine learning models
alongside your code, sidestepping all the limitations of storing it in Git?
Imagine cloning a repository and immediately seeing your datasets, checkpoints
and models staged in your workspace. Imagine switching to a different version of
a 100Gb file in less than a second with a `git checkout`.

_💫 DVC is your *"Git for data"*!_

## Tracking data

Working inside an [initialized project](/doc/start#initializing-a-project)
directory, let's pick a piece of data to work with. We'll use an example
`data.xml` file, though any text or binary file (or directory) will do. Start by
running:

```cli
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

<admon type="info">

We used `dvc get` above to show how DVC can turn any Git repo into a "[data
registry]". `dvc get` can download any file or directory tracked in a <abbr>DVC
repository</abbr>.

[data registry]: /doc/use-cases/data-registry

</admon>

Use `dvc add` to start tracking the dataset file:

```cli
$ dvc add data/data.xml
```

DVC stores information about the added file in a special `.dvc` file named
`data/data.xml.dvc`. This small, human-readable metadata file acts as a
placeholder for the original data for the purpose of Git tracking.

Next, run the following commands to track changes in Git:

```cli
$ git add data/data.xml.dvc data/.gitignore
$ git commit -m "Add raw data"
```

Now the _metadata about your data_ is versioned alongside your source code,
while the original data file was added to `.gitignore`.

<details id="add-click-to-get-a-peek-under-the-hood">

### 💡 Expand to get a peek under the hood

`dvc add` moved the data to the project's <abbr>cache</abbr>, and
<abbr>linked</abbr> it back to the <abbr>workspace</abbr>. The `.dvc/cache` will
look like this:

```
.dvc/cache/files/md5
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

<admon type="info">

### Do I have to download my data?

`dvc add` enables you to track and manage files and directories that would be
unmanageable in pure Git, but in some cases even tracking with DVC may be
impractical. For example, if you run Spark-based workflows directly on massive
amounts of data stored in the cloud, you may not want to download and save a
copy of each version. On the next page, you will see tips for how you can still
use DVC's pipelines to
[detect changes to external data](/doc/start/data-management/data-pipelines#external-data-pipelines)
not managed by DVC.

</admon>

## Storing and sharing

You can upload DVC-tracked data to a variety of storage systems (remote or
local) referred to as
["remotes"](/doc/user-guide/data-management/remote-storage). For simplicity, we
will use a "local remote" for this guide, which is just a directory in the local
file system.

### Configuring a remote

Before pushing data to a remote we need to set it up using the `dvc remote add`
command:

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

<admon icon="info">

DVC supports many remote [storage types], including Amazon S3, NFS, SSH, Google
Drive, Azure Blob Storage, and HDFS.

An example for a common use case is configuring an [Amazon S3] remote:

```cli
$ dvc remote add -d storage s3://mybucket/dvcstore
```

For this to work, you'll need an AWS account and credentials set up to allow
access.

To learn more about storage remotes, see the [Remote Storage Guide].

[Amazon S3]: /doc/user-guide/data-management/remote-storage/amazon-s3
[storage types]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types
[Remote Storage Guide]: /doc/user-guide/data-management/remote-storage

</admon>

</details>

### Uploading data

Now that a storage remote was configured, run `dvc push` to upload data:

```cli
$ dvc push
```

<details id="push-click-to-get-a-peek-under-the-hood">

#### 💡 Expand to get a peek under the hood

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

Usually, we would also want to Git track any code changes that led to the data
change ( `git add`, `git commit` and `git push` ).

### Retrieving data

Once DVC-tracked data and models are stored remotely, they can be downloaded
with `dvc pull` when needed (e.g. in other copies of this <abbr>project</abbr>).
Usually, we run it after `git pull` or `git clone`.

Let's try this now:

```cli
$ dvc pull
```

<details>

#### Expand to simulate a "fresh pull"

After running `dvc push` above, the `dvc pull` command afterwards was
short-circuited by DVC for efficiency. The project's `data/data.xml` file, our
<abbr>cache</abbr> and the remote storage were all already in sync. We need to
empty the <abbr>cache</abbr> and delete `data/data.xml` from our project if we
want to have DVC actually moving data around. Let's do that now:

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

Now we can run `dvc pull` to retrieve the data from the remote:

```cli
$ dvc pull
```

</details>

## Making local changes

Next, let's say we obtained more data from some external source. We will
simulate this by doubling the dataset contents:

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

After modifying the data, run `dvc add` again to track the latest version:

```cli
$ dvc add data/data.xml
```

Now we can run `dvc push` to upload the changes to the remote storage, followed
by a `git commit` to track them:

```cli
$ dvc push
$ git commit data/data.xml.dvc -m "Dataset updates"
```

## Switching between versions

A commonly used workflow is to use `git checkout` to switch to a branch or
checkout a specific `.dvc` file revision, followed by a `dvc checkout` to sync
data into your <abbr>workspace</abbr>:

```cli
$ git checkout <...>
$ dvc checkout
```

## Return to a previous version of the dataset

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

<admon type="info">

As you can see, DVC is technically not a version control system by itself! It
manipulates `.dvc` files, whose contents define the data file versions. Git is
already used to version your code, and now it can also version your data
alongside it.

</admon>

### Discovering and accessing data

Your tracked data can be imported and fetched from anywhere using DVC. For
example, you may want to download a specific version of an ML model to a
deployment server or import a dataset into another project like we did at the
[top of this chapter](/doc/start/data-management/data-versioning?tab=Mac-Linux#tracking-data).
To learn about how DVC allows you to do this, see
[Discovering and Accessing Data Guide](/doc/user-guide/data-management/discovering-and-accessing-data).
