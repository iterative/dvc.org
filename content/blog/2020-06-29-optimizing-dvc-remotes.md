---
title: Optimization Improvements in DVC 1.0
date: 2020-06-29
description: |
  An overview of how data synchronization to and from remote storage is optimized in DVC 1.0.
author: peter_rowlands
---

One of the key features provided by DVC is the ability to efficiently sync
versioned datasets between a user's local machine and
[remote storage](https://dvc.org/doc/command-reference/remote), and version 1.0
includes several performance optimizations related to synchronizing data with
remotes. This post provides an overview of some of the ways in which remote
performance has been optimized in DVC.

In order to sync data between a local machine and remote storage, we must first
do the following (equivalent to the `dvc status` command with option `-c`
(`--cloud`)), before data can actually be uploaded or downloaded to or from the
remote:

1. Determine which files are present locally (i.e. in the DVC cache).
2. Determine which files are present in the remote.
3. Determine the difference between the two sets of files.

Commonly used cloud sync utilities, such as [rclone](https://rclone.org/), must
be generalized to support any file structure, which can come at the cost of
performance, especially when dealing with large datasets. In DVC, since we have
control over the structure of both our local cache and our remote storage, we
leverage this structure to optimize this "status" step in all remote storage
operations (i.e. `dvc status -c`, `dvc push`, `dvc pull`, `dvc fetch`). In DVC
version 1.0, these optimizations have significantly improved performance
compared to older versions of DVC and tools like rclone.

![benchmarks](https://raw.githubusercontent.com/gist/pmrowla/338d9645bd05df966f8aba8366cab308/raw/37f64e28e8c2e963aff0d320f6e0cea0724342a5/remote-benchmarks.svg)
_Note: benchmark details can be found
[here](https://gist.github.com/pmrowla/338d9645bd05df966f8aba8366cab308#benchmarks),
rclone run using default configuration_

## DVC cache/remote structure

Before continuing, it will be helpful for the reader to keep in mind a few key
points about the DVC cache and remote storage structure.

```
.dvc/cache
├── 00
│   ├── 411460f7c92d2124a67ea0f4cb5f85
│   ├── 6f52e9102a8d3be2fe5614f42ba989
│   └── ...
├── 01
├── 02
├── 03
├── ...
└── ff
```

_Example DVC cache_

- Files versioned by DVC are identified and stored according to their MD5 hash.
  The cache is organized into 256 subdirectories (from `00` to `ff`), where each
  subdirectory is the first 2 characters in an MD5 hash string.
- MD5 is an evenly distributed hash function, so the DVC cache will be evenly
  distributed (i.e. given a large enough dataset, each cache subdirectory will
  contain an approximately equal number of files)
- DVC remote storage structure mirrors the DVC local cache structure, so a DVC
  remote will also be evenly distributed

## Optimizing remote status queries

From the previously mentioned data sync "status" steps, #2 ("Determine which
files are present in the remote") typically presents the largest bottleneck in
DVC, since we are limited by cloud storage APIs. In general, cloud storage APIs
provide two possible ways to determine what files are present in a remote:

1. Directly query whether or not a specific file exists in the remote
2. Request the complete list of all files contained in the remote (and then
   compare that list with the list of files we are searching for)

_(For example, the S3 API provides the `HeadObject` and `ListObjects` methods,
respectively)_

When using the first method, performance depends on the number of files being
queried - for a single file, it would take a single API request, for 1 million
files, it would take 1 million API requests. With the second method, it is
important to note that cloud APIs will only return a certain number of files at
a time (the amount returned varies depending on the API), so performance depends
on the total number of files - for an API that returns 1000 files at a time
(such as S3), listing a remote containing 1000 files or less would would take a
single API request, listing a remote which contains 1 million files would take
1000 API requests.

The end result is that as a general rule, when querying for a small number of
files, the first method will be faster. When querying for a large number of
files, the second method will be faster (with the added caveat that given a
sufficiently large remote, this no longer applies - if a remote contains
billions of files, it will likely be faster to check 1 million files
individually when compared to retrieving the full remote listing). It should
also be noted that cloud storage APIs generally do not provide a way to retrieve
the number of files stored in the remote, without fetching the entire list of
files.

Choosing the ideal method from these two options will have a significant impact
on performance in a data sync operation. Generic data sync tools typically rely
on the user to provide some hint regarding their use case, since the sync tool
has no way of determining the size of the remote storage relative to the size of
the local dataset. In rclone, the `--no-traverse` option specifies which
behavior should be used. In older versions of DVC, we provided a (now
deprecated) `no_traverse` remote configuration option. However, it is possible
to automatically determine which method would be optimal, as long as the sync
tool can estimate the approximate total size of the remote.

Consider a case where a dataset being synced contains 100 files. Checking if
each file exists in the remote individually would take 100 API calls. If we know
that the API returns 1000 files per page, we can say that if the remote contains
less than `1000 * 100 = 100,000` files, fetching the full remote listing will be
faster than checking each file individually, since it will take less than 100
API calls to complete. If the remote contains more files than this `100,000`
threshold, it will be faster to check our 100 files individually. _(In terms of
real world performance, there are other considerations that apply, such as
different API calls taking different amounts of time to complete, and the amount
of time it takes to run list comparison operations.)_

In DVC 1.0, we take advantage of the DVC remote structure to estimate the remote
size, and automatically determine which method to use when running data sync
related commands. The over/under remote size threshold is only dependent on the
number of files being queried (i.e. the number of files in our DVC versioned
dataset). And as we established earlier, a DVC remote will be evenly
distributed. Therefore, if we know the number of files in a subset of the
remote, we can estimate the number of files contained in the entire remote.

For example, if we know that the remote subdirectory `00/` contains 10 files, we
can estimate that the remote contains roughly `256 * 10 = 2,560` files in total.
So, by requesting a list of one subdirectory at a time (rather than the full
remote) via the cloud storage API, we can calculate a running estimate of the
total remote size. If the running estimated total size goes over the threshold
value, DVC will stop fetching the contains of the remote subdirectory, and
switch to querying each file in our dataset individually. If DVC reaches the end
of the subdirectory without the estimated size going over the threshold, it will
continue to fetch the full listing for the rest of the remote.

## Indexing versioned directories

A common use case in DVC is in which a user has a large directory versioned with
`dvc add`. After `dvc push`ing one version of the dataset, smaller portions of
that dataset will be updated, whether through adding some new files, or
modifying a subset of existing files. In older versions of DVC, running
`dvc status -c` with the new version of the dataset (or by extension trying to
push the updated dataset) could potentially be a very slow operation. Prior to
version 1.0, DVC would check for the existence of every file in a dataset
against the remote, regardless of whether or not a file had changed since the
last pushed version of the dataset. So for a directory containing 1 million
files, even if only 1 file was added or modified between versions, all 1 million
files would be checked when querying for the remote status.

In DVC 1.0, we now keep an index of versioned directories which have been stored
in a remote, as well as the contents of those directories. Using the previous
example, when the user runs `dvc status -c` (or `dvc push`) in version 1.0, DVC
will now only have to check whether or not the one newly modified file exists in
the remote, since the previous version of the directory will have already been
indexed. The same will still apply regardless of the number of modified files -
in DVC 1.0 for versioned directories, DVC will only need to check for the
modified files in a remote. And by reducing the number of files which have to be
queried for a given data sync operation, the amount of time it takes to run the
steps outlined in the previous section of this post will be signficantly
reduced.

_Note that this optimization only applies to DVC versioned directories.
Individually versioned files (including those added with `dvc add -R`) are not
indexed in DVC 1.0)_
