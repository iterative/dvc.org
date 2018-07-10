# remote

Manage and configure available data remotes.

The same way as Github serves as a master storage for Git-based projects, DVC
remotes provide a central place to keep and share data and model files. With a
remote data storage, you can pull models and data files which were created by
your team members without spending time and resources to re-build models and
re-process data files. It also saves space on your local environment - DVC can
fetch into the local cache only the data you need for a specific branch/commit.

```usage
    usage: dvc remote [-h] [-q] [-v] {add,remove,modify,list} ... 

    positional arguments:
        add                   Add remote
        remove                Remove remote
        modify                Modify remote
        list                  List remotes

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Options

* **`url`** - remote location URL.

  ```dvc
    $ dvc remote modify myremote url gs://bucket/path
  ```

* **`type`** - cache type. Link type that dvc should use to link data files from
 cache to your repository. Possible values: `reflink`, `symlink`, `hardlink`,
 `copy` or a combination of those separated by the comma: `reflink,copy`.

  ```dvc
    $ dvc remote modify myremote type reflink,copy
  ```

### AWS S3 remote

```dvc
    $ dvc remote add myremote s3://bucket/path
```

Available options:

* **`region`** - change AWS S3 remote region::

  ```dvc
    $ dvc remote modify myremote region us-east-2
  ```

* **`profile`** - credentials profile name to use to access AWS S3:

  ```dvc
    $ dvc remote modify myremote profile myprofile
  ```

* **`credentialpath`** - credentials path to use to access AWS S3:

  ```dvc
    $ dvc remote modify myremote credentialpath /path/to/my/creds
  ```

* **`endpointurl`** - endpoint URL to use to access AWS S3:

  ```dvc
    $ dvc remote modify myremote endpointurl myendpoint.com
  ```


### Azure remote

```dvc
  $ export AZURE_STORAGE_CONNECTION_STRING="<my-connection-string>"
  $ dvc remote add myremote "azure://ContainerName=my-bucket;"
```

The Azure Blob Storage remote can also be configured entirely via environment
variables:

```dvc
  $ export AZURE_STORAGE_CONNECTION_STRING="<my-connection-string>"
  $ export AZURE_STORAGE_CONTAINER_NAME="my-bucket"
  $ dvc remote add myremote "azure://"
```

Alternatively, all the configuration can also be passed via the remote URL:

```dvc
  $ dvc remote add myremote "azure://ContainerName=my-bucket;<my-connection-string>"
```

* **`connection string`** - this is the connection string to access your Azure
Storage Account. If you don't already have a storage account, you can create
one following [these instructions](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account).
The connection string can be found in the "Access Keys" pane of your Storage
Account resource in the Azure portal.

* **`container name`** this is the top-level container in your Azure Storage
Account under which all the files for this remote will be uploaded. If the
container doesn't already exist, it will be created automatically.

### Google Cloud Storage remote

```dvc
    $ dvc remote add myremote gs://bucket/path
```

Available configuration options:

* **`projectname`** - project name to use.

  ```dvc
    $ dvc remote modify myremote projectname myproject
  ```

### SSH remote

```dvc
    $ dvc remote add myremote ssh://user@example.com:/path/to/dir
```

Available configuration options:

* **`user`** - username to use to access a remote.

  ```dvc
    $ dvc remote modify myremote user myuser
  ```

### HDFS remote

```dvc
    $ dvc remote add myremote hdfs://user@example.com/path/to/dir
```

Available configuration options:

* **`user`** - username to use to access a remote.

  ```dvc
    $ dvc remote modify myremote user myuser
  ```

## Examples

1. Add local remote:

```dvc
    $ dvc remote add myremote /path/to/remote
    $ dvc remote list

      myremote
```

2. Add AWS S3 remote and modify it's region:

```dvc
    $ dvc remote add myremote s3://mybucket/myproject
    $ dvc remote modify myremote region us-east-2
```

3. Remove remote:

```dvc
    $ dvc remote remove myremote
```
