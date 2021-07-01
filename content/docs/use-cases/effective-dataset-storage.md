# Effective Dataset Storage

<!-- This should be about efficient, performant data storage. -->

**Problem**: Managing datasets is challenging. Where do you store them? Who has
access? How can others reuse them? Can they be published easily?

**Proposal**: Smart data <abbr>cache</abbr> with file deduplication; use
datasets in-place to minimize data transfers; plug any cloud or on-premises
storage (S3, GDrive, SSH, etc.), with custom auth and sharing config.

![]() _Bring-your-own storage system (NAS, Ceph, EFS, etc.)_

**Solves** (scenarios):

- You want to move data from your machine to an external drive or storage
  service, without losing the ability to use it locally.
- You need to design a system for multiple users collaborating on the same
  datasets.
- You want to combine several data stores into a central location to avoid
  duplication and improve control.
- Your team shares access to a GPU server for ML model training, how do you
  connect it to different data environments (test, shadow, production) to run
  [experiments]?

**Lools like**:

> [Data lifecycle](https://www.usgs.gov/products/data-and-tools/data-management/data-lifecycle):
> Plan > Acquire > Process > Analyze > Preserve > Publish/Share

Anyone can `dvc checkout` necessary data from other repo copies, or from other
projects altogether. By [linking] files from the <abbr>cache</abbr>, raw data or
any artifacts appear in your <abbr>workspace</abbr> with near-instantaneous
speed. The same when switching project [versions] or experiment branches.

> 📖 See [Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
> more details.

Extend these benefits to multiple copies of a project, or even different ones
altogether by configuring a
[shared cache](/doc/user-guide/how-to/share-a-dvc-cache). Centralized data
storage can be easier to manage for typical organizations (e.g.
[Data Registries](/doc/use-cases/data-registries)).
