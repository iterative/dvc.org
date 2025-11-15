# remote add

Add a new `dvc remote` to the <abbr>project</abbr> configuration.

<admon type="tip">

You may also need `dvc remote modify` to provide credentials and/or configure
other remote parameters. See [Remote storage configuration] for more
information.

[remote storage configuration]:
  /user-guide/data-management/remote-storage#configuration

</admon>

## Synopsis

```usage
usage: dvc remote add [-h] [--global | --system | --project | --local]
                      [-q | -v] [-d] [-f]
                      name url

positional arguments:
  name           Name of the remote.
  url            (See supported URLs in the examples below.)
```

## Description

Registers a [remote storage] location to save data files (besides the
<abbr>cache</abbr>) and optionally sets it as the `--default` remote. DVC
remotes can point to a cloud storage service, an SSH server, network-attached
storage, or even a directory in the local file system.

[remote storage]: /user-guide/data-management/remote-storage

<admon type="tip">

A `dvc remote default` is expected by `dvc push`, `dvc pull`, `dvc status`,
`dvc gc`, and `dvc fetch` unless their `--remote` (`-r`) option is used.

</admon>

The remote `name` (required) is used to identify the remote and must be unique.
DVC will determine the [storage type](#supported-storage-types) based on the
provided `url` (also required), a URL or path for the location.

<admon type="info">

The storage type determines which config parameters you can access via
`dvc remote modify`. Note that the `url` itself can be modified.

</admon>

This command creates a [`remote`] section in the project's config file
(`.dvc/config`). The `--default` (`-d`) flag uses the [`core`] config section:

```cli
$ dvc remote add -d temp /tmp/dvcstore
```

```ini
# .dvc/config
['remote "temp"']
    url = /tmp/dvcstore
[core]
    remote = myremote
```

[`remote`]: /user-guide/project-structure/configuration#remote
[`core`]: /user-guide/project-structure/configuration#core

<admon type="info">

If you [installed DVC] via `pip` and plan to use cloud services as remote
storage, you might need to install these optional dependencies: `[s3]`,
`[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Use `[all]` to include them
all. For example:

```cli
$ pip install "dvc[s3]"
```

[installed dvc]: /install

</admon>

## Command options/flags

- `--system` - save remote configuration to the system config file (e.g.
  `/etc/xdg/dvc/config`) instead of `.dvc/config`.

- `--global` - save remote configuration to the global config file (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--project` - save remote configuration to the project's config file
  (`.dvc/config`). This is the default behavior.

- `--local` - save remote configuration to the Git-ignored local config file
  (located in `.dvc/config.local`) instead of `.dvc/config`. This is useful to
  save private remote config that you don't want to track and share with Git.

- `-d`, `--default` - commands that require a remote (such as `dvc pull`,
  `dvc push`, `dvc fetch`) will be using this remote by default to upload or
  download data (unless their `-r` option is used).

  Use `dvc remote default` to unset/change the default remote, for example:
  `dvc remote default --unset` (equivalent to `dvc config -u core.remote`).

- `-f`, `--force` - overwrite existing remote with new `url` value.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Supported storage types

The following are the supported types of storage protocols and platforms.

### Cloud providers

- [Amazon S3] (AWS) and [S3-compatible] e.g. MinIO
- Microsoft [Azure Blob Storage]
- [Google Cloud Storage] (GCP)
- [Google Drive]
- [Aliyun OSS]

[amazon s3]: /user-guide/data-management/remote-storage/amazon-s3
[s3-compatible]:
  /user-guide/data-management/remote-storage/amazon-s3#s3-compatible-servers-non-amazon
[azure blob storage]:
  /user-guide/data-management/remote-storage/azure-blob-storage
[google cloud storage]:
  /user-guide/data-management/remote-storage/google-cloud-storage
[google drive]: /user-guide/data-management/remote-storage/google-drive
[aliyun oss]: /user-guide/data-management/remote-storage/aliyun-oss

### Self-hosted / On-premises

- [SSH]; Like `scp`
- [HDFS] & [WebHDFS]
- [HTTP]
- [WebDAV]

[ssh]: /user-guide/data-management/remote-storage/ssh
[hdfs]: /user-guide/data-management/remote-storage/hdfs
[webhdfs]: /user-guide/data-management/remote-storage/hdfs#webhdfs
[http]: /user-guide/data-management/remote-storage/http
[webdav]: /user-guide/data-management/remote-storage/webdav
