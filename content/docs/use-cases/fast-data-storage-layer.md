# Fast Data Storage Layer

Datasets used in data science tend to exceed typical storage and networking
capacities. Storage needs expand rapidly as more people acquire the same data,
creating duplication (increasing cost). Valuable time is wasted waiting for
downloads in each environment.

![](/img/dataset-copies.png) _Slow synchronization of data storage_

DVC's built-in data <abbr>caching</abbr> lets you implement a simple and
efficient storage layer globally -- for your entire team. This approach can help
to

- speed up data transfers from massive object stores currently on the cloud, or
  move a growing dataset out of your machine without slowing things down.

- pay only for fast access to frequently-used data (upgrading your entire
  storage platform is expensive).

- de-duplicate files automatically when multiple people are working on the same
  data (for example on a
  [shared development server](#example-shared-development-server)).

- switch data inputs quickly (without re-downloading) on a shared GPU server for
  machine learning [experiments](/doc/user-guide/experiment-management).

![](/img/storage-layers.png) _Data storage middleware for multiple projects_

You can unify all your data across projects by setting up a [shared DVC cache]
in a near location (network, external drive). This deduplicates your entire data
store and minimizes transfers by
[linking](/doc/user-guide/large-dataset-optimization) your working files and
directories.

Now that your team shares a primary storage, it can be managed independently as
part of your infrastructure; provisioned depending on data access speed and cost
requirements. You have the flexibility to change storage providers at any time,
without having to change the directory structures or code of your projects.

> DVC can also manage [remote storage](/doc/command-reference/remote) on
> platforms like Amazon S3 or Google Drive, in order to
> [share datasets and ML models](/doc/use-cases/sharing-data-and-model-files)
> and back them up.

## Example: Shared development server

Some teams prefer using a single shared machine to run their experiments. This
is a simple way to improve resource utilization (quick transfers, central
storage, GPU access, etc.). Everyone can still work in a separate
<abbr>workspace</abbr> (e.g. in their user home folders).

> ⚠️ In fact it's not recommended to share a single workspace among users, as it
> may produce file permission issues.

![](/img/shared-server.png) _Data storage shared by DVC projects_

Start by configuring a [shared DVC cache]. Now when colleagues make changes to
the project, you can get the latest results with `dvc checkout`. DVC links data
files and directories to your workspace instantly, so data artifacts are never
moved or copied.

[shared dvc cache]: /doc/user-guide/how-to/share-a-dvc-cache

```dvc
$ git pull
$ dvc checkout
A       data/new
M       data/labels
```

> 📖 Learn more about [data versioning](/doc/start/data-and-model-versioning).
