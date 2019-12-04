# remote add

Add a new data remote.

> Depending on your storage type, you may also need `dvc remote modify` to
> provide credentials and/or configure other remote parameters.

See also [default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list),
[modify](/doc/command-reference/remote/modify), and
[remove](/doc/command-reference/remote/remove) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote add [-h] [--global] [--system] [--local] [-q | -v]
                      [-d] [-f] name url

positional arguments:
  name           Name of the remote.
  url            URL. (See supported URLs in the examples below.)
```

## Description

`name` and `url` are required. `url` specifies a location to store your data. It
can be an SSH, S3 path, Azure, Google Drive path, Google Cloud address, Aliyun
OSS, local directory, etc. (See all the supported remote storage types in the
examples below.) If `url` is a local relative path, it will be resolved relative
to the current working directory but saved **relative to the config file
location** (see LOCAL example below). Whenever possible DVC will create a remote
directory if it doesn't exists yet. It won't create an S3 bucket though and will
rely on default access settings.

> If you installed DVC via `pip`, depending on the remote storage type you plan
> to use you might need to install optional dependencies: `[s3]`, `[ssh]`,
> `[gs]`, `[azure]`, `[gdrive]`, and `[oss]`; or `[all]` to include them all.
> The command should look like this: `pip install "dvc[s3]"`. This installs
> `boto3` library along with DVC to support Amazon S3 storage.

This command creates a section in the <abbr>DVC project</abbr>'s
[config file](/doc/command-reference/config) and optionally assigns a default
remote in the core section if the `--default` option is used:

```ini
['remote "myremote"']
url = /tmp/dvc-storage
[core]
remote = myremote
```

DVC supports the concept of a _default remote_. For the commands that accept a
`--remote` option (`dvc pull`, `dvc push`, `dvc status`, `dvc gc`, `dvc fetch`),
the default remote is used if that option is not used.

Use `dvc config` to unset/change the default remote as so:
`dvc config -u core.remote`.

## Options

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

- `-d`, `-default` - commands that require a remote (such as `dvc pull`,
  `dvc push`, `dvc fetch`) will be using this remote by default to upload or
  download data (unless their `-r` option is used).

- `-f`, `--force` - overwrite existing remote with new `url` value.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Supported storage types

These are the possible remote storage (protocols) DVC can work with:

<details>

### Click for local remote

A "local remote" is a directory in the machine's file system.

> While the term may seem contradictory, it doesn't have to be. The "local" part
> refers to the machine where the project is stored, so it can be any directory
> accessible to the same system. The "remote" part refers specifically to the
> project/repository itself.

Using an absolute path (recommended):

```dvc
$ dvc remote add myremote /tmp/my-dvc-storage
$ cat .dvc/config
  ...
  ['remote "myremote"']
        url = /tmp/my-dvc-storage
  ...
```

> Note that the absolute path `/tmp/my-dvc-storage` is saved as is.

Using a relative path:

```dvc
$ dvc remote add myremote ../my-dvc-storage
$ cat .dvc/config
  ...
  ['remote "myremote"']
      url = ../../my-dvc-storage
  ...
```

> Note that `../my-dvc-storage` has been resolved relative to the `.dvc/` dir,
> resulting in `../../my-dvc-storage`.

</details>

<details>

### Click for Amazon S3

> **Note!** Before adding a new remote be sure to login into AWS services and
> follow instructions at
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
> to create your bucket.

```dvc
$ dvc remote add myremote s3://bucket/path
```

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
DVC will be using default AWS credentials file to access S3. To override some of
these settings, use the options described in `dvc remote modify`.

We use the `boto3` library to communicate with AWS. The following API methods
are performed:

- `list_objects_v2`, `list_objects`
- `head_object`
- `download_file`
- `upload_file`
- `delete_object`
- `copy`

So, make sure you have the following permissions enabled:

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`

</details>

<details>

### Click for S3 API compatible storage

