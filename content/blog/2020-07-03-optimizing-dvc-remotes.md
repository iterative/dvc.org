---
title: Remote Optimization Improvements in DVC 1.0
date: 2020-07-03
description: |
  An overview of how data synchronization to and from remote storage is optimized in DVC 1.0.
picture: ''
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

Regardless of use case, any data sync tool must solve one particular issue:

**Determining which files to upload or download during a sync operation.**

In order to sync data between a local machine and remote storage, we must do the
following:

1. Determine which files are present locally.
2. Query the cloud storage API to determine which files are present in the
   cloud.
3. Compute the difference between the two sets of files.

Once this file status has been determined, the necessary files can then be
copied to or from cloud storage. Files which have been added or modified locally
must be uploaded. Likewise, files which have been modified or added in cloud
storage must be downloaded.

While this may seem like a simple problem, it actually represents a significant
performance bottleneck for data synchronization, particularly because of step
#2. When querying a cloud storage API, a data sync tool must make some number of
API calls which will scale relative to the total number of files in both local
and cloud storage. For large datasets, this can translate into a significant
amount of runtime which must be spent on these status queries.

However, with new optimizations in DVC 1.0, we are now able to work around these
limitations and provide substantial performance benefits over older DVC releases
and general data sync tools. In fact, DVC 1.0 offers improved runtimes over
rclone by 20x or more in certain scenarios.

In this post, we will outline the general methods used to query file status from
cloud storage, and investigate their effects on performance by comparing
benchmark results from DVC and rclone. We will then conclude further explanation
of how we were able to implement certain optimizations in DVC 1.0.

_Note: "Cloud storage" and "remote storage" will be used interchangeably
throughout this post. When discussing dataset size in this post, we mean size in
terms of total number of files in a dataset, rather than the total amount of
file data (bytes)._

## How we query file status via cloud storage APIs

When querying file status from a remote, we are limited to the methods provided
by cloud storage APIs. In general, cloud storage APIs provide two possible ways
to determine what files are present:

1. Directly query whether or not a specific file exists in the remote
2. Request the complete list of all files contained in the remote (and then
   compare that list with the list of files we are searching for)

_For example, the S3 API provides the `HeadObject` and `ListObjects` methods,
respectively._

Each method has its own advantages and disadvantages, and which method will be
optimal for a given data sync operation varies on a case-by-case basis.

### Method 1: Query individual files

When using the first method, performance depends on the number of files being
queried - for a single file, it would take a single API request, for 1 million
files, it would take 1 million API requests. In this case, the overall amount of
time it will take to complete the full operation will scale with the number of
files to query.

One particular advantage to using this method is that it can be easily
parallelized. Overall runtime can be improved by making simultaneous API
requests to query for multiple files at once.

### Method 2: Query full remote listing

With the second method, the overall amount of time it will take to complete the
full operation scales with the total number of files in cloud storage, rather
than the number of files we wish to query.

It is important to note that when using this method, cloud APIs will only return
a certain number of files at a time (the amount returned varies depending on the
API). This means that for an API which returns 1000 files at a time (such as
S3), retrieving the full listing of a remote containing 1000 files or less would
would only take a single API request. Listing a remote which contains 1 million
files would take 1000 API requests.

Another important note is that API calls for this method must be made
sequentially and cannot be easily parallelized. Using S3 as an example, the
first API call would return files 0 through 999. The next call would return
files 1000 through 1999, and so on. However, the API provides no guarantee of
ordering, and API calls must be made sequentially, until the full list has been
retrieved. So we cannot make two simultaneous requests for both "files 1-999"
and "files 1000-1999".

### Selecting the optimal query method

Choosing the ideal method from these two options will have a significant impact
on performance in a data sync operation. In general, when querying for a small
number of files, the first method will be faster. When querying for a large
number of files, the second method will be faster. However, this is not a hard
rule, especially in the case of very large remotes.

Consider a case where a dataset being synchronized contains 100 local files, and
we need to check which of those files exist in cloud storage. For the purposes
of this example, we will also assume that all individual API calls take the same
amount of time to complete, and that we are not running any tasks in parallel.

Checking if each file exists in the remote individually (method 1) would take
100 API calls. If we know that the API returns 1000 files per page, we can say
that if the remote contains less than `1000 * 100 = 100,000` files, fetching the
full remote listing (method 2) will be faster than checking each file
individually, since it will take less than 100 API calls to complete. If the
remote contains more files than this `100,000` threshold, it will be faster to
check our 100 files individually.

So, choosing the optimal method actually depends on both:

- The number of files that we need to query.
- The total number of files in the remote.

**Total API calls required to query 100 local files from S3**
![API calls](/uploads/images/2020-07-03/api_calls_100_local.svg 'API calls required to query 100 local files from S3')

_Note: In terms of real world performance, there are other considerations that
DVC must account for, such as different API calls taking different amounts of
time to complete, parallelization, and the amount of time it takes to run list
comparison operations in Python._

