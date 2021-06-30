# Managing Datasets Effectively

**Problem**: managing datasets can be a mess. Are file names important? Where do
you store them? How do you keep track of data [revisions][versioning]? How can
they be shared and who can access them? How should multiple projects reuse them?
Can they be published or plugged into production systems?

> [Data lifecycle](https://www.usgs.gov/products/data-and-tools/data-management/data-lifecycle):
> Plan > Acquire > Process > Analyze > Preserve > Publish/Share

**Solution**: no ad-hoc file names, handle large files and directories (in Git),
smart <abbr>project</abbr> object storage ("cache") with file-level
deduplication (local or shared), minimize data transfers, integrate cloud or
on-premises storage (bring-your-own authorization and sharing config).

Standardized patterns, e.g.:

- Multiple users work on the same shared server.
- A centralized data storage unit or cluster
- There's a single environment with access to production data.
- [Data Registries](/doc/use-cases/data-registries)

**Looks like:**

Work in a simple directory workspace. `dvc add` will handle your data
efficiently. Anyone can `dvc checkout` necessary data later, from other repo
copies, or from other projects altogether. By [linking] files from the
<abbr>cache</abbr>, raw data or any artifacts appear in your
<abbr>workspace</abbr> with near-instantaneous speed. The same when switching
project [versions] or experiment branches, along with the matching data.

> 📖 See [Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
> more details.

Extend these benefits to multiple copies of a project, or even different ones
altogether by configuring a
[shared cache](/doc/user-guide/how-to/share-a-dvc-cache). Centralized data
storage can be easier to manage for typical organizations.