To communicate with a remote object storage that supports an S3 compatible API
(e.g. [Minio](https://min.io/),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) etc.) you
must explicitly set the `endpointurl` in the configuration:

For example:

```dvc
$ dvc remote add -d myremote s3://mybucket/path/to/dir
$ dvc remote modify myremote endpointurl https://object-storage.example.com
```

S3 remotes can also be configured entirely via environment variables:

```dvc
$ export AWS_ACCESS_KEY_ID="<my-access-key>"
$ export AWS_SECRET_ACCESS_KEY="<my-secret-key>"
$ dvc remote add myremote "s3://bucket/myremote"
```

For more information about the variables DVC supports, please visit
[boto3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#environment-variable-configuration)

</details>

<details>

### Click for Azure

```dvc
$ dvc remote add myremote azure://my-container-name/path
$ dvc remote modify myremote connection_string my-connection-string --local
```

> The connection string contains access to data and is inserted into the
> `.dvc/config` file. Therefore, it is safer to add the connection string with
> the `--local` option, enforcing it to be written to a Git-ignored config file.

The Azure Blob Storage remote can also be configured entirely via environment
variables:

```dvc
$ export AZURE_STORAGE_CONNECTION_STRING="<my-connection-string>"
$ export AZURE_STORAGE_CONTAINER_NAME="my-container-name"
$ dvc remote add myremote "azure://"
```

> For more information on configuring Azure Storage connection strings, visit
> [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string).

- `connection string` - this is the connection string to access your Azure
  Storage Account. If you don't already have a storage account, you can create
  one following
  [these instructions](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account).
  The connection string can be found in the "Access Keys" pane of your Storage
  Account resource in the Azure portal.

- `container name` - this is the top-level container in your Azure Storage
  Account under which all the files for this remote will be uploaded. If the
  container doesn't already exist, it will be created automatically.

</details>

<details>

### Click for Google Drive

> Since Google Drive has tight API usage quotas, creation and configuration of
> your own `Google Project` is required:

> 1. Log into the [Google Cloud Platform](https://console.developers.google.com)
>    account associated with Google Drive you want to use as remote.
> 2. Create `New Project` or select available one.
> 3. Click `ENABLE APIS AND SERVICES` and search for `drive` to enable
>    `Google Drive API` from search results.
> 4. Navigate to
>    [All Credentials](https://console.developers.google.com/apis/credentials)
>    page and click `Create Credentials` to select `OAuth client ID`. It might
>    ask you to setup a product name on the consent screen.
> 5. Select `Other` for `Application type` and click `Create` to proceed with
>    default `Name`.
> 6. `client id` and `client secret` should be showed to you. Use them for
>    further DVC's configuration.

```dvc
$ dvc remote add myremote gdrive://root/my-dvc-root
$ dvc remote modify myremote gdrive_client_id my_gdrive_client_id
$ dvc remote modify myremote gdrive_client_secret gdrive_client_secret
```

</details>

<details>

### Click for Google Cloud Storage

```dvc
$ dvc remote add myremote gs://bucket/path
```

</details>

<details>

### Click for SSH

```dvc
$ dvc remote add myremote ssh://user@example.com/path/to/dir
```

> **Note!** DVC requires both SSH and SFTP access to work with SSH remote
> storage. Please check that you are able to connect to the remote location with
> tools like `ssh` and `sftp` (GNU/Linux).

<!-- Separate MD quote: -->

> Note that your server's SFTP root might differ from its physical root (`/`).
> (On Linux, see the `ChrootDirectory` config option in `/etc/ssh/sshd_config`.)
> In these cases, the path component in the SSH URL (e.g. `/path/to/dir` above)
> should be specified relative to the SFTP root instead. For example, on some
> Sinology NAS drives, the SFTP root might be in directory `/volume1`, in which
> case you should use path `/path/to/dir` instead of `/volume1/path/to/dir`.

</details>

<details>

### Click for HDFS

```dvc
$ dvc remote add myremote hdfs://user@example.com/path/to/dir
```

> **Note!** If you are seeing `Unable to load libjvm` error on ubuntu with
> openjdk-8, try setting JAVA_HOME env variable. This issue is solved in the
> [upstream version of pyarrow](https://github.com/apache/arrow/pull/4907) and
> the fix will be included into the next pyarrow release.

</details>

<details>

### Click for HTTP

> **Note!** Currently HTTP remotes only support downloads operations:
>
> - `pull` and `fetch`
> - `import-url` and `get-url`
> - As an [external dependency](/doc/user-guide/external-dependencies)

```dvc
$ dvc remote add myremote https://example.com/path/to/dir
```

</details>

<details>

### Click for Aliyun OSS

First you need to setup OSS storage on Aliyun Cloud and then use an S3 style URL
for OSS storage and make the endpoint value configurable. An example is shown
below:

```dvc
$ dvc remote add myremote oss://my-bucket/path
```

To set key id, key secret and endpoint you need to use `dvc remote modify`.
Example usage is show below. Make sure to use the `--local` option to avoid
committing your secrets into Git:

```dvc
$ dvc remote modify myremote --local oss_key_id my-key-id
$ dvc remote modify myremote --local oss_key_secret my-key-secret
$ dvc remote modify myremote oss_endpoint endpoint
```

You can also set environment variables and use them later, to set environment
variables use following environment variables:

```dvc
$ export OSS_ACCESS_KEY_ID="my-key-id"
$ export OSS_ACCESS_KEY_SECRET="my-key-secret"
$ export OSS_ENDPOINT="endpoint"
```

#### Test your OSS storage using docker

Start a container running an OSS emulator.

```dvc
$ git clone https://github.com/nanaya-tachibana/oss-emulator.git
$ docker image build -t oss:1.0 oss-emulator
$ docker run --detach -p 8880:8880 --name oss-emulator oss:1.0
```

Setup environment variables.

```dvc
$ export OSS_BUCKET='my-bucket'
$ export OSS_ENDPOINT='localhost:8880'
$ export OSS_ACCESS_KEY_ID='AccessKeyID'
$ export OSS_ACCESS_KEY_SECRET='AccessKeySecret'
```

> Uses default key id and key secret when they are not given, which gives read
> access to public read bucket and public bucket.

</details>

## Example: Custom configuration of an S3 remote

Add an Amazon S3 remote as the _default_ (via `-d` option), and modify its
region:

```dvc
$ dvc remote add -d myremote s3://mybucket/myproject
Setting 'myremote' as a default remote.

$ dvc remote modify myremote region us-east-2
```

The <abbr>project</abbr>'s config file (`.dvc/config`) now looks like this:

```ini
['remote "myremote"']
url = s3://mybucket/myproject
region = us-east-2
[core]
remote = myremote
```

The list of remotes should now be:

```dvc
$ dvc remote list

myremote	s3://mybucket/myproject
```

You can overwrite existing remotes using `-f` with `dvc remote add`:

```dvc
$ dvc remote add -f myremote s3://mybucket/mynewproject
```

List remotes again to view the updated remote:

```dvc
$ dvc remote list

myremote	s3://mybucket/mynewproject
```