## How query method selection affects performance

To understand the effect that this can have on performance, consider an example
where we have a data sync tool which is hard coded to always query files
individually (using method 1). Let's say that we need to query for some set of
files in an S3 bucket, and that it will take 1 minute to complete the query via
method 1.

Now let's say that the S3 bucket contains several billions of files, and that
completing a full listing query (method 2) would take hours to complete. Luckily
for us, our data sync tool has been hard coded to use the first method, and it
only takes a flat 1 minute to run our query, saving us several hours of runtime
compared to the alternative.

But what if the S3 bucket was actually empty instead? Our data sync tool will
still take 1 minute to complete the query. However, if we had used the second
method here instead, our query would have finished almost instantly, since it
would only take a single API call for the list query to return the empty result.
In this case, our hard coded behavior costs us almost one minute of unnecessary
runtime.

This second example also illustrates another important point. Given a
(relatively) small query set and a sufficiently large remote, method 1 will
always be faster than method 2. Thinking about it from a different perspective,
if we have the ability to reduce the size of a (relatively) large query set,
once we pass a certain threshold we will be able to use method 1 rather than
method 2. On top of that, we know that the runtime of method 1 scales with query
set size. So in simple terms, by reducing the size of our query set as much as
possible, we can also improve performance.

Finally, we also need to remember that status queries are separate from any
actual file data transfer. In all of these examples, even if both local and
cloud storage are up to date (meaning no files actually need to be uploaded or
downloaded), the status queries will still take the same amount of time.

## DVC 1.0 vs DVC 0.91 vs rclone performance

The following charts show DVC and rclone status query runtimes for various
scenarios in which a local directory is synchronized to an S3 bucket. The
runtimes in each case are for status queries only (using `dvc status -c` in DVC
and `--dry-run` in rclone). No file data was transferred to or from S3 in any of
these scenarios. For these benchmarks we are only interested in the amount of
time required to determine file status, without the additional time it would
take to upload or download any changed files.

