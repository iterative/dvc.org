# Data Management with DVC

DVC helps you manage and share arbitrarily large files, datasets, and ML models
anywhere: cloud storage, SSH servers, network resources (e.g. NAS), mounted
drives, local file systems, etc. You manipulate DVC project normally in your
local workspace; DVC tracks, restores, and synchronizes them across locations.

<!--
one story that highlights DVC's workflow with data, building blocks
-->

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

[metafiles]: /doc/user-guide/project-structure
[share it]: /doc/user-guide/how-to/share-a-dvc-cache
[content-addressable structure]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

Optionally, DVC supports additional storage locations such as cloud services
(Amazon S3, Google Drive, Azure Blob Storage, etc.), SSH servers,
network-attached storage, etc. These are called [DVC remotes], and help you to
share or back up copies of your data assets.

<admon type="info">

DVC remotes are similar to Git remotes, but for <abbr>cached</abbr> data.

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
