# Sharing Resources Efficiently

Data science teams need to handle large files, rotate the use of special
processors, and minimize data transfers. This involves provisioning and managing
resources such as massive on-prem data stores and powerful servers, which can be
expensive and time consuming.

![](/img/shared-server.png) _Data store shared by DVC projects_

Minimizing the cost and complexity of utilizing key resources can make the
difference, for example, when:

- Multiple users work on the same shared server, or there's a single computing
  environment to run experiments.
- GPU time gets distributed among people or processes for training machine
  learning models.
- There's a centralized data storage unit or cluster.

In DVC, a built-in <abbr>caching</abbr> mechanism already provides individual
<abbr>projects</abbr> with basic
[dataset optimization](/doc/user-guide/large-dataset-optimization). It
de-duplicates file contents automatically -- so need to worry about depleting
disk space with copies. And by linking files from cache to
<abbr>workspace</abbr>, DVC achieves near-instantaneous switching between
[versions of data](/doc/use-cases/versioning-data-and-model-files), results,
etc. (think **Git for data**).

These benefits can extend to multiple DVC repository copies, or even to
different projects altogether. Just set up their caches to the same
[shared](/doc/user-guide/how-to/share-a-dvc-cache) directory. This way they all
use a central data location which optimizes local (or network) storage.

Additionally/Alternatively, [remote storage](/doc/command-reference/remote) (on
Amazon S3, SSH, Google Drive, etc.) can also be shared by multiple projects to
back up and synchronize their data caches (see `dvc push` and `dvc pull`). This
can reduce service costs by consolidating an optimized data backup for many
projects.

<!--

## Example: Shared Development Server

You and your colleagues can work in separate directories as usual, and DVC will
handle all your data in the most effective way possible. Let's say you are
cleaning up raw data for later stages:

```dvc
$ dvc add raw
$ dvc run -n clean_data -d cleanup.py -d raw -o clean \
          ./cleanup.py raw clean
# The data is cached in the shared location.
$ git add raw.dvc dvc.yaml dvc.lock .gitignore
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can [checkout](/doc/command-reference/checkout) the data (from
the shared <abbr>cache</abbr>), and have both `raw` and `clean` data files
appear in their workspace without moving anything manually. After this, they
could decide to continue building this [pipeline](/doc/command-reference/dag)
and process the clean data:

```dvc
$ git pull
$ dvc checkout
A       raw  # Data is linked from cache to workspace.
$ dvc run -n process_clean_data -d process.py -d clean -o processed
          ./process.py clean processed
$ git add dvc.yaml dvc.lock
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```

-->
