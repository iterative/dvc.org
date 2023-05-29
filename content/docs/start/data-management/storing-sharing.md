---
title: 'Get Started: Storing and Sharing'
description:
  'Configure remote data storage locations, pull and push data between your
  workspace and those remote storage systems.'
---

# Get Started: Storing and Sharing

You can upload DVC-tracked data to a variety of storage systems (remote or
local) referred to as
["remotes"](/doc/user-guide/data-management/remote-storage). For simplicity, we
will use a "local remote" for this guide, which is just a directory in the local
file system.

## Configuring a remote

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

DVC supports many remote [storage types], including Amazon S3, NFS,SSH, Google
Drive, Azure Blob Storage, and HDFS.

<admon icon="info">

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

## Uploading data

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

Let's commit the DVC configuration changes to Git now:

```cli
$ git add .dvc/config
$ git commit -m "configuring dvc storage"
```

Usually, we would also want to Git track any code changes that led to the data
change (using Git).

## Retrieving data

Once DVC-tracked data and models are stored remotely, they can be downloaded
with `dvc pull` when needed (e.g. in other copies of this <abbr>project</abbr>).
Usually, we run it after `git pull` or `git clone`.

Let's try this now:

```cli
$ dvc pull
```

You will see the message:

```cli
Everything is up to date.
```

Since indeed, nothing changed locally.

## A "fresh pull"

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

Now we can run `dvc pull` to retrieve the data from the remote. We'll see data
was fetched this time around:

```cli
$ dvc pull
A       data/data.xml
1 file added and 1 file fetched
```
