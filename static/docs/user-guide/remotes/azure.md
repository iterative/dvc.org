# Azure

We can create an Azure remote like this:

```dvc
$ dvc remote add \
      myremote azure://my-container-name/path

$ dvc remote modify --local \
      myremote connection_string my-connection-string
```

> Notice that we used the option `--local` of the command `dvc remote modify` to
> save the connection string to `.dvc/config.local`, which is ignored by Git,
> since it contains access to data and should not be published.

- `my-container-name` is the top-level container in your Azure Storage Account
  under which all the files for this remote will be uploaded. If the container
  doesn't already exist, it will be created automatically.

- `my-connection-string` is the connection string to access your Azure Storage
  Account. If you don't already have a storage account, you can create one
  following
  [these instructions](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account).
  The connection string can be found in the "Access Keys" pane of your Storage
  Account resource in the Azure portal.

  For more information on configuring Azure Storage connection strings, visit
  [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string).

Configuration files `.dvc/config` and `.dvc/config.local` should look like this:

```ini
# .dvc/config
['remote "myremote"']
url = azure://my-container-name/path
```

```ini
# .dvc/config.local
['remote "myremote"']
connection_string = my-connection-string
```

<details>

### Configure Azure remotes via environment variables

The Azure Blob Storage remote can also be configured entirely via environment
variables:

```dvc
$ export AZURE_STORAGE_CONNECTION_STRING="my-connection-string"
$ export AZURE_STORAGE_CONTAINER_NAME="my-container-name"
$ dvc remote add myremote "azure://"
```

</details>

<details>

### Using Azure as a DVC Storage

To use Azure as a DVC storage we should create a _default_ remote with the
option `-d, --default`:

```dvc
$ dvc remote add --default \
      myremote azure://my-container-name/path
Setting 'myremote' as a default remote.

$ dvc remote modify --local \
      myremote connection_string my-connection-string
```

Configuration files `.dvc/config` and `.dvc/config.local` should look like this:

```ini
# .dvc/config
['remote "myremote"']
url = azure://my-container-name/path
[core]
remote = myremote
```

```ini
# .dvc/config.local
['remote "myremote"']
connection_string = my-connection-string
```

</details>
