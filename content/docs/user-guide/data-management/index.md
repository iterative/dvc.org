# Data Management with DVC

DVC changes the way you work with datasets and ML models in order to enable data
[versioning] and reproducibility, among other
[benefits](#benefits-and-implications). Let's look at how the workflow evolves.

![Before and after DVC](/img/before-after.png) _DVC codifies data access._

Traditionally, you would access storage platforms directly, with dedicated tools
such as AWS CLI, code libraries, SCP, etc. This requires knowing the final URL
of every asset. It also means that having data scattered across the cloud or
on-prem locations complicates your workflow.

DVC introduces a layer of [indirection]: raw data, models, and other artifacts
are _codified_ in small [metafiles] that describe their unique characteristics.
Storage locations (and other aspects of your project setup) are also saved to
human-readable config files. You can control all these with Git along with the
rest of your project's code and configuration files.

[versioning]: /doc/use-cases/versioning-data-and-models
[indirection]: https://en.wikipedia.org/wiki/Indirection
[metafiles]: /doc/user-guide/project-structure

## Benefits and implications

DVC's approach lets you focus on machine learning and includes other advantages:

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

[project versions]: /doc/user-guide/data-management/data-versioning
[used efficiently]: /doc/user-guide/data-management/large-dataset-optimization
[fast caching]: /doc/use-cases/fast-data-caching-hub
[data registries]: /doc/use-cases/data-registry
[model registries]: /doc/use-cases/model-registry
[ci/cd for ml]: https://cml.dev/

This implies getting used to a new workflow. But it's a small cost to improve
productivity:

1. You have to set up a <abbr>DVC project</abbr> and its storage locations.
   <!-- [storage locations](#storage-locations). -->
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Everything happens though a code repository that can be controlled with Git.

[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

<!--
## Separating data from code (codification)

DVC replaces large files and directories with small [metafiles] that describe
the assets. We call this _data codification_. Data files are moved to a separate
<abbr>cache</abbr> but kept virtually (linked) in the workspace. This separates
your data from code (including metafiles).

<!-- ![Data separation](/img/data-separation.png) _Separating code from data_ -/->

<admon type="tip">

This also allows you to version project files with Git, a battle-tested [SCM]
tool.

[scm]: https://www.atlassian.com/git/tutorials/source-code-management

</admon>

Your experience can stay consistent because DVC works [indirectly], by checking
the metafiles and [configuration] of your <abbr>project</abbr> to find out where
and how to handle files. This is transparent to you as user, but it's important
to understand the mechanics in general.

[metafiles]: /doc/user-guide/project-structure
[indirectly]: https://en.wikipedia.org/wiki/Indirection
[configuration]: /doc/command-reference/config

## Storage locations

DVC can manage data anywhere: cloud storage, SSH servers, network resources
(e.g. NAS), mounted drives, local file systems, etc. These locations can be
separated into three groups.

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
