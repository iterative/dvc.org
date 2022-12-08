# Data Management for Machine Learning

Where and how to store data and model files is one of the first things to solve
in applied data science, but no best practices have been widely established yet.
Your assets may end up scattered redundantly throughout data stores on the cloud
and on-premise. Too many people have read and write access. Data versions rely
on inconsistent file naming patterns.

![Direct storage access](/img/manual_data_management.png) _Ad hoc data
management gets complicated._

DVC helps you take control of your data throughout its lifecycle. It manages
your storage platform(s) from a central repository you can secure. It also
tracks where every object lives, avoiding duplicates. Data updates can be
[properly versioned] with append-only storage, guaranteeing the
[reproducibility] of any state of your project. A consistent interface lets you
access your files anywhere (via [CLI], [API], [IDE], or [web]).

<!--
visibility
clean project structure?
-->

[properly versioned]: /doc/use-cases/versioning-data-and-models
[reproducibility]: /doc/user-guide/pipelines
[cli]: /doc/command-reference
[api]: /doc/api-reference
[ide]: /doc/vs-code-extension
[web]: /doc/studio

![DVC data access](/img/dvc_managed_storage.png) _Simplified approach with DVC_

To get there, DVC introduces a layer of [indirection] where large files and
directories get _codified_ into small [metafiles], and storage locations defined
in [config files]. You can capture all these [with Git] along with the rest of
your project's code, while data storage is separated automatically.

<!--
Ops via Git?
-->

Key workflow changes to keep in mind:

1. You must set up a <abbr>DVC project</abbr> and its storage locations.
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Data operations happen through a code repository (typically on Git).

[indirection]: https://en.wikipedia.org/wiki/Indirection
[metafiles]: /doc/user-guide/project-structure
[config files]: /doc/user-guide/project-structure/internal-files
[with git]: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

## Benefits

- Work in a small and clean <abbr>workspace</abbr> linked to one or more storage
  locations. DVC tracks, restores, and synchronizes everything with a few
  operations that do not change.
- Content-addressable <abbr>caching</abbr> maximizes [storage efficiency] and
  transfer speed, enabling near-instantaneous switching among datasets.
- Data versioning with Git on top of your existing storage solutions (SSH, S3,
  [etc.])
- Immutable project history with an append-only storage and authors
  (auditability)
- [Data registries], distributed collaboration, [data pipelines], [model
  registries], data security, [CI/CD for ML], [productization], and other
  advanced scenarios are unlocked.

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

[project versions]: /doc/user-guide/data-management/data-versioning
[fast caching]: /doc/use-cases/fast-data-caching-hub
[data registries]: /doc/use-cases/data-registry
[storage efficiency]: /doc/user-guide/data-management/large-dataset-optimization
[etc.]: /doc/command-reference/remote/add#supported-storage-types
[model registries]: /doc/use-cases/model-registry
[ci/cd for ml]: https://cml.dev/
[productization]: https://mlem.ai/

<!--
This lets you focus on more important tasks like data exploration, preparation, etc.
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
