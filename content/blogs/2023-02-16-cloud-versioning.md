---
title: 'Organize Your Storage with DVC Cloud Versioning'
date: 2023-02-22
description: |
  DVC cloud versioning makes it easy to take full advantage of your cloud
  provider’s built-in versioning capabilities.
descriptionLong: |
  Major cloud providers (AWS, Azure, Google) all have versioning capabilities,
  but they only version individual files. DVC can help you track the cloud
  version IDs across many files for all the datasets and models in your project.
picture: 2023-02-22/cloud-versioning-cover.jpg
pictureComment:
commentsUrl: https://discuss.dvc.org/t/dvc-cloud-versioning-blog-post/1530
authors:
  - dave_berenbaum
tags:
  - Cloud Versioning
  - DVC
  - Cloud
  - AWS
  - Azure
  - Google Cloud
  - Release
---

If you use cloud storage regularly, you have probably seen it become a mess like
this S3 bucket:

![](../uploads/images/2023-02-22/no_versions.png)

Luckily, major cloud storage providers can version files automatically. Still,
even with versioning enabled, you might find you end up with a mess. More
importantly, you forget which version is which.

That's because versioning happens at the file level. There's no way to version a
composite dataset or entire machine learning project. This is where DVC can
supplement cloud versioning and finally let you clean up your cloud storage. DVC
records the versions of all the files in your dataset, so you have a complete
snapshot of each point in time. You can store this record in Git alongside the
rest of your project and use it to recover the data from that time, giving you
the freedom to keep adding new data in place without fear of losing track of the
old data. DVC ensures reproducibility while keeping everything organized between
your Git repo and cloud storage, so you can focus on iterating on your machine
learning project.

<admon type="info">

