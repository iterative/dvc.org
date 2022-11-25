# Data Management with DVC

DVC establishes a standard for working with file-based datasets and ML models.
This lets you focus on more important tasks like data exploration, validation,
preparation, etc. Let's look at how your workflow evolves, and the basic
[version control] principles you'll need.

|                | **Manual**                 | **With DVC**                              |
| -------------- | -------------------------- | ----------------------------------------- |
| _Access Ops_   | Different per location     | Consistent `dvc` commands (via code repo) |
| _File org._    | Manual (ad hoc)            | Automatic <abbr>caching</abbr>            |
| _Storage_      | Bloated                    | [Efficient] (deduplicated)                |
| _Versioning_   | Special file naming (hard) | Git commits (standard)                    |
| _Reproduction_ | Manual logs (error-prone)  | Guaranteed by Git history                 |

[efficient]: /doc/user-guide/data-management/large-dataset-optimization

Traditionally, you would access storage platforms directly with dedicated tools
such as SSH, manually tracking the whereabouts (URL) of every asset. Redundant
files get scattered across clouds and locally. Your project directory gets
bloated quickly, needing regular cleaning. But copying and transferring large
files repeatedly wastes valuable time.

DVC introduces a layer of [indirection]: raw data, models, and other artifacts
are _codified_ in small [metafiles] that describe their unique characteristics.
Storage locations (and other aspects of your project setup) are also saved to
human-readable config files. You can control all these files with Git, along
with the rest of your project's code and configuration.

<!-- [Storage locations](#storage-locations). -->

[version control]:
  https://www.atlassian.com/git/tutorials/what-is-version-control
[indirection]: https://en.wikipedia.org/wiki/Indirection
[metafiles]: /doc/user-guide/project-structure

To adopt this approach, you'll need some preparation and to keep a few things in
mind:

1. Set up a <abbr>DVC project</abbr> and its storage locations.
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Everything happens through a code repository, typically controlled with Git.

[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

<!--
DVC's approach enables data [versioning] and reproducibility. Other benefits:

- Standard [project versions] (Git commits) guarantee reproducibility of ML
  processes (e.g. training models with the same datasets, hyperparametes, and
  features).
- You work with data in a local <abbr>workspace</abbr>, as with any other files;
  DVC tracks, restores, and synchronize everything with a few operations that do
  not change per storage system.
- Your storage space is [used efficiently] (file de-duplication); Your project
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
