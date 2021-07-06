# Data Storage Layers

**Problem**: Collaborative dataset and ML model storage can be challenging. What
infrastructure should you provision? How do you optimize transfer speeds? Can
you avoid data duplication? Who has read or write access?

**Proposal**: Separate your data science project from file storage. Define one
or two flexible storage layers, and let DVC connect them to your project. Their
location can be local or remote; their purpose primary or secondary.

![](/img/storage-layers.png) _Possible placement of storage infrastructure_

**Scenarios**:

- You need to design a system for multiple people working on the same datasets.
- Transfers to/from cloud storage (e.g. Amazon S3) takes too long. Can you
  easily introduce a local cache layer for faster access?
- You want to move data from your machine to an external drive without losing
  the ability to use it locally.
- Your team shares access to a GPU server for machine learning [experiments].
  How do you connect different datasets?

[experiments]: #

**Solution**:

DVC converts your raw data, intermediate artifacts, and final ML models into
unique storage objects automatically, separating storage from other aspects of
your project. <abbr>Cached</abbr> files and directories are mapped back to your
<abbr>workspace</abbr> directory using [file links]. This optimizes storage by
avoiding file duplicates, and by minimizing future transfers.

[file links]:
  /doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache

There are several ways to make the most out of DVC storage features. One is to
configure a [shared cache](/doc/user-guide/how-to/share-a-dvc-cache) among
multiple <abbr>projects</abbr>, which compounds the deduplication and
performance benefits. Accessing the data is as fast as the location where you
set this common storage, e.g. a network-attached storage (NAS) or an SSH server
in the local network.

Going a step further and making DVC storage global for all your teams' projects,
it can become an independent layer in your infrastructure. For example, you can
use Ceph, EFS, cloud object storage, etc. and setup your own access controls as
supported by that platform.

![]() _Bring-your-own storage system and authentication_
