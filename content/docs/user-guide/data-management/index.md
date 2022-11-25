# Data Management with DVC

Recognizing the challenges of managing data in real-life machine learning, DVC
establishes a new standard for working with file-based datasets and ML models.
This approach lets you focus on more important tasks like data exploration,
validation, preparation, etc. You'll just have to get used to an evolved
workflow and adopt basic [version control] principles.

![]() _A better way to manage data_

Traditionally, you would access storage platforms directly with dedicated tools
such as SSH, manually tracking the whereabouts (URL) of every asset. Repeated
files get scattered across clouds or on-prem (inefficient storage). Your project
directory gets bloated quickly, needing regular manual cleaning. Copying and
transferring files over and over takes time.

DVC introduces a layer of [indirection]: raw data, models, and other artifacts
are _codified_ in small [metafiles] that describe their unique characteristics.
Storage locations (and other aspects of your project setup) are also saved to
human-readable config files. You can control all these with Git along with the
rest of your project's code and configuration files.

[version control]:
  https://www.atlassian.com/git/tutorials/what-is-version-control
[indirection]: https://en.wikipedia.org/wiki/Indirection
[metafiles]: /doc/user-guide/project-structure

<!--
DVC's approach enables data [versioning] and reproducibility. Other benefits:

- Standard [project versions] (Git commits) guarantee reproducibility of ML
  processes (e.g. training models with the same datasets, hyperparametes, and
  features).
- You work with data in a local <abbr>workspace</abbr>, as with any other files;
  DVC tracks, restores, and synchronize everything with a few operations that do
  not change per storage system.
- Your storage space is [used efficiently] (file deduplication); Your project
  repo stays small.
- Controlling who can read and write at folder or file level is easier.
- [Fast caching], [data registries], [model registries], [CI/CD for ML], and
  more!

[versioning]: /doc/use-cases/versioning-data-and-models
[project versions]: /doc/user-guide/data-management/data-versioning
[used efficiently]: /doc/user-guide/data-management/large-dataset-optimization
[fast caching]: /doc/use-cases/fast-data-caching-hub
[data registries]: /doc/use-cases/data-registry
[model registries]: /doc/use-cases/model-registry
[ci/cd for ml]: https://cml.dev/
-->

In order to get there, you'll have to do some preparation and keep a few things
in mind:

1. Set up a <abbr>DVC project</abbr> and its storage locations.
   <!-- [storage locations](#storage-locations). -->
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Everything happens though a code repository, typically controlled with Git.

[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

<!-- ## Storage locations

DVC can manage data anywhere: cloud storage, SSH servers, network resources
(e.g. NAS), mounted drives, local file systems, etc. These locations can be
put into three groups.

![Storage locations](/img/storage-locations.png) _Local, external, and remote
storage locations_

Every <abbr>DVC project</abbr> starts with 2 locations. The
<abbr>workspace</abbr> is the main project directory, containing your data,
models, source code, etc. DVC also creates a <abbr>data cache</abbr> (found
locally in `.dvc/cache` by default), which will be used as fast-access storage
for DVC operations.

<admon type="tip">

The cache can be moved to an external location in the file system or network,
for example to [share it] among several projects. It could even be set up in a
remote system (Internet access), but this is typically too slow for working with
data regularly.

</admon>

[share it]: /doc/user-guide/how-to/share-a-dvc-cache

DVC supports additional storage locations such as cloud services (Amazon S3,
Google Drive, Azure Blob Storage, etc.), SSH servers, network-attached storage,
etc. These are called [DVC remotes], and help you to share or back up copies of
your data assets.

<admon type="info">

DVC remotes are similar to Git remotes, but for <abbr>cached</abbr> data.

</admon>

[dvc remotes]: /doc/command-reference/remote
-->
