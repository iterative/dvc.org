# Data Management with DVC

DVC helps you manage and share arbitrarily large files, datasets, and ML models
anywhere: mounted drives, Network Attached Storage (NAS), external devices, or
remotely (SSH servers, cloud storage, etc.). Once the project is configured, you
can manipulate files normally in your local workspace, and DVC tracks, restores,
and synchronizes them across locations.

![]() _Figure 1_

## Separating data from code (local cache)

First, large files, data artifacts, ML models are replaced with small
[metafiles]; We call this process _codification_. The actual data files are then
cached by DVC in a separate data store, and linked to your project.

![]() _Figure 2_

All DVC projects need fast storage access to a data <abbr>cache</abbr>. By
default it's local (in `.dvc/cache`), but it can be moved to and external
location in the file system or to a network location, for example to [share it]
among several projects.

A DVC cache could even be setup in a remote system and accessed through the
internet, but this is typically too slow for working with the data regularly.

[metafiles]: /doc/user-guide/project-structure
[share it]: /doc/user-guide/how-to/share-a-dvc-cache

## Remote storage (DVC remotes)

DVC supports remote storage locations like SSH servers or cloud services (Amazon
S3, Google Drive, Azure Blob Storage, etc.). This is mainly useful to upload
copies of your project's cache in order to share and back up all or some of your
datasets and models.

## Data Versioning

DVC applies source code management (SCM) to data and machine learning. The
metafiles in your repo can be handled with standard [Git workflows] ([version
control], branching, pull requests, etc.).

[git workflows]: https://www.atlassian.com/git/tutorials/comparing-workflows
[version control]: /doc/use-cases/versioning-data-and-models

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
