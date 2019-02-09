# add

Add a new data remote. Depending on your storage type you might need to run `dvc
remote modify` to provide credentials and/or configure other remote parameters.

## Synopsis

```usage
    usage: dvc remote add [-h] [-q | -v] [--global] [--system] [--local] [-d]
                          name url

    positional arguments:
        name           Name.
        url            URL.
```

## Description

`name` and `url` are required. `url` specifies a location to store your data. It
could be S3 path, SSH path, Azure, Google cloud, local directory, etc - see more
examples below. If `url1` is a local relative path, it will be resolved relative
to the current directory and saved to config relative to the config file
location(see LOCAL example below). Whenever possible DVC will create a remote
directory if does not exists yet. It won't create an S3 bucket though and will
rely on default access settings.

This command creates a section in the DVC [config file](/doc/user-guide/dvc-files-and-directories)
and optionally assigns a default remote in the core section:

```ini
   ['remote "myremote"']
   url = /tmp/dvc-storage
   [core]
   remote = myremote
```

## Options

* `--global` - save remote configuration to the global config (e.g.
`~/.config/dvc/config`) instead of `.dvc/config`.

* `--system` - save remote configuration to the system config (e.g.
`/etc/dvc.config`) instead of `.dvc/config`.

* `--local` - save the remote configuration to the
[local](/doc/user-guide/dvc-files-and-directories) config (`.dvc/config.local`).
This is useful when you need to specify private options or local environment
specific settings in your config, that you don't want to track and share through
 Git (credentials, private locations, etc).

* `-d`, `-default` - commands like `dvc pull`, `dvc push`, `dvc fetch` will be
using this remote by default to save or retrieve data files unless `-r` option
is specified for them. Use `dvc config` to unset/change the default remote:
`dvc config -u core.remote`.

<details>

### Click for LOCAL example

Using a relative path:

```dvc
    $ dvc remote add myremote ../dir
    $ cat .dvc/config
      ...
      ['remote "myremote"']
          url = ../../dir
      ...
    $ # NOTE: `../dir` has been resolved relative to `.dvc/config` location,
    $ # resulting in `../../dir`.
```

Using an absolute path:

```dvc
    $ dvc remote add myremote /path/to/dir
    $ cat .dvc/config
      ...
      ['remote "myremote"']
          url = /path/to/dir
      ...
    $ # NOTE: absolute path `/path/to/dir` saved as is.
```

</details>

<details>

### Click for AWS S3 example

```dvc
    $ dvc remote add myremote s3://bucket/path
```

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
DVC will be using default AWS credentials file to access S3. To override some of
these settings, you could the options described in `dvc remote modify`.

We use `boto3` library to set up a client and communicate with AWS S3.
The following API methods are performed:
- `list_objects_v2`
- `head_object`
- `download_file`
- `upload_file`
- `delete_object`
- `copy`

So, make sure you have the following permissions enabled:
- s3:ListBucket
- s3:GetObject
- s3:PutObject
- s3:DeleteObject

</details>

<details>

### Click for an S3 API compatible storage 

To communicate with a remote object storage that supports an S3 compatible API
(e.g. [Minio](https://minio.io/), [Wasabi](https://wasabi.com/),
[Eucalyptus](https://www.eucalyptus.cloud/index.html), [DigitalOcean
Spaces](https://www.digitalocean.com/products/spaces/), etc.) you must
explicitly set the `endpointurl` in the configuration:

For example:

```dvc
    $ dvc remote add -d mybucket s3://path/to/dir
    $ dvc remote modify mybucket endpointurl object-storage.example.com
```

AWS S3 remote can also be configured entirely via environment variables:

```dvc
    $ export AWS_ACCESS_KEY_ID="<my-access-key>"
    $ export AWS_SECRET_ACCESS_KEY="<my-secret-key>"
    $ dvc remote add myremote "s3://bucket/myremote"
```

For more information about the variables DVC supports, please visit
[boto3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#environment-variable-configuration)

</details>

<details>

### Click for Azure example

```dvc
    $ dvc remote add myremote azure://my-container-name/path
    $ dvc remote modify myremote connection_string my-connection-string
```

The Azure Blob Storage remote can also be configured entirely via environment
variables:

```dvc
    $ export AZURE_STORAGE_CONNECTION_STRING="<my-connection-string>"
    $ export AZURE_STORAGE_CONTAINER_NAME="my-container-name"
    $ dvc remote add myremote "azure://"
```

* `connection string` - this is the connection string to access your Azure
Storage Account. If you don't already have a storage account, you can create
one following [these instructions](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account).
The connection string can be found in the "Access Keys" pane of your Storage
Account resource in the Azure portal.

* `container name` - this is the top-level container in your Azure Storage
Account under which all the files for this remote will be uploaded. If the
container doesn't already exist, it will be created automatically.

</details>


<details>

### Click for Google Cloud Storage example

```dvc
    $ dvc remote add myremote gs://bucket/path
```

</details>

<details>

### Click for SSH example

```dvc
    $ dvc remote add myremote ssh://user@example.com/path/to/dir
```

</details>

<details>

### Click for HDFS example

```dvc
    $ dvc remote add myremote hdfs://user@example.com/path/to/dir
```

</details>

<details>

### Click for HTTP example

**NOTE**: Currently HTTP remote only supports downloads:
  - `pull`
  - `fetch`
  - `import`
  - As a dependency on remote

```dvc
    $ dvc remote add myremote https://example.com/path/to/dir
```

</details>

## Examples

Add AWS S3 _default_ (via `-d` option )remote and modify its region:

```dvc
    $ dvc remote add -d myremote s3://mybucket/myproject
    Setting 'myremote' as a default remote.

    $ dvc remote modify myremote region us-east-2
```

DVC config file would look like (run `cat .dvc/config`):

```ini
    ['remote "myremote"']
    url = /path/to/remote
    [core]
    remote = myremote
```

And list of remotes like this:

```dvc
    $ dvc remote list
    
    myremote	s3://mybucket/myproject 
```
