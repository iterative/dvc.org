# Cloud Versioning

When cloud versioning is enabled, DVC will store files in the remote according
to their original directory location and filenames. Different versions of a file
will then be stored as separate versions of the corresponding object in cloud
storage. This is useful for cases where users prefer to retain their original
filenames and directory hierarchy in remote storage (instead of using DVC's
usual
[content-addressable storage](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)
format).

<admon type="warn">

Note that not all DVC functionality is supported when using cloud versioned
remotes, and using cloud versioning comes with the tradeoff of losing certain
benefits of content-addressable storage.

</admon>

<details>

### Expand for more details on the differences between cloud versioned and content-addressable storage

`dvc remote` storage normally uses
[content-addressable storage](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)
to organize versioned data. Different versions of files are stored in the remote
according to hash of their data content instead of according to their original
filenames and directory location. This allows DVC to optimize certain remote
storage lookup and data sync operations, and provides data de-duplication at the
file level. However, this comes with the drawback of losing human-readable
filenames without the use of the DVC CLI (`dvc get --show-url`) or API
(`dvc.api.get_url()`).

When using cloud versioning, DVC does not provide de-duplication, and certain
remote storage performance optimizations will be unavailable.

</details>

## Supported storage providers

Cloud versioning features are only avaible for certain storage providers.
Currently, it is supported on the following `dvc remote` types:

- [Amazon S3] (requires [S3 Versioning] enabled buckets)
- Microsoft [Azure Blob Storage] (requires [Blob versioning] enabled storage
  accounts and containers)
- [Google Cloud Storage] (requires [Object versioning] enabled buckets)

[amazon s3]: /doc/user-guide/data-management/remote-storage/amazon-s3
[s3 versioning]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
[azure blob storage]:
  /doc/user-guide/data-management/remote-storage/azure-blob-storage
[blob versioning]:
  https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview
[google cloud storage]:
  /doc/user-guide/data-management/remote-storage/google-cloud-storage
[object versioning]: https://cloud.google.com/storage/docs/object-versioning

Lifecycle management policies may delete object versions, in which case DVC will
be unable to recover those versions. For more information about lifecycle
management, see:

- [Amazon S3]
- Microsoft [Azure Blob Storage]
- [Google Cloud Storage]

[amazon s3]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
[azure blob storage]:
  https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-policy-configure
[google cloud storage]: https://cloud.google.com/storage/docs/lifecycle

## Version-aware remotes

When the `version_aware` option is enabled on a `dvc remote`:

- `dvc push` will utilize cloud versioning when storing data in the remote. Data
  will retain its original directory structure and filenames, and each version
  of a file tracked by DVC will be stored as a new version of the corresponding
  object in cloud storage.
- `dvc fetch` and `dvc pull` will download the corresponding version of an
  object from cloud storage.

With `version_aware` enabled, `dvc push` will modify <abbr>dvc files</abbr>.
Always `dvc push` before `git commit` so that the updated cloud version info is
available in Git.

<admon type="warn">

Note that when `version_aware` is in use, DVC does not delete current versions
or restore noncurrent versions of objects in cloud storage. So the current
version of an object in cloud storage may not match the version of a file in
your DVC repository.

</admon>

## Importing versioned data

DVC supports importing cloud-versioned data from supported storage providers.
Refer to `dvc import-url` (`--version-aware`) and `dvc update --rev` for more
information.
