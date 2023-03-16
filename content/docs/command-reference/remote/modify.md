# remote modify

Configure an existing `dvc remote`.

<admon type="tip">

This command is commonly needed after `dvc remote add` to set up credentials or
other customizations. See [Remote storage configuration] for more information.

[remote storage configuration]:
  /doc/user-guide/data-management/remote-storage#configuration

</admon>

## Synopsis

```usage
usage: dvc remote modify [-h] [--global | --system | --project | --local]
                         [-q | -v] [-u]
                         name option [value]

positional arguments:
  name           Name of the remote
  option         Name of the option to modify
  value          (optional) Value of the option
```

## Description

The DVC remote's `name` and a valid `option` to modify are required. Most
[config parameters](#available-parameters-per-storage-type) are specific to the
[storage type](#supported-storage-types).

This command updates a [`remote`] section in the [config file] (`.dvc/config`):

```cli
$ dvc remote modify temp url /mnt/c/tmp/dvcstore
```

```git
# .dvc/config
['remote "temp"']
-     url = /tmp/dvcstore
+     url = /mnt/c/tmp/dvcstore
```

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

[`remote`]: /doc/user-guide/project-structure/configuration#remote
[config file]: /doc/user-guide/project-structure/configuration

## Command options/flags

- `-u`, `--unset` - remove the configuration `option` from a config file. Don't
  provide a `value` argument when employing this flag.

- `--system` - modify the system config file (e.g. `/etc/xdg/dvc/config`)
  instead of `.dvc/config`.

- `--global` - modify the global config file (e.g. `~/.config/dvc/config`)
  instead of `.dvc/config`.

- `--project` - modify the project's config file (`.dvc/config`). This is the
  default behavior.

- `--local` - modify the Git-ignored local config file (located in
  `.dvc/config.local`) instead of `.dvc/config`. This is useful to save private
  remote config that you don't want to track and share with Git (credentials,
  private locations, etc.).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Available parameters for all remotes

The following config options are available for all remote types:

- `url` - the remote location (URL or path) can always be modified. See each
  type in the next section for valid URL formats.

  <admon type="info">

  This is how DVC determines what type of remote this is, and thus which other
  config options can be modified.

  </admomn>

- `jobs` - change the default number of processes for remote storage
  synchronization operations (see the `--jobs` option of `dvc push`, `dvc pull`,
  `dvc get`, `dvc import`, `dvc update`, `dvc add --to-remote`, `dvc gc -c`,
  etc.). Accepts positive integers. The default is `4 * cpu_count()`.

  ```cli
  $ dvc remote modify myremote jobs 8
  ```

- `verify` - set to `true` for `dvc pull` and `dvc fetch` to recalculate file
  hashes to check whether their contents have changed (compared to the values
  saved in the corresponding <abbr>metafile</abbr>). This may slow down the
  operations.

  <admon type="info">

  Note that this option is enabled on **Google Drive** remotes by default.

  </admon>

  ```cli
  $ dvc remote modify myremote verify true
  ```

## Supported storage types

Each type of storage has different config options you can set. See all the
details in the pages linked below.

### Cloud providers

- [Amazon S3] (AWS) and [S3-compatible] e.g. MinIO
- Microsoft [Azure Blob Storage]
- [Google Cloud Storage] (GCP)
- [Google Drive]
- [Aliyun OSS]

[amazon s3]: /doc/user-guide/data-management/remote-storage/amazon-s3
[s3-compatible]:
  /doc/user-guide/data-management/remote-storage/amazon-s3#s3-compatible-servers-non-amazon
[azure blob storage]:
  /doc/user-guide/data-management/remote-storage/azure-blob-storage
[google cloud storage]:
  /doc/user-guide/data-management/remote-storage/google-cloud-storage
[google drive]: /doc/user-guide/data-management/remote-storage/google-drive
[aliyun oss]: /doc/user-guide/data-management/remote-storage/aliyun-oss

### Self-hosted / On-premises

- [SSH]; Like `scp`
- [HDFS] & [WebHDFS]
- [HTTP]
- [WebDAV]

[ssh]: /doc/user-guide/data-management/remote-storage/ssh
[hdfs]: /doc/user-guide/data-management/remote-storage/hdfs
[webhdfs]: /doc/user-guide/data-management/remote-storage/hdfs#webhdfs
[http]: /doc/user-guide/data-management/remote-storage/http
[webdav]: /doc/user-guide/data-management/remote-storage/webdav

## Example: Some Azure authentication methods

Using a default identity (e.g. credentials set by `az cli`):

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify myremote account_name 'myaccount'
$ dvc push
```

> Note that this may require the `Storage Blob Data Contributor` and other roles
> on the account.

Using a `connection_string`:

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify --local myremote connection_string 'mysecret'
$ dvc push
```

Using `account_key`:

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify --local myremote account_name 'myaccount'
$ dvc remote modify --local myremote account_key 'mysecret'
$ dvc push
```

Using `sas_token`:

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify --local myremote account_name 'myaccount'
$ dvc remote modify --local myremote sas_token 'mysecret'
$ dvc push
```
