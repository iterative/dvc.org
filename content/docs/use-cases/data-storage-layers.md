# Data Storage Layers

**Problem**: Collaborative dataset storage can be challenging. What
infrastructure should you provision? How do you optimize transfer speeds? Can
you avoid data duplication? Who has read or write access?

**Proposal**: Separate your data science project from file storage. Define one
or two flexible storage layers, and let DVC connect them to your project. Their
location can be local or remote; their purpose primary or secondary.

![](/img/storage-layers.png) _Storage infrastructure possibilities_

**Scenarios**:

- You need to design a system for multiple users collaborating on the same
  datasets.
- Communicating with your existing storage (e.g. Amazon S3) takes too long. Can
  you introduce a local storage cache layer for faster access?
- You want to move data from your machine to an external drive without losing
  the ability to use it locally.
- Your team shares access to a GPU server to train machine learning models, how
  do you connect different datasets to run [experiments]?

**Solutions**:

DVC converts your initial data, intermediate artifacts, and final ML models into
storage objects automatically. These are <abbr>cached</abbr> by unique file
contents and mapped back to your project's files and directories. This enforces
file deduplication, and minimizes transfers by using cached data in-place via
file links.

Plug any cloud or on-premises storage (S3, GDrive, SSH, etc.), with custom auth
and sharing config. A `dvc remote` can be setup in any supported storage
platform as well.

![]() _Bring-your-own storage system (NAS, Ceph, EFS, etc.)_

Anyone can `dvc checkout` necessary data from other repo copies, or from other
projects altogether. By [linking] files from the <abbr>cache</abbr>, raw data or
any artifacts appear in your <abbr>workspace</abbr> with near-instantaneous
speed.

> The same applies when switching project [versions] or experiment branches.  
> 📖 See [Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
> more details.
