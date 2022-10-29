# Data Management with DVC

Storing and transferring datasets and ML models can vary depending on project
needs, available infrastructure, etc. DVC helps you avoid logistics like object
permissions on cloud storage, sync tools and schedules, back up snapshots, etc.
and focus on machine learning.

You work with data normally in a local <abbr>workspace</abbr>. DVC tracks,
restores, and synchronize everything with a few, straightforward commands
(similar to Git) that do not change regardless of the underlying file systems,
transfer protocols, etc.

![]() _Separating data from code_

To achieve this, DVC relies on data _codification_: replacing large files and
directories with small [metafiles] that describe the assets. Data files are
moved to a separate <abbr>cache</abbr> but kept virtually (linked) in the
workspace. This **separates your data from code** (including metafiles).

<admon type="tip">

This also allows you to [version] all project files with Git, a battle-tested
[SCM] tool.

</admon>

DVC operations stay the same because they work [indirectly], by going through
the metafiles and [configuration] of your <abbr>project</abbr> to find out where
and how to handle files. This is transparent to you as user, but it's important
to understand the mechanics in general.

## Workflow and benefits

<!-- Focus on (changed) workflows (e.g. from aws s3 cp to dvc get);  It's a big paradigm shift. -->

...

<!-- Benefits (similar to use cases); Indirection: DVC orgs objects into dirs, you deal with project-specific refs; deduplication -->

[metafiles]: /doc/user-guide/project-structure
[indirectly]: https://en.wikipedia.org/wiki/Indirection
[configuration]: /doc/command-reference/config
[version]: /doc/user-guide/data-management/data-versioning
[scm]: https://www.atlassian.com/git/tutorials/source-code-management

## Storage locations

<!-- Too abstract -->

DVC can manage data anywhere: cloud storage, SSH servers, network resources
(e.g. NAS), mounted drives, local file systems, etc. These locations can be
separated into three groups.

<!-- (Relevant) implementation detail? -->

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
