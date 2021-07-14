# Data Storage Layer

Datasets used in data science tend to exceed the capacity of typical storage and
computing environments. What infrastructure do you need to work with large
files, and can your team utilize it effectively?

For example, you may be looking to speed up data transfers from a massive object
store on the cloud, e.g. on an S3 bucket. Or perhaps you need to move an
expanding data store out of your machine, and into a network storage device
(e.g. a NAS drive) for fast access.

![](/img/storage-layers.png) _Datasets cache placement_

DVC's built-in data <abbr>caching</abbr> enables you to adopt such a setup
globally — for all your projects. Define one, two, or more storage locations for
certain parts or [versions](/doc/use-cases/versioning-data-and-model-files) of
the data, depending on the access speed and frequency required. And enjoy the
flexibility to redesign the storage solution in the future, without having to
change directory structures or code.

Some scenarios this can address:

- Your datasets are too large to store locally and cloud storage is too slow. Is
  there a middle ground that will help you scale?
- Upgrading your storage platform is expensive, can you only pay for fast access
  the part of the data needed regularly?
- A team shares access to a GPU server for machine learning
  [experiments](/doc/user-guide/experiment-management). How do you connect
  different datasets?
- Can you de-duplicate data files automatically when multiple people are working
  on the same datasets (e.g. on a
  [shared development server](#example-shared-development-server)).

## How it works

DVC converts your raw data, intermediate artifacts, and final results (such as
machine learning models) into unique storage objects. This optimizes storage by
avoiding file duplication, and separates it from other aspects of your projects.
<abbr>Cached</abbr> files and directories are mapped back to your
<abbr>workspace</abbr> using [file links], minimizing transfers.

> 📖 See [Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
> more details.

[file links]:
  /doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache

One way to make the most out of this feature is to configure a [shared cache] as
primary storage for multiple <abbr>projects</abbr>. This compounds the
deduplication and performance benefits. Common storage can be treated as an
independent layer in your infrastructure. Use file servers, Ceph,
[EFS](https://aws.amazon.com/efs/), object storage (e.g. S3,
[GCS](https://cloud.google.com/storage/), Azure), or any other platform.

![]() _Data storage as infrastructure_

To balance speed and cost, you can employ a `dvc remote` as secondary storage.
Data associated with older versions of your project that you won't need daily
can be kept or backed up there. Remote storage is also a great way to
[share datasets and ML models](/doc/use-cases/sharing-data-and-model-files).

## Example: Shared Development Server

Some teams may prefer using a single shared machine to run their experiments.
This allows better resource utilization, such as GPU access, centralized data
storage, etc. Each person can work in their own separate <abbr>workspaces</abbr>
as usual; DVC will handle the data effectively.

![](/img/shared-server.png) _Data store shared by DVC projects_

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
