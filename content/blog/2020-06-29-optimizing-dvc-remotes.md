---
title: Remote Optimization Improvements in DVC 1.0
date: 2020-06-29
description: |
  An overview of how data synchronization to and from remote storage is optimized in DVC 1.0.
picture: ''
author: peter_rowlands
---

One of the key features provided by DVC is the ability to efficiently
synchronize versioned datasets between a user's local machine and
[remote storage](https://dvc.org/doc/command-reference/remote), and our users
have frequently shown the need for us to optimize this process wherever
possible. In addition to simply being frustrating for a user, slow runtimes for
data synchronization operations will have a negative impact on how quickly new
iterations of an ML project can be made.

![](/uploads/images/2020-06-29/optimization_screenshot.png '=600')

DVC 1.0 includes several performance improvements with regard to how DVC
synchronizes data to and from remotes. In particular, for this release we
focused on optimizing performance in situations where users with must regularly
`dvc push` (relatively) small modifications made to large datasets versioned
with DVC.

Ideally, `dvc status -c` should always be a (relatively) fast operation, and the
time required to complete operations like `dvc push` and `dvc pull` should be
limited by network transfer speeds (and the amount of file data to be
transferred). However, in prior DVC releases, this was not always the case for
repositories containing large numbers (millions or more) of files. In certain
situations, performance was often limited by the number of files in the
repository and remote, rather than by network speed. Even if only a single file
in the repository was modified since it was last pushed to a remote, the next
`dvc status -c` or `dvc push` command would take an unexpectedly long amount of
time to complete.

This post provides an overview of some of the steps taken in DVC 1.0 to optimize
remote performance in these cases.

_Note: When discussing dataset size in this post, we mean size in terms of total
number of files in a dataset, rather than the total amount of file data
(bytes)._

## Data synchronization in DVC 1.0

In order to sync data between a local machine and remote storage, we must first
do the following (equivalent to the `dvc status` command with option `-c`
(`--cloud`)), before data can actually be uploaded or downloaded to or from the
remote:

1. Determine which files are present locally (i.e. in the DVC cache).
2. Determine which files are present in the remote.
3. Determine the difference between the two sets of files.

Once file status has been determined, the necessary files can then be pushed or
pulled to and from the remote.

Commonly used cloud sync utilities, such as [rclone](https://rclone.org/), must
be generalized to support any file structure, which can come at the cost of
performance, especially when dealing with large datasets. In DVC, since we have
control over the structure of both our local cache and our remote storage, we
leverage this structure to optimize this "status" step in all remote storage
operations (i.e. `dvc status -c`, `dvc push`, `dvc pull`, `dvc fetch`). In DVC
version 1.0, these optimizations have significantly improved performance
compared to older versions of DVC and tools like rclone.

![benchmarks](https://raw.githubusercontent.com/gist/pmrowla/338d9645bd05df966f8aba8366cab308/raw/37f64e28e8c2e963aff0d320f6e0cea0724342a5/remote-benchmarks.svg)
_Note: Benchmark details can be found
[here](https://gist.github.com/pmrowla/338d9645bd05df966f8aba8366cab308#benchmarks),
rclone run using default configuration_

## Why status queries are a performance bottleneck

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
files, it would take 1 million API requests. In this case, the overall amount of
time it will take to complete the full operation depends on the total number of
files to be query.

With the second method, it is important to note that cloud APIs will only return
a certain number of files at a time (the amount returned varies depending on the
API), so performance depends on the total number of files - for an API that
returns 1000 files at a time (such as S3), listing a remote containing 1000
files or less would would take a single API request, listing a remote which
contains 1 million files would take 1000 API requests. In this case, the overall
amount of time it will take to complete the full operation depends on the total
number of files in the remote.

The end result is that as a general rule, when querying for a small number of
files, the first method will be faster. When querying for a large number of
files, the second method will be faster (with the added caveat that given a
sufficiently large remote, this no longer applies - if a remote contains
billions of files, it will likely be faster to check 1 million files
individually when compared to retrieving the full remote listing). It should
also be noted that cloud storage APIs generally do not provide a way to retrieve
the number of files stored in the remote, without fetching the entire list of
files.

## Optimization 1: Select the ideal query method

Choosing the ideal method from these two options will have a significant impact
on performance in a data sync operation, and that impact actually extends beyond
runtime. Certain cloud storage platform APIs are rate-limited, and may have some
maximum quota of API calls which can be made over some span of time. They may
also throttle how quickly concsecutive API calls can be made and processed. In
DVC, we must try to avoid hitting these potential limits, while also optimizing
runtime as much as possible.

Consider a case where a dataset being synchronized contains 100 files. Checking
if each file exists in the remote individually would take 100 API calls. If we
know that the API returns 1000 files per page, we can say that if the remote
contains less than `1000 * 100 = 100,000` files, fetching the full remote
listing will be faster than checking each file individually, since it will take
less than 100 API calls to complete. If the remote contains more files than this
`100,000` threshold, it will be faster to check our 100 files individually.

_Note: In terms of real world performance, there are other considerations that
DVC must account for, such as different API calls taking different amounts of
time to complete, and the amount of time it takes to run list comparison
operations in Python._

Generic data sync tools typically rely on the user to provide some hint
regarding their use case, since the sync tool has no way of determining the size
of the remote storage relative to the size of the local dataset. In rclone, the
`--no-traverse` option specifies which behavior should be used. Likewise, in
older versions of DVC, we provided a (now deprecated) `no_traverse` remote
configuration option.

However, it is possible to determine which method would be optimal, as long as
the sync tool can estimate the approximate total size of the remote. In DVC 1.0,
we now estimate the remote size, and automatically determine the optimal query
method whenever a data sync command is run.

## Interlude: DVC cache/remote structure

Before continuing, it will be helpful for the reader to understand a few key
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

- Files versioned by DVC are identified and stored according to their
  [MD5](https://en.wikipedia.org/wiki/MD5) hash. The cache is organized into 256
  subdirectories (from `00` to `ff`), where each subdirectory is the first 2
  characters in an MD5 hash string.
- MD5 is an
  [evenly distributed](https://michiel.buddingh.eu/distribution-of-hash-values)
  hash function, so the DVC cache will be evenly distributed (i.e. given a large
  enough dataset, each cache subdirectory will contain an approximately equal
  number of files)
- DVC remote storage structure mirrors the DVC local cache structure, so a DVC
  remote will also be evenly distributed

## Estimating remote size in DVC 1.0

As discussed ealier, DVC must be able to estimate the size of a remote in order
to select the optimal status query method during data sync operations. In DVC
1.0, we accomplish this by taking advantage of the DVC remote structure. The
over/under remote size threshold only depends on the number of files being
queried (i.e. the number of files in our DVC versioned dataset). And as we have
already established, a DVC remote will be evenly distributed. Therefore, if we
know the number of files contained in a subset of the remote, we can then
estimate the number of files contained in the entire remote.

For example, if we know that the remote subdirectory `00/` contains 10 files, we
can estimate that the remote contains roughly `256 * 10 = 2,560` files in total.
So, by requesting a list of one subdirectory at a time (rather than the full
remote) via the cloud storage API, we can calculate a running estimate of the
total remote size. If the running estimated total size goes over the threshold
value, DVC will stop fetching the contains of the remote subdirectory, and
switch to querying each file in our dataset individually. If DVC reaches the end
of the subdirectory without the estimated size going over the threshold, it will
continue to fetch the full listing for the rest of the remote.

So, by estimating remote size in DVC 1.0, we can ensure that we always use the
optimal method when querying remote status.

## Optimization 2: Reduce the number of files to query

So far, we have focused on optimizing the actual method used when querying
remote status in DVC, but there is another optimization to consider: simply
reducing the number of files to query. We already know the following:

1. For small numbers of files, querying them individually will be faster than
   fetching the full contents of a typical (non-empty) remote.
2. The remote size threshold for choosing the optimal query method is dependent
   on the number of files to query.

It follows that if we can minimize the number of files we need to query in a
data sync operation, we can ensure that the optimal choice will always be the
(faster) individual query method.

In DVC, the number of files which must be queried on the remote is just the
number of DVC-tracked files in a given revision. So, when a user tracks a large
directory with `dvc add`, there will be a correspondingly large number of files
which DVC must query on a remote. However, prior to 1.0, DVC would always need
to query for every file in that directory, regardless of whether or not any of
the files in that directory had changed since the last time it was pushed to a
remote.

Consider a case where a user has an existing DVC-tracked (and pushed) directory
with 1 million files. The user then adds a single new file to the directory with
`dvc add`. We can see that the only file which will be missing from the remote
is the single new file. However, before DVC 1.0, whenever the user runs
`dvc status -c` or `dvc push`, DVC would still need to query whether or not all
1,000,001 files exist in the remote.

DVC 1.0 has been optimized to ensure that we now only query for files which have
not already been pushed to a remote - using the previous example, DVC will only
query for the single new file.

_Note: this optimization only applies to DVC versioned directories. Individually
versioned files (including those added with `dvc add -R`) are not indexed in DVC
1.0_

## Reducing query size via indexes in DVC 1.0

In 1.0, we now keep an index of versioned directories which have been stored in
a remote, as well as the contents of those directories. This essentially means
that DVC will remember which versions of a directory have already been pushed to
a given remote.

From the previous example, when the user runs `dvc status -c` (or `dvc push`) in
version 1.0, the remote index will show that the initial version of the
directory (containing 1 million files) has already been stored in the remote.
DVC also knows that the new version of the directory contains the 1 million
original files, plus one new file. DVC will compare the new version of the
directory to the remote index, and see that only the status of the single new
file needs to be determined.

The rest of the status or push operation will continue normally, but only with
the single new file - significantly reducing the time needed to complete the
operation, compared to older releases of DVC.

DVC 1.0 also accounts for potential complications that could arise when multiple
users share a DVC remote. If one user runs `dvc gc -c` on a remote, all other
users' indexes will be cleared the next time they try to run a data sync
command. _(This will have a negative performance impact when running that
particular command, but also ensures that DVC does not mistakenly assume files
still exist on the remote, when in fact they may have been removed by the first
user's `gc` operation.)_

## Conclusion

DVC performance is an important issue that affects all of our users. We hope
that these new optimizations will provide an improved user experience in DVC
1.0, and look forward to working on further
[performance optimizations](https://github.com/iterative/dvc/labels/performance)
in the future - across all areas in DVC, not just remotes.

As always, if you have any questions, comments or suggestions regarding DVC
performance, please feel free to connect with the DVC community on
[Discourse](https://discuss.dvc.org/), [Discord](https://dvc.org/chat) and
[GitHub](https://github.com/iterative/dvc).
