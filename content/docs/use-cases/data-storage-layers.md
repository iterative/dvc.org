# Data Storage Layers

Collaborative dataset and ML model storage can be challenging. What
infrastructure should you provision? How do you optimize transfer speeds? Can
you avoid data duplication? Who has read or write access?

Separate your data science project from file storage. Define one or two flexible
storage layers, and let DVC connect them to your project. Depending on the
access speed required, their location can be local or remote, and either primary
or secondary.

![](/img/storage-layers.png) _Possible data storage placement_

Some scenarios:

- You need to design a system for multiple people working on the same datasets
  (e.g. a [shared development server](#example-shared-development-server)).
- Transfers to/from cloud storage (e.g. Amazon S3) take too long. Can you easily
  introduce a local cache layer for faster access?
- You want to move data from your machine to an external drive without losing
  the ability to use it locally.
- Your team shares access to a GPU server for machine learning [experiments].
  How do you connect different datasets?

[experiments]: #

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
