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
contents are cached in an independent data store and [linked] to your project.

![Code vs. data](/img/code-vs-data.png) _Separating code from data_

<admon type="info">

In order to [avoid duplicate content][linked], and to support
[versioning features](#data-versioning), files and directories are reorganized
in the cache into a [content-addressable structure].

[linked]: /doc/user-guide/data-management/large-dataset-optimization

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
others. [DVC remotes] are typically used to share or back up copies of all or
some of your data sets and models.

![Distributed collaboration](/img/distributed-collaboration.png) _Distributed
collaboration on DVC projects_

<admon type="info">

DVC remotes are similar to Git remotes, but for <abbr>cached</abbr> assets. This
means that they use the same [directory
structure][content-addressable structure] as the data cache.

</admon>

[dvc remotes]: /doc/command-reference/remote

## Data Versioning

DVC enables [version control] for data science. But DVC does not actually
implement versioning features! Instead, DVC focuses on codification, generating
small [metafiles] that you can handle with standard [Git workflows] (commits,
branching, pull requests, etc.). This way machine learning teams can apply
mature software engineering practices.

![Versioned ML project](/img/versioned-project.png) _Navigate versions with Git
commits_

The resulting projects are neatly organized in the "space dimension", having
only the files and directories needed at the time and without complicated, ad
hoc file names like `2022-10-20_linear-model_v2-Carl`. Project versions live in
the "time dimension" ([Git history]).

<admon icon="book">

Refer to [Versioning Data and Models] to learn more.

[versioning data and models]: /doc/use-cases/versioning-data-and-models

</admon>

[version control]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
[git workflows]: https://www.atlassian.com/git/tutorials/comparing-workflows
[git history]:
  https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History

<!--
## Cloud versioning

_New in DVC 2.30.0 (see `dvc version`)_

To simplify remote data operations, DVC now supports native versioning of files
and directories on several cloud providers. This means that you can browse your
files normally as you would see them in your local workspace.
-->

The next page will cover the basic operations related to all the parts explained
above.
