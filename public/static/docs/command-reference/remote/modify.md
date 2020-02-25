# remote modify

Modify configuration of data remotes.

> This command is commonly needed after `dvc remote add` or
> [default](/doc/command-reference/remote/default) to setup credentials or other
> customizations to each remote storage type.

See also [add](/doc/command-reference/remote/add),
[default](/doc/command-reference/remote/default),
[list](/doc/command-reference/remote/list), and
[remove](/doc/command-reference/remote/remove) commands to manage data remotes.

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
specific. See `dvc remote add` and
[Available settings](#available-settings-per-storage-type) section below for a
list of remote storage types.

This command modifies a `remote` section in the project's
[config file](/doc/command-reference/config). Alternatively, `dvc config` or
manual editing could be used to change the configuration.

## Options

- `-u`, `--unset` - delete configuration value for given `option`. Don't provide
  a `value` when using this flag.

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc.config`) instead of `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Available parameters for all remotes

The following options are available for all remote types:

- `verify` - upon downloading <abbr>cache</abbr> files (`dvc pull`, `dvc fetch`)
  DVC will recalculate the file hashes upon download (e.g. `dvc pull`) to make
  sure that these haven't been modified, or corrupted during download. It may
  slow down the aforementioned commands. The calculated hash is compared to the
  value saved in the corresponding [DVC-file](/doc/user-guide/dvc-file-format).

  > Note that this option is enabled on **Google Drive** remotes by default.

  ```dvc
  $ dvc remote modify myremote verify true
  ```

## Available parameters per storage type

The following are the customizable types of remote storage (protocols):

<details>

### Click for Amazon S3

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
DVC will be using default AWS credentials file to access S3. To override some of
these settings, you could use the following options:

- `region` - change S3 remote region:

  ```dvc
  $ dvc remote modify myremote region us-east-2
  ```

- `profile` - credentials profile name to use to access S3:

  ```dvc
  $ dvc remote modify myremote profile myprofile
  ```

- `credentialpath` - credentials path to use to access S3:

  ```dvc
  $ dvc remote modify myremote credentialpath /path/to/my/creds
  ```

- `endpointurl` - endpoint URL to use to access S3:

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

- `acl` - set object level access control list (ACL) such as `private`,
  `public-read`, etc. By default, no ACL is specified.

  ```dvc
  $ dvc remote modify myremote acl bucket-owner-full-control
  ```

- `grant_read`\* - grants `READ` permissions at object level access control list
  for specific grantees\*\*. Grantee can read object and its metadata.

  ```dvc
  $ dvc remote modify myremote grant_read id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

- `grant_read_acp`\* - grants `READ_ACP` permissions at object level access
  control list for specific grantees\*\*. Grantee can read the object's ACP.

  ```dvc
  $ dvc remote modify myremote grant_read_acp id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

- `grant_write_acp`\* - grants `WRITE_ACP` permissions at object level access
  control list for specific grantees\*\*. Grantee can modify the object's ACP.

  ```dvc
  $ dvc remote modify myremote grant_write_acp id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

- `grant_full_control`\* - grants `FULL_CONTROL` permissions at object level
  access control list for specific grantees\*\*. Equivalent of grant_read +
  grant_read_acp + grant_write_acp

  ```dvc
  $ dvc remote modify myremote grant_full_control id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

  > \* - `grant_read`, `grant_read_acp`, `grant_write_acp` and
  > `grant_full_control` options are mutually exclusive with `acl` option.
  >
  > \*\* - default ACL grantees are overwritten. Grantees are AWS accounts
  > identifiable by `id` (AWS Canonical User ID), `emailAddress` or `uri`
  > (predefined group).

  > **Sources**
  >
  > - [ACL Overview - Permissions](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#permissions)
  > - [Put Object ACL](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectAcl.html)

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
$ dvc remote add myremote s3://path/to/dir
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

### Click for Microsoft Azure Blob Storage

- `url` - remote location URL.

  ```dvc
  $ dvc remote modify myremote url "azure://ContainerName=remote;"
  ```

- `connection_string` - connection string.

  ```dvc
  $ dvc remote modify myremote connection_string "my-connection-string" --local
  ```

For more information on configuring Azure Storage connection strings, visit
[here](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string).

> The connection string contains access to data and is inserted into the
> `.dvc/config file.` Therefore, it is safer to add the connection string with
> the `--local` option, enforcing it to be written to a Git-ignored config file.

</details>

<details>

### Click for Google Drive

Please check out
[Setup a Google Drive DVC Remote](/doc/user-guide/setup-google-drive-remote) for
a full guide on configuring Google Drives for use as DVC remote storage,
including obtaining the necessary credentials, and how to form `gdrive://` URLs.

- `url` - remote location URL.

  ```dvc
  $ dvc remote modify myremote url gdrive://root/path/to/folder
  ```

- `gdrive_client_id` - Google Project's OAuth 2.0 **client ID**.

  ```dvc
  $ dvc remote modify myremote gdrive_client_id <client ID>
  ```

- `gdrive_client_secret` - Google Project's OAuth 2.0 **client secret**.

  ```dvc
  $ dvc remote modify myremote gdrive_client_secret <client secret>
  ```

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).

</details>

<details>

### Click for Google Cloud Storage

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

### Click for Aliyun OSS

- `oss_key_id` - OSS key id to use to access a remote.

  ```dvc
  $ dvc remote modify myremote --local oss_key_id my-key-id
  ```

- `oss_key_secret` - OSS secret key for authorizing access into a remote.

  ```dvc
  $ dvc remote modify myremote --local oss_key_secret my-key-secret
  ```

- `oss_endpoint endpoint` - OSS endpoint values for accessing remote container.

  ```dvc
  $ dvc remote modify myremote oss_endpoint endpoint
  ```

</details>

<details>

### Click for SSH

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

- `gss_auth` - use Generic Security Services authentication if available on host
  (for example,
  [with kerberos](https://en.wikipedia.org/wiki/Generic_Security_Services_Application_Program_Interface#Relationship_to_Kerberos)).
  Using this option requires `paramiko[gssapi]`, which is currently only
  supported by our pip package, and could be installed with
  `pip install 'dvc[ssh_gssapi]'`. Other packages (Conda, Windows, and MacOS
  PKG) do not support it.

  ```dvc
  $ dvc remote modify myremote gss_auth true
  ```

</details>

<details>

### Click for HDFS

- `user` - username to use to access a remote.

  ```dvc
  $ dvc remote modify myremote user myuser
  ```

</details>

<details>

### Click for HTTP

- `auth` - authentication method to use when accessing a remote. The accepted
  values are:

  - `basic` -
    [Basic authentication scheme](https://tools.ietf.org/html/rfc7617). `user`
    and `password` (or `ask_password`) parameters should also be configured.
  - `digest` -
    [Digest Access Authentication Scheme](https://tools.ietf.org/html/rfc7616).
    `user` and `password` (or `ask_password`) parameters should also be
    configured.
  - `custom` - An additional HTTP header field will be set for all HTTP requests
    to the remote in the form: `custom_auth_header: password`.
    `custom_auth_header` and `password` (or `ask_password`) parameters should
    also be configured.

  ```dvc
  $ dvc remote modify myremote auth basic
  ```

- `custom_auth_header` - HTTP header field name to use when the `auth` parameter
  is set to `custom`.

  ```dvc
  $ dvc remote modify myremote custom_auth_header My-Header
  ```

- `user` - username to use when the `auth` parameter is set to `basic` or
  `digest`. The order in which DVC searches for username:

  1. `user` specified in one of the DVC configs;
  2. `user` specified in the url(e.g. `http://user@example.com/path`);

  ```dvc
  $ dvc remote modify myremote user myuser
  ```

- `password` - password to use for any `auth` method.

  ```dvc
  $ dvc remote modify myremote --local password mypassword
  ```

  > Note that the specified password will be inserted into the `.dvc/config`
  > file. Therefore, it's recommended to configure it using the `--local`
  > option, which writes it to a Git-ignored config file. (Or use the
  > `ask_password` parameter instead.)

- `ask_password` - ask each time for the password to use for any `auth` method.

  ```dvc
  $ dvc remote modify myremote ask_password true
  ```

  > Note that the `password` parameter takes precedence over `ask_password`. If
  > `password` is specified, DVC will not prompt the user to enter a password
  > for this remote.

</details>

## Example: Customize an S3 remote

Let's first set up a _default_ S3 remote.

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
$ dvc remote add -d myremote s3://mybucket/myproject
Setting 'myremote' as a default remote.
```

Modify its access profile:

```dvc
$ dvc remote modify myremote profile myusername
```

Now the project config file should look like this:

```ini
['remote "myremote"']
url = s3://mybucket/storage
profile = myusername
[core]
remote = myremote
```
