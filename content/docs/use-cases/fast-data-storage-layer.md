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
> [share datasets and ML models](/doc/use-cases/sharing-data-and-model-files) or
> and back them up.

## Example: Shared development server

Some teams prefer using a single shared machine to run their experiments. This
allows better resource utilization (quick transfers, central storage, GPU
access, etc.) in a simple way. Each person can work in separate
<abbr>workspaces</abbr>, and DVC will handle the data linking.

![](/img/shared-server.png) _Data storage shared by DVC projects_

⚙️ Start by configuring a [shared DVC cache].

[shared dvc cache]: /doc/user-guide/how-to/share-a-dvc-cache

> ⚠️ It's not recommended to share a single workspace among users, as it may
> produce file permission issues.

Let's say you are cleaning up raw data for later stages:

```dvc
$ dvc add raw
$ dvc stage add -n clean_data -d cleanup.py -d raw -o clean \
                ./cleanup.py raw clean
$ dvc repro

$ git add cleanup.py raw.dvc dvc.yaml dvc.lock .gitignore
$ git commit -m "Cleanup raw data"
$ git push
```

> 📖 Learn more about `dvc add`, `dvc stage add`, and `dvc repro`.

The data gets <abbr>cached</abbr> in the shared location. Your colleagues can
`dvc checkout` your work, and have both the `raw` and `clean` data file-linked
to their workspace automatically. Imagine that they then decide to continue
building this [pipeline](/doc/command-reference/dag), and process the clean
data:

```dvc
$ git pull
$ dvc checkout
A       raw
A       clean
# ... work on processing clean data ...

$ dvc stage add -n process_data
                -d process.py -d clean -o processed
                ./process.py clean processed
$ dvc repro

$ git add process.py dvc.yaml dvc.lock .gitignore
$ git commit -m "Process data"
$ git push
```

You can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```
