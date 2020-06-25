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

_Note: When discussing dataset size in this post, we mean size in terms of total
number of files in a dataset, rather than the total amount of file data
(bytes)._

## Why data synchronization matters

Working with ML projects requires handling large amounts of data. A typical DVC
repository may contain millions of files or more, and that's just in one
revision. As new iterations or experiments are added to the project, the amount
of files DVC must version will continue to multiply.

In order to handle this much data, ML projects often rely on cloud storage to
solve some common data-management related problems:

- Local storage space my be limited.
- Multiple collaborators all require shared access to the project data.
- Projects must be backed up to the cloud to protect against data loss.

Using cloud storage will require some solution for synchronizing data between
the cloud and a user's local machine. Many general-use tools are available for
synchronizing data to and from cloud storage, some widely used options are
[rsync](https://rsync.samba.org/), [rclone](https://rclone.org/) and
[aws sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html), each
with their own advantages and disadvantages. Likewise, DVC provides a solution
geared specifically towards effectively handling
[data-management scenarios](/doc/use-cases) common to ML projects.

Regardless of use case, any data sync tool must solve one particular issue:

**Determining which files to upload or download during a sync operation.**

While this may seem like a simple problem, it often represents a significant
performance bottleneck for data synchronization. Because of this particular
problem, a specialized tool like DVC can provide substantial performance
benefits over general solutions for ML projects. And in fact, DVC 1.0 offers
improved runtimes over rclone by 20x or more in certain scenarios.

### DVC 1.0 vs DVC 0.91 vs rclone performance

![benchmarks](https://raw.githubusercontent.com/gist/pmrowla/338d9645bd05df966f8aba8366cab308/raw/37f64e28e8c2e963aff0d320f6e0cea0724342a5/remote-benchmarks.svg 'DVC 1.0 performance comparison')
_Note: Benchmark details can be found
[here](https://gist.github.com/pmrowla/338d9645bd05df966f8aba8366cab308#benchmarks)
(rclone run with default configuration)._

## How to determine which files to sync

In order to sync data between a local machine and remote storage, we must first
do the following (equivalent to the `dvc status` command with option `-c`
(`--cloud`)), before data can actually be uploaded or downloaded to or from the
remote:

1. Determine which files are present locally (i.e. in the DVC cache).
2. Query the cloud storage API to determine which files are present in the cloud
   (i.e. in the DVC remote).
3. Compute the difference between the two sets of files.

Once file status has been determined, the necessary files can then be copied to
or from cloud storage (in DVC this is equivalent to the data transfer during
`dvc push`, `dvc pull` or `dvc fetch`).

Between these data sync "status" steps, the approach taken to complete #2 -
_Determine which files are present in the remote_ - will have a substantial
impact on the overall runtime for a data sync operation.

## Why cloud status queries affect performance

When querying file status from a remote, we are limited by cloud storage APIs.
In general, cloud storage APIs provide two possible ways to determine what files
are present:

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

Choosing the ideal method from these two options will have a significant impact
on performance in a data sync operation. Consider a basic example, where it
takes one second to query for a single individual file in an S3 bucket (using
the first query method). For the same S3 bucket, it takes one hour to iterate
over the full list of files in the bucket (using the second query method).

If we only need to push one new file into the bucket, we obviously want to use
the first method. If our data sync tool incorrectly uses the second method, it
will cost us a huge hit to performance.

## How to select the optimal query method

In general, when querying for a small number of files, the first method will be
faster. When querying for a large number of files, the second method will be
faster. However, this is not a hard rule, especially in the case of very large
remotes.

If a remote contains billions of files, it will likely be faster to check 1
million files individually when compared to retrieving the full remote listing.
It should also be noted that cloud storage APIs generally do not provide a way
to retrieve the number of files stored in the remote, without fetching the
entire list of files.

Consider a case where a dataset being synchronized contains 100 files. Checking
if each file exists in the remote individually would take 100 API calls. If we
know that the API returns 1000 files per page, we can say that if the remote
contains less than `1000 * 100 = 100,000` files, fetching the full remote
listing will be faster than checking each file individually, since it will take
less than 100 API calls to complete. If the remote contains more files than this
`100,000` threshold, it will be faster to check our 100 files individually.

So, choosing the optimal method actually depends on both:

- The number of files that we need to query.
- The total number of files in the remote.

_Note: In terms of real world performance, there are other considerations that
DVC must account for, such as different API calls taking different amounts of
time to complete, and the amount of time it takes to run list comparison
operations in Python._

## DVC's advantage over general-use tools

Tools like rclone, must be generalized to support any file structure (both
locally and in cloud storage), which can come at the cost of performance,
especially when dealing with large datasets. A generic tool has no way of
determining which of the two previously described methods would be optimal for a
given sync operation. These tools must either rely on the user to choose the
correct method, or simply fall back to a default choice.

For example, in rclone the `--no-traverse` option specifies which behavior
should be used. Similarly, in older versions of DVC, we provided a (now
deprecated) `no_traverse` remote configuration option. However, even in the
event that a user has a clear understanding of this problem, and when to
properly use the `no_traverse` option, this was still not an ideal solution.

For ML projects, this means that neither method can be configured as a
one-size-fits-all solution. The number of files to query may very wildly between
project revisions, and the number of files in the remote will continually grow
over time, as new iterations are pushed into cloud storage. As a result,
selecting the optimal query method cannot be hard coded via a configuration
option, and must really be chosen per each sync operation.

However, DVC is a specialized tool specifically designed for ML projects. This
means that we can leverage certain aspects of DVC, in order to provide status
query optimizations that are simply unavailable to general-use tools - and in
DVC 1.0, we do just that.

## Data synchronization in DVC 1.0

In DVC, status queries are performed during all cloud remote related commands.
`dvc status -c` simply queries and outputs file status, without performing any
actual file transfer to or from a remote. `dvc push`, `dvc pull` and `dvc fetch`
query file status, and then perform the actual network file transfer.

Ideally, `dvc status -c` should always be a (relatively) fast operation, and the
time required to complete operations like `dvc push` and `dvc pull` should be
limited by network transfer speeds (and the amount of file data to be
transferred). However, in prior DVC releases, this was not always the case.

By default, the status query method was hard coded depending on cloud storage
type (but was user-configurable via the `no_traverse` option). This meant that
in many cases, DVC would not use the optimal query method during data sync
operations.

Additionally, in certain situations, users may have found that performance was
often unexpectedly limited by the number of files in the repository and remote,
rather than by network speed. This was especially noticable for DVC repositories
containing large numbers (millions or more) of files.

In DVC 1.0, we have optimized remote status queries in order to address these
issues, and these optimizations are possible as because of one key point:

**In DVC, we have control over the structure of both our local cache and our
remote storage.**

## Interlude: DVC cache/remote structure

Before continuing, it will be helpful for the reader to understand a few things
about the DVC cache and remote storage structure.

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

## Optimization 1: Select the ideal status query method

As we established earlier, choosing the optimal query method depends on the
number of files being queried, and the number of files in a remote. In DVC, the
number of files to query for a remote operation is just the number of files for
a given repository revision. So, as long as we can estimate the number of files
in a DVC remote, we can also choose the optimal query method for a remote
operation.

In DVC 1.0, we accomplish this by taking advantage of the DVC remote structure.
The over/under remote size threshold only depends on the number of files being
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

By estimating remote size in DVC 1.0, we can ensure that we always use the
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
