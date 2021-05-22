# Sharing Resources Efficiently

Data science teams need to handle large files, rotate the use of special
processors, and minimize data transfers. This involves provisioning and managing
resources such as massive on-prem data stores and powerful servers, which can be
expensive and time consuming.

![]() _TODO: NEEDS NEW FIGURE HERE_

Minimizing the cost and complexity of utilizing key resources can make the
difference, for example, when:

- Multiple users work on the same shared server.
- There's a centralized data storage unit or cluster.
- There's a single computing environment to run experiments.
- GPU time gets distributed among people or processes for training machine
  learning models.

In DVC, a built-in <abbr>caching</abbr> mechanism already provides individual
<abbr>projects</abbr> with basic
[dataset optimization](/doc/user-guide/large-dataset-optimization). It
de-duplicates file contents automatically -- so need to worry about depleting
disk space with copies. And by linking files from cache to
<abbr>workspace</abbr>, DVC achieves near-instantaneous switching between
[versions of data](/doc/use-cases/versioning-data-and-model-files), results,
etc. (think **Git for data**).

These benefits can extend to multiple DVC repository copies, or even to
different projects altogether. Set up
[the same external cache](/doc/user-guide/how-to/share-a-dvc-cache) directory
for all of them so that they share a central data location, optimizing local (or
network) storage.

![](/img/shared-server.png) _One data store shared among people or projects_

Additionally/Alternatively, [remote storage](/doc/command-reference/remote) (on
Amazon S3, SSH, Google Drive, etc.) can also be shared by multiple projects to
back up and synchronize their data caches (see `dvc push` and `dvc pull`). This
can reduce service costs by consolidating an optimized data backup for many
projects.

> 💡 Another way to centralize some or all of the data requirements of your
> projects is to implement a [data registry](/doc/use-cases/data-registries)
> pattern.
