---
title: Remote Optimization Improvements in DVC 1.0
date: 2020-06-29
description: |
  An overview of how data synchronization to and from remote storage is optimized in DVC 1.0.
picture: ''
author: peter_rowlands
---

DVC is a version control system for machine learning projects and offers a wide
range of [features](/features) designed to improve ML project workflows, but at
its core, DVC is a data management tool. And as a data management tool, DVC must
provide support for one requirement common to any typical ML project: handling
large amounts of data.

ML projects require storing and processing a lot of data. As new iterations or
experiments are added to a project, the amount of data associated with the
project will continue to grow. A typical DVC repository may contain millions of
files or more in one revision of a dataset. On top of that, the number of files
we need to handle in DVC multiplies with each version of a dataset.

In order to work with this much data, ML projects often rely on cloud storage,
whether it is to address local storage space limitations, enable collaboration
between users or function as a backup solution. So naturally, as a data
management tool for ML, DVC includes platform agnostic support for cloud
storage.

One of the key features provided by DVC is the ability to efficiently
synchronize versioned datasets between a user's local machine and
[remote storage](https://dvc.org/doc/command-reference/remote), and our users
have frequently shown the need for us to optimize this process wherever
possible. In addition to simply being frustrating for a user, slow runtimes for
data synchronization operations will have a negative impact on how quickly new
iterations of an ML project can be made.

![](/uploads/images/2020-06-29/optimization_screenshot.png '=600')

While developing DVC, we identified one particular performance bottleneck which
affects all cloud sync tools - remote (cloud) status queries. Any data sync tool
will be restricted by certain limits imposed by cloud storage APIs - namely, the
actual API methods available for querying file status. Using one method over
another could mean the difference between a given sync operation taking seconds
rather than hours to complete.

And with the release of version 1.0, DVC now includes several performance
enhancements to address this issue, ensuring that we always optimize requests
made to cloud storage APIs.

_Note: "Cloud storage" and "remote storage" will be used interchangeably
throughout this post. When discussing dataset size in this post, we mean size in
terms of total number of files in a dataset, rather than the total amount of
file data (bytes)._

## Why status queries are a performance bottleneck

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

In order to sync data between a local machine and remote storage, we must do the
following:

1. Determine which files are present locally.
2. Query the cloud storage API to determine which files are present in the
   cloud.
3. Compute the difference between the two sets of files.

Once this file status has been determined, the necessary files can then be
copied to or from cloud storage. Files which only exist locally, must be
uploaded. Likewise, files which only exist in cloud storage must be downloaded.

While this may seem like a simple problem, it actually represents a significant
performance bottleneck for data synchronization, particularly becuse of step #2.
When querying a cloud storage API, a data sync tool will be restricted by any
limits imposed by the API itself.

However, with the optimizations new to DVC 1.0, we are now able to work around
these limitations and provide substantial performance benefits over older DVC
releases and general data sync tools. In fact, DVC 1.0 offers improved runtimes
over rclone by 20x or more in certain scenarios.

### DVC 1.0 vs DVC 0.91 vs rclone performance

![benchmarks](https://raw.githubusercontent.com/gist/pmrowla/338d9645bd05df966f8aba8366cab308/raw/37f64e28e8c2e963aff0d320f6e0cea0724342a5/remote-benchmarks.svg 'DVC 1.0 performance comparison')
_Note: Benchmark details can be found
[here](https://gist.github.com/pmrowla/338d9645bd05df966f8aba8366cab308#benchmarks)
(rclone run with default configuration)._

## How we query file status via cloud storage APIs

When querying file status from a remote, we are limited by cloud storage APIs.
In general, cloud storage APIs provide two possible ways to determine what files
are present:

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

However, it is possible to make parallel requests using this method, if we know
the file structure used in remote storage. Most cloud storage APIs allow us to
request the full list of files contained in a specific subdirectory or prefix.
So, if we know that files in a remote are organized into two directories, `foo/`
and `bar/`, we could run two sets of sequential queries at the same time - one
for each subdirectory. For general data sync tools, which must support any
possible file structure, this is usually not an option, but it is something that
we can (and do) take advantage of in DVC.

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
query) can vary wildly between ML project revisions. Likewise, the total number
of files in a remote will continually grow over time, as new iterations of the
project are pushed into cloud storage. As a result, selecting the optimal query
method must really be on a case-by-case basis per each sync operation. Default
(or user configured) behavior cannot be relied upon in this situation.

However, DVC is a specialized tool designed specifically for ML. In DVC, we are
synchronizing different versions of ML project datasets. This means that we have
contextual information about both the contents and structure of local and cloud
storage, which would normally be unavailable to general use tools.

In DVC 1.0, we leverage this information to provide improved performance over
other data sync tools (including prior DVC releases). In version 1.0, we are now
able to automatically select the optimal query method each time we run a data
sync operation. Additionally, in certain cases, we can now reduce the number of
files we need to query in data sync operations.

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
large directory. As new iterations of an ML project are created, the contents of
that directory will be modified with each version, and DVC will be used to push
each version into cloud storage. In many cases, only a small number of files
within that directory will be modified between project iterations.

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

By selecting the optimal status query method, and optimizing the queries
themselves by reducing the amount of files to query, we were able to
significantly improve performance for data sync operations in DVC 1.0. Whether
you are upgrading from a prior DVC release, or trying DVC for the first time, we
hope that all of our users are able to benefit from these new optimizations.

DVC performance is an important issue, and our team is looking forward to
working on further
[performance optimizations](https://github.com/iterative/dvc/labels/performance)
in the future - across all areas in DVC, not just remotes.

As always, if you have any questions, comments or suggestions regarding DVC
performance, please feel free to connect with the DVC community on
[Discourse](https://discuss.dvc.org/), [Discord](https://dvc.org/chat) and
[GitHub](https://github.com/iterative/dvc).
