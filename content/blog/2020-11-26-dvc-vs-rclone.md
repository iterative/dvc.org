---
title: 'Cloud Data Sync Methods and Benchmark: DVC vs Rclone'
date: 2020-11-26
description: |
  DVC 1.0 optimized data synchronization to and from remote storage. Here's
  how we did it.
descriptionLong: |
  Synchronizing data to and from remote storage requires addressing an
  often overlooked performance bottleneck: Determining which files to upload
  and download. Here we'll outline the general methods used to solve this
  problem, and investigate each method's effects on performance by comparing
  benchmark results from DVC and rclone. We'll then conclude with a more
  in-depth explanation of the optimizations made in DVC 1.0 which enabled us
  to outperform both older DVC releases as well as general data sync tools like
  rclone.
commentsUrl: https://discuss.dvc.org/t/cloud-data-sync-methods-and-benchmark-dvc-vs-rclone/562
tags:
  - Rclone
  - Performance
  - Engineering
  - Benchmark
picture: 2020-11-26/header.png
author: peter_rowlands
---

Many general-use tools are available for synchronizing data to and from cloud
storage, some widely used options are [rsync](https://rsync.samba.org/),
[rclone](https://rclone.org/) and
[aws sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html), each
with their own advantages and disadvantages. Likewise, in [DVC](/) we provide
the ability to efficiently sync versioned datasets to and from cloud storage
through a git-like push and pull
[interface](/doc/use-cases/sharing-data-and-model-files).

Given that transferring data over a network to and from cloud storage is an
inherently slow operation, it's important for data sync tools to optimize
performance wherever possible. While the data transfer itself may be the most
apparent performance bottleneck in the data sync process, **here we'll cover a
less obvious performance issue: How to determine which files to upload and
download.**

In this post, we'll outline the general methods used to solve this problem, and
investigate each method's effects on performance by comparing benchmark results
from DVC and rclone. We'll then conclude with a more in-depth explanation of new
optimizations made in DVC 1.0 which enabled us to outperform both older DVC
releases as well as general data sync tools (like rclone).

_Note: "Cloud storage" and "remote storage" will be used interchangeably
throughout this post. When discussing dataset size in this post, we mean size in
terms of total number of files in a dataset, rather than the total amount of
file data (bytes)._

### Outline

- [Why a "trivial" problem has a not-so-trivial performance impact](#why-a-trivial-problem-has-a-not-so-trivial-performance-impact)
- [Real-world numbers - DVC and rclone performance examples](#real-world-numbers---dvc-and-rclone-performance-examples)
- [How DVC 1.0 speeds things up](#how-dvc-10-speeds-things-up)
- [Conclusion](#conclusion)

## Why a "trivial" problem has a not-so-trivial performance impact

At the start of any data sync operation, we must first do the following steps,
in order to determine which files to upload and download between the local
machine and cloud storage:

1. Determine which files are present locally.
2. Query the cloud storage API to determine which files are present in the
   cloud.
3. Compute the difference between the two sets of files.

Once this difference in file status has been determined, the necessary files can
be copied to or from cloud storage as needed ("file status" meaning file
existence as well as other potential status information, such as modification
time). **While this may seem like a trivial problem, the second step is actually
a significant potential performance bottleneck.**

In general, cloud storage APIs provide two possible ways to determine what files
are present in cloud storage, and it's up to the data sync tool to select which
method to use. Even for an operation as simple as synchronizing a single local
file to cloud storage, choosing incorrectly between these two options could
actually mean the difference between that "simple" operation taking several
hours to complete instead of just a few seconds.

_Note: The term "file status query" will be used throughout this post when
referring to this type of cloud storage API query._

### Method 1: Query individual files

The first query method is to individually check whether or not particular files
exist in cloud storage, one at a time.

_Ex: The S3 API provides the `HeadObject` method.`_

When using this method, performance depends on the number of files being
queried - for a single file, it would take a single API request, for 1 million
files, it would take 1 million API requests. In this case, the overall amount of
time it will take to complete the full operation will scale with the number of
files to query.

One particular advantage to using this method is that it can be easily
parallelized. Overall runtime can be improved by making simultaneous API
requests to query for multiple files at once.

### Method 2: Query full remote listing

The second query method is to request the full listing of files present in cloud
storage, all at once.

_Ex: The S3 API provides the `ListObjects` method._

With this method, the overall amount of time it will take to complete the full
operation scales with the total number of files in cloud storage, rather than
the number of files we wish to query.

It's important to note that when using this method, cloud APIs will only return
a certain number of files at a time (the amount returned varies depending on the
API). This means that for an API which returns 1000 files at a time (such as
S3), retrieving the full listing of a remote containing 1000 files or less would
would only take a single API request. Listing a remote which contains 1 million
files would take 1000 API requests.

Another important note is that API calls for this method must be made
sequentially and can't be easily parallelized. Using S3 as an example, the first
API call would return files 0 through 999. The next call would return files 1000
through 1999, and so on. However, the API provides no guarantee of ordering, and
API calls must be made sequentially, until the full list has been retrieved. So
we can't make two simultaneous requests for both "files 1-999" and "files
1000-1999".

### How selecting one method or the other can drastically improve performance

Consider an example scenario where a dataset being synchronized contains 100
local files, and we need to check which of those files exist in cloud storage.
For the purposes of this example, we'll also assume that all individual API
calls take the same amount of time to complete, and that we are not running any
tasks in parallel. Additionally, let's say that our example cloud storage API
returns 1000 files per page when using query method 2.

In this situation, we know that the first query method will always take a fixed
number of API calls to complete (100). The number of API calls required for the
second query method depends on the total number of files that already exist in
the remote.

Since we know that the API returns 1000 results per API call, we can say that if
the remote contains less than `1000 * 100 = 100,000` files, fetching the full
remote listing (method 2) will be faster than checking each file individually,
since it will take less than 100 API calls to complete. In the case that the
remote contains 1000 or less files, method 2 would only require a single API
call (potentially outperforming method 1 by 100x).

However, if the remote contains anything over this 100,000 threshold, method 1
will be faster than method 2, with the difference in performance between the two
methods scaling linearly as the potential remote size increases.

**Total API calls required to query 100 local files from S3**
![API calls](/uploads/images/2020-11-26/api_calls_100_local.svg 'API calls required to query 100 local files from S3')

This example illustrates an important point. Given a (relatively) small set of
files to query and a sufficiently large remote, method 1 will always be faster
than method 2.

Thinking about it from a different perspective, what happens if we have the
ability to reduce the size of a (relatively) large query set?

Once our query set is smaller than a certain threshold, we'll be able to use
method 1 rather than method 2. On top of that, we know that the runtime of
method 1 scales with query set size. **In simple terms, by reducing the size of
our query set as much as possible, we can also improve performance.**

So, as we have shown, choosing the optimal method depends on both:

- The number of files that we need to query.
- The total number of files in the remote.

_Note: In terms of real world performance, there are other considerations that
DVC must account for, such as different API calls taking different amounts of
time to complete, parallelization, and the amount of time it takes to run list
comparison operations in Python._

## Real-world numbers - DVC and rclone performance examples

Now let's take a look at some real-world numbers to examine the impact selecting
one query method or the other has on data sync performance in DVC and rclone.
Both tools can utilize either potential query method, with some differences:

- In rclone, the user can specify the `--no-traverse` option to select the first
  query method, otherwise rclone will default to the second method in most
  situations (with the exception being cases with very small query set sizes).
- In DVC prior to 1.0, the first query method would be used by default for all
  supported cloud storage platforms except Google Drive, and the user could
  specify one method or the other via the `no_traverse` configuration option.
- **In DVC 1.0 and later, the optimal query method is selected automatically.**

In the following scenarios, we are simulating the typical DVC use case in which
a user tracks a local directory containing some number of files using DVC, and
then synchronizes the DVC-tracked directory to cloud storage (S3 in these
examples) using either DVC or rclone. The user would then continually repeat a
process of:

1. Modify a small subset of files in the directory.
2. Push the updated version of the directory into cloud storage.

Keep in mind that for DVC's purposes, we are most interested in optimizing
performance for scenarios which are normally very slow to complete. If you
consider an operation which previously took several hours to complete, improving
that runtime down to a few minutes will have a much greater impact for our users
versus shaving a few seconds off of an operation which previously took under a
minute to run.

_Note: For these benchmarks we are only interested in the amount of time
required to determine file status for this one-way push operation. So the
runtimes in each case are for status queries only (using `dvc status -c` in DVC
and `rclone copy --dry-run` in rclone). No file data was transferred to or from
S3 in any of these scenarios._

_Benchmark command usage:_

```dvc
$ time dvc status -c -r remote
$ time rclone copy --dry-run --progress --exclude "**/**.unpacked/" .dvc/cache remote:...
```

_rclone run with `--no-traverse` where indicated_

_Benchmark platform: Python 3.7, MacOS Catalina, DVC installed from pip,
dual-core 3.1GHz i7 cpu_

**Local directory w/100k total files, S3 bucket w/1M total files (1 file
modified since last sync)**
![benchmarks](/uploads/images/2020-11-26/dvc_rclone_bench.svg 'DVC 1.0 vs rclone performance comparison')

The previous chart contains benchmarks for a scenario in which the local
directory contains 100,000 files, and the S3 bucket contains approximately 1
million files. One file in the local directory has been modified since the
directory was last synchronized with the S3 bucket. This scenario tests the
length of time it takes DVC or rclone to determine (and report to the user) that
only the one modified file is missing from the S3 bucket and needs to be
uploaded.

This illustrates DVC's performance advantage over rclone with regard to
synchronizing iterations of a versioned dataset over time, as well as the DVC
1.0 performance improvements over prior releases.

_Note: In these examples, the local file count refers to the number of files
inside the original tracked directory. The number of files present in the DVC
cache will differ slightly, since the DVC cache will contain an additional file
representing the tracked directory itself, but the end result is that both DVC
and rclone will both need to query for the same number of files (i.e. the number
of files in the cache directory)._

**Local directory w/1 file, S3 bucket w/1M total files**
![benchmarks](/uploads/images/2020-11-26/dvc_rclone_bench2.svg 'DVC 1.0 vs rclone performance comparison')

In this example, we are testing a simple scenario in which the local directory
contains 1 file and the S3 bucket contains approximately 1 million files.

In this case, in DVC 0.91 we essentially get lucky that our default choice for
S3 happens to be the first query method. If we ran this same scenario with a
Google Drive remote (where the 0.91 default choice is the second query method)
instead of S3, we would see a very long runtime for DVC 0.91.

Also note that here, rclone is able to determine that with a single local file
to query, it should use the first query method instead of defaulting to the
second method.

_Note: We are unsure of the reason for the rclone runtime difference with and
without `--no-traverse` for this scenario, but rclone does do some computation
to determine whether or not to default to `no-traverse` behavior for small query
sets. It's likely that specifying `--no-traverse` allows rclone to skip that
overhead entirely in this case._

**Local directory w/1M files, Empty S3 bucket**
![benchmarks](/uploads/images/2020-11-26/dvc_rclone_bench3.svg 'DVC 1.0 vs rclone performance comparison')
_Note: DVC 0.91 and rclone with `--no-traverse` both take multiple hours to
complete in this scenario and continue off of the chart._

In this example, we are testing a simple scenario in which the local directory
contains approximately 1 million files and the S3 bucket is empty.

The difference in rclone runtime with or without `--no-traverse` in this
scenario shows the performance impact of selecting the optimal query method for
a given situation.

This scenario also shows that rclone can outperform DVC with regard to
collecting the list of local files during certain types of sync operations. In
this case, rclone simply iterates over whatever files exist in the local
directory without doing any additional steps, since our benchmark uses a one-way
`rclone copy` operation.

However, in DVC, we have some extra overhead for this step, since we collect the
list of files expected to be present in the current DVC repository revision, and
then verify that those files are present locally. We would then check to see if
any missing files are available to be downloaded from remote storage.

It should also be noted that in common use cases where the number of files in
cloud storage continues to grow over time (such as in backup solutions or in
dataset versioning), rclone's advantage in this case would only apply for this
initial sync operation. Once the local dataset has been pushed to cloud storage,
DVC's advantage in synchronizing modifications to existing datasets would become
more apparent (as shown in the first example).

## How DVC 1.0 speeds things up

So I hope that by now you're curious about DVC, and are planning on using (or
maybe even already are using 😀) it to sync your files. For those who are
wondering where the magic actually happens, let's dive a bit deeper into how DVC
stores files, and how we were able to leverage that storage format to implement
query performance optimzations in DVC 1.0. (This will also be a useful primer
for anyone interested in learning about DVC internals in general.)

Previously, we have established that:

- Selecting the right query method will have a significant performance impact.
- Reducing the number of files to query will improve performance.

In this section, we'll cover the ways in which DVC 1.0 has directly addressed
both of these key points:

- Automatically selecting the optimal query method for any given sync operation.
- Indexing cloud storage remotes to eliminate the need to query for already
  synchronized files.

### DVC storage structure

Before continuing, it will be helpful for the reader to understand a few things
about the DVC cache and remote storage structure.

```
.
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

_Example DVC cache/remote structure_

- Files versioned by DVC are identified and stored in subdirectories according
  to their [MD5](https://en.wikipedia.org/wiki/MD5) hash (i.e.
  [content addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage)).
- MD5 is an
  [evenly distributed](https://michiel.buddingh.eu/distribution-of-hash-values)
  hash function, so the DVC cache (and DVC remote storage) will be evenly
  distributed (i.e. given a large enough dataset, each remote subdirectory will
  contain an approximately equal number of files)

### How DVC 1.0 automatically selects a query method

In DVC, the number of files we need to query is just the number of files for a
given project revision. So, as long as we can estimate the number of files in a
DVC remote, we can programmatically choose the optimal query method for a remote
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

### How DVC 1.0 uses indices to reduce the number of files to query

A common DVC use case is
[versioning](/doc/use-cases/versioning-data-and-model-files) the contents of a
large directory. As the contents of the directory changes over time, DVC will be
used to push each updated version of the directory into cloud storage. In many
cases, only a small number of files within that directory will be modified
between project iterations.

So after the first version of a project is pushed into cloud storage, for
subsequent versions, only the small subset of changed files actually needs to be
synchronized with cloud storage.

Consider a case where a user has an existing directory with 1 million files
which has been versioned and pushed to a remote with DVC. In the next iteration
of the project, only a single file in the directory has been modified. We can
obviously see that everything other than the one modified file will already
exist in cloud storage. Ideally, we should only need to query for the single
modified file.

However, in DVC releases prior to 1.0, DVC would always need to query for every
file in the directory, regardless of whether or not a given file had changed
since the last time it was pushed to remote storage.

But in DVC 1.0, we now keep an index of directories which have already been
versioned and pushed into remote storage. By referencing this index, DVC will
"remember" which files already exist in a remote, and will remove them from our
query set at the start of a data sync operation (before we choose a query
method, and before we make any cloud storage API requests).

_Note: This optimization only applies to DVC versioned directories. Individually
versioned files (including those added with `dvc add -R`) are not indexed in DVC
1.0, and will always be queried during remote operations._

## Conclusion

By utilizing a storage structure that allows for optimized status queries, DVC
makes data synchronization incredibly fast. Coupled with the ability to quickly
identify which files remain unchanged between sync operations, DVC 1.0 is a
powerful data management tool.

Whether you are upgrading from a prior DVC release, or trying DVC for the first
time, we hope that all of our users are able to benefit from these new
optimizations. DVC performance is an important issue, and our team is looking
forward to working on further
[performance optimizations](https://github.com/iterative/dvc/labels/performance)
in the future - across all areas in DVC, not just remotes.

As always, if you have any questions, comments or suggestions regarding DVC
performance, please feel free to connect with the DVC community on
[Discourse](https://discuss.dvc.org/), [Discord](https://dvc.org/chat) and
[GitHub](https://github.com/iterative/dvc).
