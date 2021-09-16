# remote add

Add a new [data remote](/doc/command-reference/remote).

> Depending on your storage type, you may also need `dvc remote modify` to
> provide credentials and/or configure other remote parameters.

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

This command creates a `remote` section in the <abbr>DVC project</abbr>'s
[config file](/doc/command-reference/config) and optionally assigns a _default
remote_ in the `core` section, if the `--default` option is used (recommended
for the first remote):

```ini
['remote "myremote"']
url = /tmp/dvcstore
[core]
remote = myremote
```

> 💡 Default remotes are expected by commands that accept a `-r`/`--remote`
> option (`dvc pull`, `dvc push`, `dvc status`, `dvc gc`, `dvc fetch`) when that
> option is omitted.

`name` and `url` are required. The `name` is used to identify the remote and
must be unique for the project.

`url` specifies a location to store your data. It can represent a cloud storage
service, an SSH server, network-attached storage, or even a directory in the
local file system (see all the supported remote storage types in the examples
below).

DVC will determine the [type of remote](#supported-storage-types) based on the
`url` provided. This may affect which parameters you can access later via
`dvc remote modify` (note that the `url` itself can be modified).

> If you installed DVC via `pip` and plan to use cloud services as remote
> storage, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to
> include them all. The command should look like this: `pip install "dvc[s3]"`.
> (This example installs `boto3` library along with DVC to support S3 storage.)

## Options

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

The following are the types of remote storage (protocols) supported:

<details>

### Click for Amazon S3

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
$ dvc remote add -d myremote s3://mybucket/path
```

By default, DVC authenticates using your AWS CLI
[configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
(if set). This uses the default AWS credentials file. To use a custom
authentication method, use the parameters described in `dvc remote modify`.

Make sure you have the following permissions enabled: `s3:ListBucket`,
`s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`. This enables the S3 API
methods that are performed by DVC (`list_objects_v2` or `list_objects`,
`head_object`, `upload_file`, `download_file`, `delete_object`, `copy`).

> See `dvc remote modify` for a full list of S3 parameters.

</details>

<details>

### Click for S3-compatible storage

For object storage that supports an S3-compatible API (e.g.
[Minio](https://min.io/),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) etc.),
configure the `endpointurl` parameter. For example, let's set up a DigitalOcean
"space" (equivalent to a bucket in S3) called `mystore` that uses the `nyc3`
region:

```dvc
$ dvc remote add -d myremote s3://mystore/path
$ dvc remote modify myremote endpointurl \
                             https://nyc3.digitaloceanspaces.com
```

By default, DVC authenticates using your AWS CLI
[configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
(if set). This uses the default AWS credentials file. To use a custom
authentication method, use the parameters described in `dvc remote modify`.

Any other S3 parameter can also be set for S3-compatible storage. Whether
they're effective depends on each storage platform.

</details>

<details>

### Click for Microsoft Azure Blob Storage

```dvc
$ dvc remote add -d myremote azure://mycontainer/path
$ dvc remote modify myremote account_name 'myuser'
```

By default, DVC authenticates using an `account_name` and its [default
credential] (if any), which uses environment variables (e.g. set by `az cli`) or
a Microsoft application.

[default credential]:
  https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential

To use a custom authentication method, use the parameters described in
`dvc remote modify`. See some
[examples](/doc/command-reference/remote/modify#example-some-azure-authentication-methods).

</details>

<details>

### Click for Google Drive

To start using a GDrive remote, first add it with a
[valid URL format](/doc/user-guide/setup-google-drive-remote#url-format). Then
use any DVC command that needs to connect to it (e.g. `dvc pull` or `dvc push`
once there's tracked data to synchronize). For example:

```dvc
$ dvc remote add -d myremote gdrive://0AIac4JZqHhKmUk9PDA/dvcstore
$ dvc push  # Assuming there's data to push

Go to the following link in your browser:

    https://accounts.google.com/o/oauth2/auth # ... copy this link

Enter verification code: # <- enter resulting code
```

See `dvc remote modify` for a list of other GDrive parameters, or
[Set up a Google Drive DVC Remote](/doc/user-guide/setup-google-drive-remote)
for a full guide on using Google Drive as DVC remote storage.

Note that GDrive remotes are not "trusted" by default. This means that the
[`verify`](/doc/command-reference/remote/modify#available-parameters-for-all-remotes)
parameter is enabled on this type of storage, so DVC recalculates the file
hashes upon download (e.g. `dvc pull`), to make sure that these haven't been
modified.

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).

</details>

<details>

### Click for Google Cloud Storage

> 💡 Before adding a GC Storage remote, be sure to
> [Create a storage bucket](https://cloud.google.com/storage/docs/creating-buckets).

```dvc
$ dvc remote add -d myremote gs://mybucket/path
```

By default, DVC expects your GCP CLI is already
[configured](https://cloud.google.com/sdk/docs/authorizing). DVC will be using
default GCP key file to access Google Cloud Storage. To override some of these
parameters, use the parameters described in `dvc remote modify`.

> Make sure to run `gcloud auth application-default login` unless you use
> `GOOGLE_APPLICATION_CREDENTIALS` and/or service account, or other ways to
> authenticate. See details [here](https://stackoverflow.com/a/53307505/298182).

</details>

<details>

### Click for Aliyun OSS

First you need to set up OSS storage on Aliyun Cloud. Then, use an S3 style URL
for OSS storage, and configure the
[endpoint](https://www.alibabacloud.com/help/doc-detail/31837.html):

```dvc
$ dvc remote add -d myremote oss://mybucket/path
$ dvc remote modify myremote oss_endpoint endpoint
```

To set key id, key secret and endpoint (or any other OSS parameter), use
`dvc remote modify`. Example usage is show below. Make sure to use the `--local`
option to avoid committing your secrets with Git:

```dvc
$ dvc remote modify myremote --local oss_key_id 'mykey'
$ dvc remote modify myremote --local oss_key_secret 'mysecret'
```

**Testing your OSS storage using docker**

Start a container running an OSS emulator, and set up the environment variables,
for example:

```dvc
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

### Click for SSH

```dvc
$ dvc remote add -d myremote ssh://user@example.com/path
```

> See `dvc remote modify` for a full list of SSH parameters.

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Please check that you are able to connect both ways with tools like `ssh` and
`sftp` (GNU/Linux).

> Note that the server's SFTP root might differ from its physical root (`/`).

</details>

<details>

### Click for HDFS

HDFS might require additional setup. Our assumption with HDFS is that the client
is set up to use it and DVC can rely on the same libraries. See more details
[here](https://github.com/iterative/dvc/issues/5858#issuecomment-824216700).

💡 Using an HDFS cluster as remote storage is also supported via the WebHDFS
API. Read more about it by expanding the WebHDFS section below.

```dvc
$ dvc remote add -d myremote hdfs://user@example.com/path
```

> See `dvc remote modify` for a full list of HDFS parameters.

</details>

<details>

### Click for WebHDFS

**HDFS and WebHDFS:**

Both remotes, HDFS and WebHDFS, allow using a Hadoop cluster as a remote
repository. However, HDFS relies on `pyarrow` which in turn requires `libhdfs`,
an interface to the Java Hadoop client, that must be installed separately.
Meanwhile, WebHDFS has no need for this requirement as it communicates with the
Hadoop cluster via a HTTP REST API using the Python libraries `HdfsCLI` and
`requests`. The latter remote should be preferred by users who seek easier and
more portable setups, at the expense of performance due to the added overhead of
HTTP.

One last note: WebHDFS does require enabling the HTTP REST API in the cluster by
setting the configuration property `dfs.webhdfs.enabled` to `true` in
`hdfs-site.xml`.

```dvc
$ dvc remote add -d myremote webhdfs://user@example.com/path
$ dvc remote modify --local myremote user myuser
$ dvc remote modify --local myremote token 'mytoken'
```

> The user name and password may contain sensitive user info. Therefore, it's
> safer to add it with the `--local` option, so it's written to a Git-ignored
> config file. See `dvc remote modify` for a full list of WebHDFS parameters.

</details>

<details>

### Click for HTTP

```dvc
$ dvc remote add -d myremote https://example.com/path
```

> See `dvc remote modify` for a full list of HTTP parameters.

</details>

<details>

### Click for WebDAV

```dvc
$ dvc remote add -d myremote \
                    webdavs://example.com/owncloud/remote.php/dav
```

If your remote is located in a subfolder of your WebDAV server e.g.
`files/myuser`, this path may be appended to the base URL:

```dvc
$ dvc remote add -d myremote \
      webdavs://example.com/owncloud/remote.php/dav/files/myuser
```

> See `dvc remote modify` for a full list of WebDAV parameters.

</details>

<details>

### Click for local remote

A "local remote" is a directory in the machine's file system. Not to be confused
with the `--local` option of `dvc remote` commands!

> While the term may seem contradictory, it doesn't have to be. The "local" part
> refers to the type of location where the storage is: another directory in the
> same file system. "Remote" is how we call storage for <abbr>DVC
> projects</abbr>. It's essentially a local backup for data tracked by DVC.

Using an absolute path (recommended):

```dvc
$ dvc remote add -d myremote /tmp/dvcstore
$ cat .dvc/config
  ...
  ['remote "myremote"']
        url = /tmp/dvcstore
  ...
```

> Note that the absolute path `/tmp/dvcstore` is saved as is.

Using a relative path. It will be resolved against the current working
directory, but saved **relative to the config file location**:

```dvc
$ dvc remote add -d myremote ../dvcstore
$ cat .dvc/config
  ...
  ['remote "myremote"']
      url = ../../dvcstore
  ...
```

> Note that `../dvcstore` has been resolved relative to the `.dvc/` dir,
> resulting in `../../dvcstore`.

</details>

## Example: Customize an S3 remote

Add an Amazon S3 remote as the _default_ (via the `-d` option), and modify its
region.

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
$ dvc remote add -d myremote s3://mybucket/path
Setting 'myremote' as a default remote.

$ dvc remote modify myremote region us-east-2
```

The <abbr>project</abbr>'s config file (`.dvc/config`) now looks like this:

```ini
['remote "myremote"']
url = s3://mybucket/path
region = us-east-2
[core]
remote = myremote
```

The list of remotes should now be:

```dvc
$ dvc remote list
myremote	s3://mybucket/path
```

You can overwrite existing remotes using `-f` with `dvc remote add`:

```dvc
$ dvc remote add -f myremote s3://mybucket/another-path
```

List remotes again to view the updated remote:

```dvc
$ dvc remote list
myremote	s3://mybucket/another-path
```
