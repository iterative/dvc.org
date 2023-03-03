# remote add

Add a new `dvc remote` to the <abbr>project</abbr> configuration.

<admon type="tip">

You may also need `dvc remote modify` to provide credentials and/or configure
other remote parameters. See [Remote storage configuration] for more
information.

[remote storage configuration]:
  /doc/user-guide/data-management/remote-storage#configuration

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

Registers an [additional storage] location to save data files (besides the
<abbr>cache</abbr>) and optionally sets it as the `--default` remote. DVC
remotes can point to a cloud storage service, an SSH server, network-attached
storage, or even a directory in the local file system.

[additional storage]: /doc/user-guide/data-management/remote-storage

<admon type="tip">

A [default remote] is expected by `dvc push`, `dvc pull`, `dvc status`,
`dvc gc`, and `dvc fetch` unless their `--remote` option is used.

[default remote]: /doc/command-reference/remote/default

</admon>

The remote `name` (required) is used to identify the remote and must be unique.
DVC will determine the [storage type](#supported-storage-types) based on the
provided `url` (also required), a URL or path for the location.

<admon type="info">

The storage type determines which config parameters you can access via
`dvc remote modify`. Note that the `url` itself can be modified.

</admon>

This command creates a [`remote`] section in the project's [config file]
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

[config file]: /doc/command-reference/config
[`remote`]: /doc/command-reference/config#remote
[`core`]: /doc/command-reference/config#core

<admon type="info">

If you [installed DVC] via `pip` and plan to use cloud services as remote
storage, you might need to install these optional dependencies: `[s3]`,
`[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Use `[all]` to include them
all. For example:

```cli
$ pip install "dvc[s3]"
```

[installed dvc]: /doc/install

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

[amazon s3]: /doc/user-guide/data-management/remote-storage/amazon-s3
[s3-compatible]:
  /doc/user-guide/data-management/remote-storage/amazon-s3#s3-compatible-servers-non-amazon
[azure blob storage]:
  /doc/user-guide/data-management/remote-storage/azure-blob-storage
[google cloud storage]:
  /doc/user-guide/data-management/remote-storage/google-cloud-storage
[google drive]: /doc/user-guide/data-management/remote-storage/google-drive

<details>

### Aliyun OSS

First you need to set up OSS storage on Aliyun Cloud. Then, use an S3 style URL
for OSS storage, and configure the
[endpoint](https://www.alibabacloud.com/help/doc-detail/31837.html):

```cli
$ dvc remote add -d myremote oss://mybucket/path
$ dvc remote modify myremote oss_endpoint endpoint
```

To set key id, key secret and endpoint (or any other OSS parameter), use
`dvc remote modify` as show below. Use the `--local` option to avoid committing
your secrets to Git:

```cli
$ dvc remote modify --local myremote oss_key_id 'mykey'
$ dvc remote modify --local myremote oss_key_secret 'mysecret'
```

**Testing your OSS storage using docker**

Start a container running an OSS emulator, and set up the environment variables,
for example:

```cli
$ git clone https://github.com/nanaya-tachibana/oss-emulator.git
$ docker image build -t oss:1.0 oss-emulator
$ docker run --detach -p 8880:8880 --name oss-emulator oss:1.0
$ export OSS_BUCKET='mybucket'
$ export OSS_ENDPOINT='endpoint'
$ export OSS_ACCESS_KEY_ID='mykey'
$ export OSS_ACCESS_KEY_SECRET='mysecret'
```

> Uses default key id and key secret when they are not given, which gives read
> access to public read bucket and public bucket.

</details>

<details>

### SSH

```cli
$ dvc remote add -d myremote ssh://user@example.com/path
```

> See `dvc remote modify` for a full list of SSH parameters.

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Check that you can connect both ways with tools like `ssh` and `sftp`
(GNU/Linux).

> Note that the server's SFTP root might differ from its physical root (`/`).

</details>

<details>

### HDFS

⚠️ Using HDFS with a Hadoop cluster might require additional setup. Our
assumption is that the client is set up to use it. Specifically, [`libhdfs`]
should be installed.

[`libhdfs`]:
  https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/LibHdfs.html

💡 Using an HDFS cluster as remote storage is also supported via the WebHDFS
API. Read more about it by expanding the WebHDFS section below.

```cli
$ dvc remote add -d myremote hdfs://user@example.com/path
```

> See `dvc remote modify` for a full list of HDFS parameters.

</details>

<details>

### WebHDFS

⚠️ Using WebHDFS requires to enable REST API access in the cluster: set the
config property `dfs.webhdfs.enabled` to `true` in `hdfs-site.xml`.

If your cluster is secured, then WebHDFS is commonly used with Kerberos and
HTTPS. To enable these for the DVC remote, set `use_https` and `kerberos` to
`true`.

```cli
$ dvc remote add -d myremote webhdfs://example.com/path
$ dvc remote modify myremote use_https true
$ dvc remote modify myremote kerberos true
$ dvc remote modify --local myremote token SOME_BASE64_ENCODED_TOKEN
```

💡 You may want to run `kinit` before using the remote to make sure you have an
active kerberos session.

> `token` contains sensitive user info. Therefore, it's safer to add it with the
> `--local` option, so it's written to a Git-ignored config file.

> See `dvc remote modify` for a full list of WebHDFS parameters.

</details>

<details>

### HTTP

```cli
$ dvc remote add -d myremote https://example.com/path
```

> See `dvc remote modify` for a full list of HTTP parameters.

</details>

<details>

### WebDAV

```cli
$ dvc remote add -d myremote \
                    webdavs://example.com/owncloud/remote.php/dav
```

If your remote is located in a subfolder of your WebDAV server e.g.
`files/myuser`, this path may be appended to the base URL:

```cli
$ dvc remote add -d myremote \
      webdavs://example.com/owncloud/remote.php/dav/files/myuser
```

> See `dvc remote modify` for a full list of WebDAV parameters.

</details>
