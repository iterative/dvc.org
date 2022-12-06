# Cloud Versioning

`dvc remote` storage normally uses
[content-addressible storage](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)
to organize versioned data. Different versions of files are stored in the remote
according to hash of their data content instead of according to their original
filenames and directory location. This allows DVC to optimize certain remote
storage lookup and data sync operations, and provides data de-duplication at the
file level. However, this comes with the drawback of losing human-readable
filenames without the use of the DVC CLI (`dvc get --show-url`) or API
(`dvc.api.get_url()`).

DVC supports the use of cloud object versioning for cases where users prefer to
retain their original filenames and directory hierarchy in remote storage, in
exchange for losing the de-duplication and performance benefits of
content-addressible storage. When cloud versioning is enabled, DVC will store
files in the remote according to their original directory location and
filenames. Different versions of a file will then be stored as separate versions
of the corresponding object in cloud storage.

⚠️ Note that not all DVC functionality is supported when using cloud versioned
remotes.

## Supported storage providers

Cloud versioning features are only avaible for certain storage providers.
Currently, it is supported on the following `dvc remote` types:

- Amazon S3 (requires
  [S3 Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
  enabled buckets)
- Microsoft Azure Blob Storage (requires
  [Blob versioning](https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview)
  enabled storage accounts and containers)
- Google Cloud Storage (requires
  [Object versioning](https://cloud.google.com/storage/docs/object-versioning)
  enabled buckets)

## Version-aware remotes

When the `version_aware` option is enabled on a `dvc remote`:

- `dvc push` will utilize cloud versioning when storing data in the remote. Data
  will retain its original directory structure and filenames, and each version
  of a file tracked by DVC will be stored as a new version of the corresponding
  object in cloud storage.
- `dvc fetch` and `dvc pull` will download the corresponding version of an
  object from cloud storage.

⚠️ Note that when `version_aware` is in use, DVC does not set DELETE flags on
objects in cloud storage, and does not make any attempt to ensure that the
latest version of an object in cloud storage matches the latest version of a
file in your DVC repository.

## Worktree remotes

When the `worktree` option is enabled on a `dvc remote`:

- `dvc push` will utilize cloud versioning and ensure that the "latest" version
  of the remote storage is a mirror of your current local DVC repository
  workspace. Data in cloud storage will retain its original directory structure
  and filenames, and each version of a file tracked by DVC will be stored as a
  new version of the corresponding object in cloud storage. Additionally, DVC
  will set the DELETE flag on any objects which were present in cloud storage
  but that do not exist in your current DVC repository workspace.
- `dvc fetch` and `dvc pull` will download the corresponding version of an
  object from cloud storage.
- `dvc update` can be used to update a DVC-tracked file or directory in your
  current workspace to match the latest version of the corresponding object(s)
  from cloud storage.

⚠️ Note that setting DELETE flags does not delete any object versions (and does
not delete any data) from cloud storage, it only means that the "latest" version
of a given object will show that the object does not exist.
