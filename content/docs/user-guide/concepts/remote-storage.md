---
name: 'Remote Storage'
match:
  [
    'DVC remote',
    'DVC remotes',
    'remote',
    'remote storage',
    'data remote',
    'data remotes',
  ]
tooltip: >-
  DVC remotes provide a location to store and share data and models. You can
  pull data assets created by colleagues from DVC remotes without spending time
  and resources to build or process them locally. Remote storage can also save
  space on your local environment. [📖](/doc/user-guide/concepts/remote-storage)
description: >-
  DVC remotes provide a location to store and share data and models, with
  support for Amazon S3, Google Drive, Azure, and several other remote storage
  providers.
---

<!-- keywords: remote data storage, machine learning model storage, data science collaboration tool, manage external datasets, cloud storage version control, machine learning model management framework, data warehouse, (combine "azure", "s3", or "gcp" with "ML pipeline") -->

# Remote Storage

DVC allows its <abbr>cache</abbr> to reside in the cloud or any other location
outside of the project directory. This allows to keep data secure and utilize
local disk space more effectively.

In principle _remote_ for a resource means _not stored in `.dvc/cache`_. A
remote storage can be in the same disk as the DVC project but is considered
remote as it's not within the <abbr>repository</abbr>.

Remotes provide a consistent way to pull and share data and model files. Two DVC
projects can share a single remote and download only the immediately required
resources for their experiments.

\*_Unlike Git remotes_, DVC remotes are not full copies of a repository. They
are (possibly partial) copies of <abbr>DVC cache</abbr> and contain data files
tracked by DVC. A DVC project can have more than one remote location. Actually
the recommended way is keeping separate remotes for data files and outputs to
avoid any hash collision.

Although a local cache is used by default, DVC allows to use all major cloud
providers as remote locations as well as SSH file servers.

## Further Reading

- `dvc remote` command reference.
- `dvc fetch` command reference.
