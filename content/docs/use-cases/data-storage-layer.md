# Data Storage Layer

Datasets used in data science tend to exceed the capacity of typical storage and
computing environments. What infrastructure do you need to work with large
files, and can your team utilize it effectively?

For example, you may be looking to speed up data transfers from a massive object
store on the cloud, e.g. on an S3 bucket. Or perhaps you need to move an
expanding data store out of your machine, into a network storage device (e.g. a
NAS drive) for fast access.

![](/img/storage-layers.png) _Datasets cache placement_

DVC's built-in data <abbr>caching</abbr> enables you to adopt such a setup
seamlessly. Define one, two, or more storage locations for certain parts or
[versions](/doc/use-cases/versioning-data-and-model-files) of the data,
depending on the access speed and frequency required. And enjoy the flexibility
to redesign the storage solution in the future, without having to change the
project's structure or code.

Some scenarios this can address:

- Your datasets are too large to store locally and cloud storage is too slow. Is
  there a middle ground that will help you scale?
- Upgrading your storage platform is expensive, can you only pay to quickly
  access the part of the data that's used daily?
- A team shares access to a GPU server for machine learning
  [experiments](/doc/user-guide/experiment-management). How do you connect
  different datasets?
- How do you avoid duplicating files when multiple people are working on the
  same datasets (e.g. on a
  [shared development server](#example-shared-development-server)).

## How it works

DVC converts your raw data, intermediate artifacts, and final ML models into
unique storage objects, separating data stores from other aspects of your
projects. <abbr>Cached</abbr> files and directories are mapped back to your
<abbr>workspace</abbr> using [file links]. This optimizes storage by avoiding
file duplication, and minimizes transfers.

> 📖 See [Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
> more details.

[file links]:
  /doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache

One way to make the most out of this feature is to configure a [shared cache] as
primary storage for multiple <abbr>projects</abbr>. This compounds the
deduplication and performance benefits. Common storage can be placed in a
network-attached storage (NAS) drive, for example.

Making DVC storage global for all projects can make it an independent layer in
your infrastructure. You can use file servers, Ceph,
[EFS](https://aws.amazon.com/efs/), cloud object storage (S3,
[GCS](https://cloud.google.com/storage/), Azure, etc.), or any other platform;
and manage _data security_ policies there.

![]() _Data storage as infrastructure_

To balance speed and cost, you can introduce a secondary storage layer with a
`dvc remote`. Data associated with older versions of your project that you won't
need often can be kept or backed up there. Remote storage is also a great way to
[share datasets and ML models](/doc/use-cases/sharing-data-and-model-files).

[shared cache]: /doc/user-guide/how-to/share-a-dvc-cache