In each of these examples, we are simulating use cases for which a user tracks a
local directory containing some number of files using DVC, and then wishes to
synchronize the DVC-tracked files to cloud storage. In DVC, we sync files
between the DVC local
[cache](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
and DVC remote storage. So in order to get the equivalent behavior using rclone,
you would use `rclone sync` or `rclone copy` to move files between the DVC cache
directory and cloud storage.

Keep in mind that for DVC's purposes, we are most interested in optimizing
performance for scenarios which are normally very slow to complete. If you
consider an operation which previously took several hours to complete, improving
that runtime down to a few minutes will have a much greater impact for our users
versus shaving a few seconds off of an operation which previously took under a
minute to run.

_Note: In these examples, the local file count refers to the number of files
inside the original tracked directory. The number of files present in the DVC
cache will differ slightly, since the DVC cache will contain an additional file
representing the tracked directory itself, but the end result is that both DVC
and rclone will both need to query for the same number of files (i.e. the number
of files in the cache directory)._

**Local directory w/100k total files, S3 bucket w/1M total files (1 file
modified since last sync)**
![benchmarks](/uploads/images/2020-07-03/dvc_rclone_bench.svg 'DVC 1.0 vs rclone performance comparison')

In this example, the local directory contains 100,000 files, and the S3 bucket
contains approximately 1 million files. One file in the local directory has been
modified since the directory was last synchronized with the S3 bucket. This
scenario tests the length of time it takes DVC or rclone to determine (and
report to the user) that only the one modified file is missing from the S3
bucket and needs to be uploaded.

This simulates a typical DVC use case in which a user uses DVC to track a
directory containing a (relatively) large number of files and pushes the
directory into cloud storage. The user then continually repeats a process of:

1. Modify a small subset of files in the directory.
2. Push the updated version of the directory into cloud storage.

This scenario illustrates DVC's performance advantage over rclone with regard to
synchronizing iterations of a versioned dataset over time, as well as the DVC
1.0 performance improvements over prior releases.

**Local directory w/1 file, S3 bucket w/1M total files**
![benchmarks](/uploads/images/2020-07-03/dvc_rclone_bench2.svg 'DVC 1.0 vs rclone performance comparison')

In this example, we are testing a simple scenario in which the local directory
contains 1 file and the S3 bucket contains approximately 1 million files.

_Note: We are unsure of the reason for the rclone runtime difference with and
without `--no-traverse` for this scenario, but rclone does do some computation
to determine whether or not to default to `no-traverse` behavior for small query
sets. It's likely that specifying `--no-traverse` allows rclone to skip that
overhead entirely in this case._

**Local directory w/1M files, Empty S3 bucket**
![benchmarks](/uploads/images/2020-07-03/dvc_rclone_bench3.svg 'DVC 1.0 vs rclone performance comparison')
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

However, in DVC, we have to add extra overhead for this step, since we collect
the list of files expected to be present in the current DVC repository revision,
and then verify that those files are present locally. We would then check to see
if any missing files are available to be downloaded from remote storage.

It should also be noted that in common use cases where the number of files in
cloud storage continues to grow over time (such as in backup solutions or in
dataset versioning), rclone's advantage in this case would only apply for this
initial sync operation. Once the local dataset has been pushed to cloud storage,
DVC's advantage in synchronizing modifications to existing datasets would become
more apparent (as shown in the first example).

_Benchmark command usage:_

```dvc
$ time dvc status -c -r remote
$ time rclone copy --dry-run --progress --exclude "**/**.unpacked/" .dvc/cache remote:...
```

_rclone run with `--no-traverse` when indicated_

_Benchmark platform: Python 3.7, MacOS Catalina, DVC installed from pip,
dual-core 3.1GHz i7 cpu_

## DVC's advantage over general-use tools

Tools like rclone, must be generalized to support any file structure (both
locally and in cloud storage), which can come at the cost of performance,
especially when dealing with large datasets. A generic tool has no way of
determining which of the two previously described methods would be optimal for a
given sync operation. These tools must either rely on the user to choose the
correct method, or simply fall back to a default choice.

_For example, in rclone the `--no-traverse` option specifies which behavior
should be used._

As we demonstrated earlier, neither method can be configured as a
one-size-fits-all solution. For DVC, the number of files we need to sync (and
query) can vary wildly project revisions. Likewise, the total number of files in
a remote will continually grow over time, as new iterations of a project are
versioned and pushed into cloud storage. As a result, selecting the optimal
query method must really be done on a case-by-case basis per each sync
operation. Default (or user configured) behavior cannot be relied upon in this
situation.

However, since in DVC we synchronize different revisions of a versioned dataset,
we have access to certain contextual information about both the contents and
structure of local and cloud storage, which would normally be unavailable to
general use tools. One smiple example of this is that in DVC we are able to
parallelize our queries for the full listing of files in a remote.

As explained previously, normally these queries must be run sequentially.
However, most cloud storage APIs allow us to request the list of files contained
in a specific subdirectory (as opposed to requesting the list of every file in
every directory in cloud storage). So, if we knew that files in cloud storage
were divided into two subdirectories, we could run two sets of sequential
queries at the same time - one for each subdirectory. For general data sync
tools, which must support any possible file structure, this is usually not an
option, but it is something that we can take advantage of in DVC, since we
control the directory structure used in our cloud remotes.

In DVC 1.0, we leverage this kind of contextual information to provide improved
performance over other data sync tools (including prior DVC releases) in other
ways as well. In version 1.0, we are now able to automatically select the
optimal query method each time we run a data sync operation. Additionally, in
certain cases, we can now reduce the number of files we need to query in data
sync operations.

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

## How DVC 1.0 automatic selects a query method

As we established earlier, choosing the optimal query method depends on:

> - The number of files that we need to query.
> - The total number of files in the remote.

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

_Note: The DVC remote structure also allows us to parallelize the second query
method described earlier. By fetching the contents of each subdirectory
individually, we can run up to 256 sets of sequential queries at once._

## How DVC 1.0 reduces the number of files to query

A common DVC use case is
[versioning](/doc/use-cases/versioning-data-and-model-files) the contents of a
large directory. As the contents of the directory changes over time, DVC will be
used to push each updated version of the directory into cloud storage. In many
cases, only a small number of files within that directory will be modified
between project iterations.

So after the first version of a project is pushed into cloud storage, for
subsequent versions, only the small subset of changed files actually needs to be
synchronized with cloud storage. However, prior to 1.0, DVC would always need to
query for every file in that directory, regardless of whether or not a given
file had changed since the last time it was pushed to a remote.

Consider a case where a user has an existing directory with 1 million files
which has been versioned and pushed to a remote with DVC. In the next iteration
of the project, only a single file in the directory has been modified. We can
obviously see that everything other than the one modified file will already
exist in cloud storage. In older versions of DVC, when the user runs `dvc push`
to synchronize the directory with remote storage, DVC would need to query
whether or not all 1 million files existed in the remote.

As we established earlier:

> In simple terms, by reducing the size of our query set as much as possible, we
> can also improve performance.

**Total API calls required to query S3 bucket containing 1M files**
![API calls](/uploads/images/2020-07-03/api_calls_1m_s3.svg 'API calls required to query S3 bucket containing 1M files')

In an example case for an S3 remote containing 1 million files, the optimal
situation would be for us to keep the size of our query set beneath the 1000
file threshold. And from there, the further we reduce the size of the query set,
the more our runtime would improve.

In DVC 1.0, we are now able to reduce the size of our query set by keeping an
index of directories which have already been versioned and pushed into remote
storage. By referencing this index, DVC will "remember" which files already
exist in a remote, and will remove them from our query set at the start of a
data sync operation (before we choose a query method, and before we make any
cloud storage API requests). Using the previous example, DVC 1.0 will only query
for the single new file, rather than the entire contents of the directory.

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
