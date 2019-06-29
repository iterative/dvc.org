# remote modify

Modify remote settings.

> This command is commonly needed after `dvc remote add` or
> [default](/doc/commands-reference/remote-default) to setup credentials or
> other customizations to each remote type.

See also [add](/doc/commands-reference/remote-add),
[default](/doc/commands-reference/remote-default),
[list](/doc/commands-reference/remote-list), and
[remove](/doc/commands-reference/remote-remove) commands to manage data remotes.

## Synopsis

```usage
usage: dvc remote modify [-h] [--global] [--system] [--local]
                         [-q | -v] [-u]
                         name option [value]

positional arguments:
  name           Name of the remote
  option         Name of the option to modify
  value          (optional) Value of the option
```

## Description

Remote `name` and `option` name are required. Option names are remote type
specific. See below examples and a list of per remote type - AWS S3, Google
cloud, Azure, SSH, ALiyun OSS, and others.

This command modifies a `remote` section in the DVC
[config file](/doc/user-guide/dvc-files-and-directories). Alternatively,
`dvc config` or manual editing could be used to change settings.

## Options

- `-u`, `--unset` - delete configuration value for given `option`. Don't provide
  a `value` when using this flag.

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local
  [config file](/doc/user-guide/dvc-files-and-directories) instead of
  `.dvc/config`. It is located in `.dvc/config.local` and is Git-ignored. This
  is useful when you need to specify private config options in your config that
  you don't want to track and share through Git (credentials, private locations,
  etc).

## Examples

The following are the types and of remotes (protocols) supported:

<details>

### Click for AWS S3 available options

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
DVC will be using default AWS credentials file to access S3. To override some of
these settings, you could use the following options:

- `region` - change AWS S3 remote region:

```dvc
$ dvc remote modify myremote region us-east-2
```

- `profile` - credentials profile name to use to access AWS S3:

```dvc
$ dvc remote modify myremote profile myprofile
```

- `credentialpath` - credentials path to use to access AWS S3:

```dvc
$ dvc remote modify myremote credentialpath /path/to/my/creds
```

- `endpointurl` - endpoint URL to use to access AWS S3:

```dvc
$ dvc remote modify myremote endpointurl https://myendpoint.com
```

- `url` - remote location URL

```dvc
$ dvc remote modify myremote url s3://bucket/remote
```

- `use_ssl` - whether or not to use SSL. By default, SSL is used

```dvc
$ dvc remote modify myremote use_ssl false
```

- `listobjects` - whether or not to use `list_objects`. By default,
  `list_objects_v2` is used. Useful for ceph and other s3 emulators.

```dvc
$ dvc remote modify myremote listobjects true
```

- `sse` - server-side encryption algorithm to use (e.g., AES256, aws:kms). By
  default, no encryption is used.

```dvc
$ dvc remote modify myremote sse AES256
```

</details>

<details>

### Click for S3 API compatible storage available options

To communicate with a remote object storage that supports an S3 compatible API
(e.g. [Minio](https://minio.io/),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) etc.) you
must explicitly set the `endpointurl` in the configuration:

For example:

```dvc
$ dvc remote add -d myremote s3://path/to/dir
$ dvc remote modify myremote endpointurl https://object-storage.example.com
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

### Click for Azure available options

- `url` - remote location URL.

```dvc
$ dvc remote modify myremote url "azure://ContainerName=remote;"
```

- `connection_string` - connection string.

```dvc
$ dvc remote modify myremote connection_string my-connection-string --local
```

For more information on configuring Azure Storage connection strings, visit
[here](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string).

> The connection string contains access to data and is inserted into the
> `.dvc/config file.` Therefore, it is safer to add the connection string with
> the `--local` option, enforcing it to be written to a Git-ignored config file.

</details>

<details>

### Click for Google Cloud Storage available options

- `projectname` - project name to use.

```dvc
$ dvc remote modify myremote projectname myproject
```

- `url` - remote location URL.

```dvc
$ dvc remote modify myremote url gs://bucket/remote
```

- `credentailpath` -
  [service account credentials](https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually).

```dvc
$ dvc remote modify myremote credentialpath /path/to/my/creds/[FILE_NAME].json
```

</details>

<details>

### Click for SSH available options

- `url` - remote location URL.

```dvc
$ dvc remote modify myremote url ssh://user@example.com:1234/path/to/remote
```

- `user` - username to use to access a remote. The order in which dvc searches
  for username:

1. `user` specified in one of the dvc configs;
2. `user` specified in the url(e.g. `ssh://user@example.com/path`);
3. `user` specified in `~/.ssh/config` for remote host;
4. current user;

```dvc
$ dvc remote modify myremote user myuser
```

- `port` - port to use to access a remote. The order in which dvc searches for
  port:

1. `port` specified in one of the dvc configs;
2. `port` specified in the url(e.g. `ssh://example.com:1234/path`);
3. `port` specified in `~/.ssh/config` for remote host;
4. default ssh port 22;

```dvc
$ dvc remote modify myremote port 2222
```

- `keyfile` - path to private key to use to access a remote.

```dvc
$ dvc remote modify myremote keyfile /path/to/keyfile
```

- `password` - a private key passphrase or a password to use to use when
  accessing a remote.

```dvc
$ dvc remote modify myremote password mypassword
```

- `ask_password` - ask for a private key passphrase or a password to use when
  accessing a remote.

```dvc
$ dvc remote modify myremote ask_password true
```

</details>

<details>

### Click for HDFS available options

- `user` - username to use to access a remote.

```dvc
$ dvc remote modify myremote user myuser
```

</details>

<details>

### Click for Aliyun OSS available options

- `oss_key_id` - OSS key id to use to access a remote.

```dvc
$ dvc remote modify myremote --local oss_key_id my-key-id
```

- `oss_key_secret` - OSS secret key for authorizing access into a remote.

```dvc
$ dvc remote modify myremote --local oss_key_secret my-key-secret
```

- `oss_endpoint endpoint` - OSS endpoint valuesfor accessing remote container.

```dvc
$ dvc remote modify myremote oss_endpoint endpoint
```

</details>

## Examples: Customize an S3 remote

Let's first set up a _default_ S3 remote:

```dvc
$ dvc remote add -d myremote s3://mybucket/storage

Setting 'myremote' as a default remote.
```

Modify its endpoint URL:

```dvc
$ dvc remote modify myremote endpointurl https://object-storage.example.com
```

Now the config file should look like (run `cat .dvc/config`):

```ini
['remote "myremote"']
url = s3://mybucket/storage
endpointurl = https://object-storage.example.com
[core]
remote = myremote
```
