# Data Management with DVC

DVC helps you manage and share arbitrarily large files, datasets, and ML models
anywhere: mounted drives, network resources (e.g. NAS), external devices, or
remotely (SSH servers, cloud storage, etc.). Once the project is configured, you
can manipulate files normally in your local workspace. DVC tracks, restores, and
synchronizes them across locations.

![Storage locations](/img/storage-locations.png) _Local, external, and remote
storage locations_

## The data cache

<abbr>DVC projects</abbr> separate data from code by replacing large files, data
artifacts, ML models, etc. in your <abbr>workspace</abbr> with small
[metafiles]; We call this process _codification_ (of the data). The actual file
contents are cached in an independent data store and linked to your project.

![Code vs. data](/img/code-vs-data.png) _Separating code from data_

<admon type="info">

In order to [avoid duplicate content], and to support
[versioning features](#data-versioning), files and directories are reorganized
in the cache into a [content-addressable structure].

[avoid duplicate content]:
  /doc/user-guide/data-management/large-dataset-optimization

</admon>

DVC expects fast storage access to the <abbr>cache</abbr>, so it's local to the
project by default (found in `.dvc/cache`). It can, however, be moved to an
external location in the file system or network, for example to [share it] among
several projects.

<admon type="tip">

A DVC cache could even be set up in a remote system and accessed through the
internet, but this is typically too slow for working with the data regularly.

</admon>

[metafiles]: /doc/user-guide/project-structure
[share it]: /doc/user-guide/how-to/share-a-dvc-cache
[content-addressable structure]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

## Remote storage

Optionally, DVC supports additional storage locations such as cloud services
(Amazon S3, Google Drive, Azure Blob Storage, etc.), SSH servers, HDFS, and
others. [DVC remotes] are typically used to sync copies of all or some of your
datasets and models, for sharing or backup.

![Distributed collaboration](/img/distributed-collaboration.png) _Distributed
collaboration on DVC projects_

<admon type="info">

Remote storage uses the same [structure][content-addressable structure] of the
data cache.

</admon>

[dvc remotes]: /doc/command-reference/remote

## Data Versioning

DVC brings source code management (SCM) to data science. Specifically, the
metafiles in your repo can be handled with standard [Git workflows] (commits,
branching, pull requests, etc.). This way machine learning teams can apply
mature software engineering practices.

[git workflows]: https://www.atlassian.com/git/tutorials/comparing-workflows

<admon icon="book">

Refer to [Versioning Data and Models] to learn more.

[versioning data and models]: /doc/use-cases/versioning-data-and-models

</admon>

<!--
## Cloud versioning

_New in DVC 2.30.0 (see `dvc version`)_

To simplify remote data operations, DVC now supports native versioning of files
and directories on several cloud providers. This means that you can browse your
files normally as you would see them in your local workspace.
-->
