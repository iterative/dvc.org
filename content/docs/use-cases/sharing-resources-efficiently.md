# Sharing Resources Efficiently

Data science teams need to handle large files, rotate the use of special
processors, and minimize data transfers. This involves provisioning and managing
resources such as massive on-prem data stores and powerful servers, which can be
expensive and time consuming.

![](/img/shared-server.png) _Data store shared by DVC projects_

DVC projects support different ways to optimize resource utilization in order to
minimize cost and complexity. This can make the difference, for example when:

- Multiple users work on the same shared server, or there's a single computing
  environment to run experiments.
- GPU time gets distributed among people or processes for training machine
  learning models.
- There's a centralized data storage unit or cluster.

Individual DVC projects already use a local data <abbr>cache</abbr> to achieve
near-instantaneous <abbr>workspace</abbr> restoration when switching among
[versions of data](/doc/use-cases/versioning-data-and-model-files), results,
etc. (think **Git for data**).

The cache directory is fully customizable (see `dvc config cache`), including
it's location, so nothing prevents you from having it in a
[location shared](/doc/user-guide/how-to/share-a-dvc-cache) by multiple local
copies of a <abbr>project</abbr>, or even by different projects altogether. This
enables DVC's automatic de-duplication of data files across all projects.

Additionally, optional [remote storage](/doc/command-reference/remote) e.g.
Amazon S3 or Azure Blob Storage (managed separately) can be used by multiple
projects to synchronize their caches (see `dvc push` and `dvc pull`).

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