If you already use DVC, you might be familiar with data versioning and want to
know what DVC cloud versioning means for you. Read the next section to get more
familiar with cloud versioning generally or skip directly to the section
[for existing DVC users](#for-existing-dvc-users).

</admon>

# How cloud versioning works

With versioning enabled, whenever you save a file to the cloud, it will get a
unique version ID. When you overwrite (or even delete) a file, the previous
version remains accessible by referencing its version ID.

Here's the same data from above organized with cloud versioning:

![](../uploads/images/2023-02-22/show_versions.png) _Overwritten and deleted
files may be recovered using their version IDs._

And here it is showing only the current versions:

![](../uploads/images/2023-02-22/collapsed_versions.png) _Enabling versioning
can keep your cloud storage organized by collapsing file versions._

Now the model versions are all collapsed under one file name and ordered by
time, but what about the `predictions` folder? Let's assume this project trains
a neural machine translation model, and each file in `predictions` is a
predicted translation of a sentence. Each model iteration generates a new set of
predictions. How can we reassemble the predictions from an earlier model
version?

![](../uploads/images/2023-02-22/dir_versions.png) _For a folder of many files,
keeping track of versions becomes unrealistic._

# How DVC works with cloud versioning

Cloud versioning falls short for tracking and syncing folders and projects, but
this is where DVC can help. DVC records the version IDs of all files in your
dataset or project. You keep this record in a Git repository so you can maintain
snapshots of your cloud-versioned data (the data itself gets stored on the
cloud, not in Git).

![](../uploads/images/2023-02-22/dir_versions_dvc.png) _DVC connects multiple
version IDs across a folder or project._

<admon type="tip">

Before you start with DVC, ensure that your cloud storage is configured
correctly. Cloud versioning must be enabled at the bucket or storage account
level. See [Quickstart](#quickstart) for instructions below if versioning is not
already enabled. You also need write access to the cloud storage (more info on
how to configure your storage
[here](https://dvc.org/doc/user-guide/data-management/remote-storage)).

</admon>

To start using cloud versioning in DVC, [install](https://dvc.org/doc/install)
DVC and set up a `version_aware` remote inside a Git repo. A remote is the cloud
storage location where you want to sync the data, and `version_aware` tells DVC
to use cloud versioning.

```dvc
$ dvc init

$ dvc remote add --default myremote s3://cloud-versioned-bucket/path

$ dvc remote modify myremote version_aware true
```

Use `dvc add` to start tracking your model and predictions and `dvc push` to
sync it to the cloud.

```dvc
$ dvc add model.pt predictions

$ dvc push
11 files pushed
```

<admon type="tip">

If you want to start tracking changes to an existing cloud dataset instead of
starting from a local copy, see
[dvc import-url --version-aware](https://dvc.org/doc/command-reference/import-url#example-tracking-cloud-version-ids).

</admon>

DVC adds `model.pt.dvc` and `predictions.dvc` files with the version ID (and
other metadata) of each file.

```yaml
outs:
  - path: predictions
    files:
      - relpath: 0.txt
        md5: f163358b0b2b89281d6990e82495d6ca
        size: 154
        cloud:
          myremote:
            etag: f163358b0b2b89281d6990e82495d6ca
            version_id: UkLM3za5T8oH6.EeZCqOrFNBvUnrAlT7
      - relpath: 1.txt
        md5: ec736fcb3b92886399f3577eac2163bb
        size: 154
        cloud:
          myremote:
            etag: ec736fcb3b92886399f3577eac2163bb
            version_id: fE4Fst2Z25sYEjaJo_0mXZzWDT6vQ4Uz
```

Next, track `model.pt.dvc` and `predictions.dvc` in Git.

```dvc
$ git add model.pt.dvc predictions.dvc .gitignore

$ git commit -m "added and pushed model and predictions"
```

<admon type="tip">

DVC will also make Git ignore `model.pt` and the `predictions` folder so that
Git only tracks the metadata. For more info on the mechanics of how DVC works,
see
[Versioning Data and Models](https://dvc.org/doc/use-cases/versioning-data-and-models).

</admon>

Now there is a versioned record of the model and predictions in Git commits, and
we can revert to any of them without having to manually track version IDs. If
someone else clones the Git repo, they can pull the exact versions pushed with
that commit, even if those have been overwritten in cloud storage.

```dvc
$ git clone git@github.com:iterative/myrepo

$ cd myrepo

$ dvc pull
A       predictions/
A       model.pt
2 files added and 11 files fetched
```

# For existing DVC users

If you have versioning enabled on your cloud storage (or can enable it), you may
wish to start using `version_aware` remotes to simplify the structure of your
remote (or so you don't have to explain that structure to your colleagues). A
`version_aware` remote is similar to the remotes you already use, except easier
to read.

A traditional cache-like DVC remote looks like:

![](../uploads/images/2023-02-22/remote_cache.png)

A cloud-versioned remote looks like:

![](../uploads/images/2023-02-22/remote_cloud_versioned.png)

The other difference is that version IDs get added to the
[DVC metafiles](https://dvc.org/doc/user-guide/project-structure) during
`dvc push`.

```yaml
outs:
  - path: predictions
    files:
      - relpath: 0.txt
        md5: f163358b0b2b89281d6990e82495d6ca
        size: 154
        cloud:
          myremote:
            etag: f163358b0b2b89281d6990e82495d6ca
            version_id: UkLM3za5T8oH6.EeZCqOrFNBvUnrAlT7
      - relpath: 1.txt
        md5: ec736fcb3b92886399f3577eac2163bb
        size: 154
        cloud:
          myremote:
            etag: ec736fcb3b92886399f3577eac2163bb
            version_id: fE4Fst2Z25sYEjaJo_0mXZzWDT6vQ4Uz
```

This means you need to be more careful about the order in which you `dvc push`
and `git commit`. You should first `dvc push` and then `git commit` since
pushing will modify the DVC metafiles. This might seem odd, but it means you
have a record in Git of what was pushed, so there is no more guessing whether
you remembered to push.

# Quickstart

You can start with DVC cloud versioning in 3 steps:

**1\. Check whether cloud versioning is enabled for your bucket/storage account,
and enable it if it's not.**

- [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html)
- [Azure Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-enable)
- [Google Cloud Storage](https://cloud.google.com/storage/docs/using-object-versioning)

**2\. Setup DVC to use that bucket/container as cloud-versioned remote
storage.**

```dvc
$ dvc init

$ dvc remote add --default myremote s3://cloud-versioned-bucket/path

$ dvc remote modify myremote version_aware true
```

**3\. Add and then push data.**

```dvc
$ dvc add model.pt predictions

$ dvc push
```

---

Stop messing around with backing up your cloud data! With cloud versioning in
DVC, you can iterate on your data as much as you want without losing track of
your changes or worrying about your storage growing into an unmanageable mess.

Special thanks to [Peter Rowlands](https://github.com/pmrowla) for leading the
development of this new capability!
