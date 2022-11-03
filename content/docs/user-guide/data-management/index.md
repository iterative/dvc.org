# Data Management with DVC

DVC fundamentally changes the way you work with datasets and ML models. Let's
look at how this workflow evolves, and why it's important.

The mechanisms to store and transfer large files and directories directly can
vary wildly. For example, you may need to use more than one storage platform,
ending up with data scattered in the cloud and on-prem locations. Other common
problems include:

- You have to access each location with specific tools (AWS CLI, code libraries,
  SCP, etc.)
- This requires knowing the final URL or path of every asset (often hardcoded).
- Controlling who can read and write at folder or file level is difficult.
- Tracking [data versions] typically involves ad hoc file naming schemes that
  don't scale.
- It's easy to lose track of which data produced what results, hindering
  reproducibility.

To address these pain points and help you focus on machine learning work, DVC
introduces a layer of _indirection_: raw data, models, and other artifacts are
[separated](#separating-data-from-code-codification) from your project's code.
This has a number of implications, but it's a small cost to improve your
productivity:

1. You have to set up a <abbr>DVC project</abbr> and its
   [storage locations](#storage-locations).
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
   <!-- In cloud versioning they can be accessed directly. -->
1. Everything happens though a code repository that can be controlled with Git.

[data versions]: /doc/use-cases/versioning-data-and-models
[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

## Benefits

Besides the basic solutions outlined before, there are several more benefits to
DVC's approach:

- You work with data in a local <abbr>workspace</abbr>, as with any other files;
  You deal with project-specific file paths and forget about complicated [URIs].
- DVC tracks, restores, and synchronize everything with a few straightforward
  operations that do not change regardless of file systems, transfer protocols,
  etc.
- Standard [project versions] (Git commits) guarantee reproducibility of ML
  processes (e.g. training models with the same datasets, hyperparametes, and
  features).
- Your storage space is [used efficiently] (file deduplication); Your project
  repo stays small.
- [Fast caching], [data registries], [model registries], [CI/CD for ML], and
  more!

[uris]: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
[project versions]: /doc/user-guide/data-management/data-versioning
[used efficiently]: /doc/user-guide/data-management/large-dataset-optimization
[fast caching]: /doc/use-cases/fast-data-caching-hub
[data registries]: /doc/use-cases/data-registry
[model registries]: /doc/use-cases/model-registry
[ci/cd for ml]: https://cml.dev/

## Separating data from code (codification)

DVC replaces large files and directories with small [metafiles] that describe
the assets. We call this _data codification_. Data files are moved to a separate
<abbr>cache</abbr> but kept virtually (linked) in the workspace. This separates
your data from code (including metafiles).

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
