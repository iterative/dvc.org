# Data Management with DVC

Where to store data and how to organize datasets for machine learning are not
trivial problems when working with large files and directories. DVC proposes a
new strategy involving _codification_. This lets you focus on more important
tasks like data exploration, preparation, etc.

Traditionally, data files end up scattered through different locations on the
cloud and on-premises, often redundantly. It's easy to lose track of relevant
assets, and difficult to implement security controls. Accessing these data
stores directly requires special tools and integrations (AWS CLI, Python
libraries, etc.). Versioning data under these conditions is a challenge.

![]() _Problems with managing data ad hoc_

DVC's approach has many benefits. First, a clean directory structure can be
centrally mapped to a storage location (or multiple ones). Data objects are
<abbr>cached</abbr> in a way that [prevents file duplication] as they're
ingested. [Data versioning] and [reproducibility] are enabled.
[See more](#more-benefits).

[prevents file duplication]:
  /doc/user-guide/data-management/large-dataset-optimization
[data versioning]: /doc/use-cases/versioning-data-and-models
[reproducibility]: /doc/user-guide/pipelines

![]() _Main benefits of DVC's approach_

To achieve this, DVC introduces a layer of [indirection]: raw data, models, and
other artifacts are _codified_ in small [metafiles] that describe them. Storage
locations are also saved to human-readable config files. You can control all
these files [with Git], along with the rest of your project's code. You'll just
have to keep in mind a few workflow changes:

[indirection]: https://en.wikipedia.org/wiki/Indirection
[metafiles]: /doc/user-guide/project-structure
[with git]: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

1. Start by setting up up a <abbr>DVC project</abbr> and its storage locations.
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Data operations happen through a code repository (typically on Git).

[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

## More benefits

- [Version control] (Git) benefits on top of your existing storage solutions:
  immutable history, authoring, distributed collaboration, etc.
- You work with data in a local <abbr>workspace</abbr>, as with any other files;
  DVC tracks, restores, and synchronizes everything with a few operations that
  do not change per storage system.
- Your project repository stays small, as storage is separated automatically.
- Stop wasting valuable time by transferring the same large files repeatedly.
- Controlling who can read and write at folder or file level is easier.
- [Fast caching], [data registries], [model registries], [CI/CD for ML], and
  more!

[version control]:
  https://www.atlassian.com/git/tutorials/what-is-version-control
[project versions]: /doc/user-guide/data-management/data-versioning
[fast caching]: /doc/use-cases/fast-data-caching-hub
[data registries]: /doc/use-cases/data-registry
[model registries]: /doc/use-cases/model-registry
[ci/cd for ml]: https://cml.dev/

<!-- ## Summary of differences

|                | **Manual**                 | **With DVC**                              |
| -------------- | -------------------------- | ----------------------------------------- |
| _Access Ops_   | Different per location     | Consistent `dvc` commands (via code repo) |
| _File org._    | Manual (ad hoc)            | Automatic <abbr>caching</abbr>            |
| _Storage_      | Bloated                    | [Efficient] (deduplicated)                |
| _Versioning_   | Special file naming (hard) | Git commits (standard)                    |
| _Reproduction_ | Manual logs (error-prone)  | Guaranteed by Git history                 |

[efficient]: /doc/user-guide/data-management/large-dataset-optimization
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
