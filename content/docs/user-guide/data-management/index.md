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

[share it]: /doc/user-guide/how-to/share-a-dvc-cache

Optionally, DVC supports additional storage locations such as cloud services
(Amazon S3, Google Drive, Azure Blob Storage, etc.), SSH servers,
network-attached storage, etc. These are called [DVC remotes], and help you to
share or back up copies of your data assets.

<admon type="info">

DVC remotes are similar to Git remotes, but for <abbr>cached</abbr> data.

</admon>

[dvc remotes]: /doc/user-guide/data-management/remote-storage
