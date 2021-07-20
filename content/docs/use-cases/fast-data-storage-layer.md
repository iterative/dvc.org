# Fast Data Storage Layer

Datasets used in data science tend to exceed typical storage and networking
capacities. Storage needs expand rapidly as more people and projects acquire the
same data, creating duplication and increasing cost. Valuable time is wasted
waiting for downloads, and the wait repeats across environments. Is there an
effective way to perform this process?

![](/img/storage-layers.png) _Data storage infrastructure_

DVC's built-in data <abbr>caching</abbr> enables you to implement a simple and
efficient storage layer globally — for all your team's projects. This approach
can help in situations such as:

- You want to speed up data transfers from a massive object store which is
  currently on the cloud, or to move a growing dataset out of your machine
  without slowing things down. How do you plug in something in the middle (like
  a NAS drive) to existing projects?

- Upgrading your entire storage platform is expensive. Can you pay only for fast
  access to the data sets your team uses frequently?

- You want to de-duplicate files automatically when multiple people are working
  on the same data (for example, on a
  [shared development server](#example-shared-development-server)).

- Your team shares access to a GPU server for machine learning
  [experiments](/doc/user-guide/experiment-management). How can you switch the
  working datasets quickly, without re-downloading every time?

## How it works

DVC converts your raw data, intermediate artifacts, and final results (e.g.
machine learning models) into unique storage objects. This optimizes storage by
avoiding file duplication. <abbr>Cached</abbr> files are mapped back to your
<abbr>workspace</abbr> using [file links] to minimize transfers.

> 📖 See [Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
> more details.

[file links]:
  /doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache

To unify data storage across multiple projects, you can configure a [shared
cache]. This compounds the deduplication and performance benefits. Having
separated data storage from other aspects of your projects, you can treat it as
an independent infrastructure layer, using Ceph,
[EFS](https://aws.amazon.com/efs/), or any other platform.

![](/img/shared-server.png) _Data storage shared by DVC projects_

To balance speed and cost, you can also use a `dvc remote` (or several) as
secondary storage (e.g. an object store like S3,
[GCS](https://cloud.google.com/storage/), or Azure Blob Storage). Data only
needed in older [versions](/doc/use-cases/versioning-data-and-model-files) of
your project can be kept there. Remote storage is also a great way to back up
and [share datasets and ML models](/doc/use-cases/sharing-data-and-model-files).

## Example: Shared Development Server

Some teams may prefer using a single shared machine to run their experiments.
This allows better resource utilization, such as GPU access and centralized data
storage. Each person can work in their own separate <abbr>workspace</abbr> as
usual, and DVC will handle the data linking.

⚙️ Start by configuring a [shared cache].

[shared cache]: /doc/user-guide/how-to/share-a-dvc-cache

Let's say you are cleaning up raw data for later stages:

```dvc
$ dvc add raw
$ dvc run -n clean_data -d cleanup.py -d raw -o clean \
          ./cleanup.py raw clean
# The data is cached in the shared location.
$ git add raw.dvc dvc.yaml dvc.lock .gitignore
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can [checkout](/doc/command-reference/checkout) the
<abbr>project</abbr> data (from the shared <abbr>cache</abbr>), and have both
`raw` and `clean` data files appear in their workspace without moving any files.
Imagine that they then decide to continue building this
[pipeline](/doc/command-reference/dag) and process the clean data:

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
