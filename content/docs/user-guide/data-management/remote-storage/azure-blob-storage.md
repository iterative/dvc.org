# Microsoft Azure Blob Storage

<!--
## Microsoft Azure Blob Storage
-->

Start with `dvc remote add` to define the remote. Set a name and a valid [Azure
Blob Storage] URL:

```cli
$ dvc remote add -d myremote azure://<mycontainer>/<path>
```

- `<mycontainer>` - name of a [blob container]. DVC will attempt to create it if
  needed.
- `<path>` - optional path to a [virtual directory] in your bucket

[azure blob storage]: https://azure.microsoft.com/en-us/products/storage/blobs
[blob container]:
  https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal
[virtual directory]:
  https://learn.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#blob-names

To set up authentication or other configuration, set any supported config param
with `dvc remote modify`.

## Cloud versioning

<admon type="info">

Requires [Blob versioning] enabled on the storage account and container.

</admon>

```cli
$ dvc remote modify myremote version_aware true
```

`version_aware` (`true` or `false`) enables [cloud versioning] features for this
remote. This lets you explore the bucket files under the same structure you see
in your project directory locally.

[blob versioning]:
  https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview
[cloud versioning]: /docs/user-guide/data-management/cloud-versioning

## Authentication

<admon type="info">

This may require the **Storage Blob Data Contributor** and other [roles] on the
account.

[roles]: https://learn.microsoft.com/en-us/azure/role-based-access-control/

</admon>

A storage account name (`account_name`) is always needed. DVC tries to
authenticate with its [default credential] by default. This uses environment
variables (usually set during [Azure CLI configuration]) or data from certain
Microsoft applications.

```cli
$ dvc remote modify myremote --local account_name 'myuser'
```

[default credential]:
  https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential
[azure cli configuration]:
  https://learn.microsoft.com/en-us/cli/azure/azure-cli-configuration

<admon type="warn">

The `dvc remote modify --local` flag is needed to write sensitive user info to a
Git-ignored config file (`.dvc/config.local`) so that no secrets are leaked
through Git. See `dvc config`.

</admon>

<details>

### Windows users: click here for more info.

When using default authentication, you may need to enable some of these
exclusion parameters depending on your setup ([details]):

```cli
$ dvc remote modify --system myremote \
             exclude_environment_credential true
$ dvc remote modify --system myremote \
             exclude_visual_studio_code_credential true
$ dvc remote modify --system myremote \
             exclude_shared_token_cache_credential true
$ dvc remote modify --system myremote \
             exclude_managed_identity_credential true
```

[details]:
  https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python#parameters

</details>

For custom authentication, you can set the following config params with
`dvc remote modify --local`, use
[environment variables](#authenticate-with-environment-variables), or an
[Azure CLI config file](#authenticate-with-an-azure-cli-config-file) (in that
order).

### Authenticate with DVC configuration parameters

The following params are listed in the order in which they are tried.

- A [connection string] (`connection_string`) is used if given (recommended)
  (`account_name` is ignored since it's included in the connection string).

  ```cli
  $ dvc remote modify --local myremote \
                              connection_string 'mysecret'
  ```

- If `tenant_id`, `client_id`, and `client_secret` are given, Active Directory
  (AD) [service principal] auth is used.

  ```cli
  $ dvc remote modify --local myremote tenant_id 'mytenant'
  $ dvc remote modify --local myremote client_id 'myclient'
  $ dvc remote modify --local myremote client_secret 'mysecret'
  ```

- A storage account key (`account_key`) or a shared access signature token
  (`sas_token`), in this order.

  ```cli
  $ dvc remote modify --local myremote account_key 'mysecret'
  ```

  ```cli
  $ dvc remote modify --local myremote sas_token 'mysecret'
  ```

- If `allow_anonymous_login` is set, then [anonymous read access] will be tried
  as a last resort. An `account_name` is still needed. Only works with public
  containers.

  ```cli
  $ dvc remote modify myremote allow_anonymous_login true
  ```

[connection string]:
  https://learn.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string
[service principal]:
  https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal
[anonymous read access]:
  https://docs.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure

### Authenticate with environment variables

Some of [these env vars] can be used instead.

[these env vars]:
  https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python

For Azure connection string:

```cli
$ export AZURE_STORAGE_CONNECTION_STRING='mysecret'
```

For account name and key/token auth:

```cli
$ export AZURE_STORAGE_ACCOUNT='myaccount'
# and
$ export AZURE_STORAGE_KEY='mysecret'
# or
$ export AZURE_STORAGE_SAS_TOKEN='mysecret'
```

For _service principal_ auth (via certificate file):

```cli
$ export AZURE_TENANT_ID='directory-id'
$ export AZURE_CLIENT_ID='client-id'
$ export AZURE_CLIENT_CERTIFICATE_PATH='/path/to/certificate'
```

For simple username/password login:

```cli
$ export AZURE_CLIENT_ID='client-id'
$ export AZURE_USERNAME='myuser'
$ export AZURE_PASSWORD='mysecret'
```

### Authenticate with an Azure CLI config file

If no params or env vars are set explicitly, the following values can propagate
from an [Azure CLI configuration file] (typically managed with [az config]):
`connection_string`, `account_name`, `account_key`, `sas_token` and
`container_name`.

[azure cli configuration file]:
  https://learn.microsoft.com/en-us/cli/azure/azure-cli-configuration#cli-configuration-file
[az config]: https://docs.microsoft.com/en-us/cli/azure/config

## More configuration parameters

<admon type="info">

See `dvc remote modify` for more command usage details.

</admon>

- `url` - modify the remote location ([scroll up](#microsoft-azure-blob-storage)
  for details)
