# Remote Storage (Optional)

_DVC remotes_ provide additional storage for your data and ML models, and allow
sharing them. For example, you can pull data artifacts created by colleagues
without spending time and resources to recreate them locally. See `dvc push` and
`dvc pull`.

This is similar to how GitHub provides hosting for source code repositories (Git
repos). However, DVC does not provide or recommend a specific storage service.
Instead, it adopts a bring-your-own-platform approach, supporting a
[wide variety of storage types](#supported-storage-types).

<admon type="info">

DVC remotes are similar to [Git remotes], but for <abbr>cached</abbr> data.

[git remotes]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

</admon>

The main uses of remote storage are:

- Synchronize <abbr>cached</abbr> data assets (pull and push).
- Share data in a distributed way to better collaborate.
- Back up your data and its different versions.
- Save space in your working environment (by deleting data that has been
  pushed).

## Configuration

To enable additional storage locations, you can configure remote storage with
the `dvc remote add` and `dvc remote modify` commands (see `dvc remote` for more
options).

## Supported storage types

### Cloud providers

- Google Drive
- Amazon S3 (AWS)
- S3-compatible e.g. MinIO
- Google Cloud Storage (GCP)
- Azure Blob Storage

### Self-hosted

- SSH servers; Like `scp`
- Local directories, mounted drives; Like `rsync`
- Network resources e.g. network-attached storage (NAS) or other external
  devices
