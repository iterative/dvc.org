# remote modify

Modify the configuration of a [data remote](/doc/command-reference/remote).

> This command is commonly needed after `dvc remote add` or
> [default](/doc/command-reference/remote/default) to setup credentials or other
> customizations to each remote storage type.

## Synopsis

```usage
usage: dvc remote modify [-h] [--global | --system | --local] [-q | -v]
                         [-u]
                         name option [value]

positional arguments:
  name           Name of the remote
  option         Name of the option to modify
  value          (optional) Value of the option
```

## Description

Remote `name` and `option` name are required. Config option names are specific
to the remote type. See `dvc remote add` and
[Available settings](#available-settings-per-storage-type) below for a list of
remote storage types.

This command modifies a `remote` section in the project's
[config file](/doc/command-reference/config). Alternatively, `dvc config` or
manual editing could be used to change the configuration.

## Command options (flags)

- `-u`, `--unset` - delete configuration value for the given config `option`.
  Don't provide a `value` when employing this flag.

- `--global` - save remote configuration to the global config (e.g.
  `~/.config/dvc/config`) instead of `.dvc/config`.

- `--system` - save remote configuration to the system config (e.g.
  `/etc/dvc/config`) instead of `.dvc/config`.

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

The following config options are available for all remote types:

- `url` - the remote location can always be modified. This is how DVC determines
  what type of remote it is, and thus which other config options can be modified
  (see each type in the next section for more details).

  For example, for an Amazon S3 remote (see more details in the S3 section
  below):

  ```dvc
  $ dvc remote modify s3remote s3://mybucket/path
  ```

  Or a _local remote_ (a directory in the file system):

  ```dvc
  $ dvc remote modify localremote url /home/user/dvcstore
  ```

- `jobs` - change the default number of processes for
  [remote storage](/doc/command-reference/remote) synchronization operations
  (see the `--jobs` option of `dvc push`, `dvc pull`, `dvc fetch`, `dvc status`,
  and `dvc gc`). Accepts positive integers. The default is typically `4`.

  ```dvc
  $ dvc remote modify myremote jobs 8
  ```

- `verify` - upon downloading <abbr>cache</abbr> files (`dvc pull`, `dvc fetch`)
  DVC will recalculate the file hashes upon download (e.g. `dvc pull`) to make
  sure that these haven't been modified, or corrupted during download. It may
  slow down the aforementioned commands. The calculated hash is compared to the
  value saved in the corresponding
  [DVC-file](/doc/user-guide/dvc-files-and-directories).

  > Note that this option is enabled on **Google Drive** remotes by default.

  ```dvc
  $ dvc remote modify myremote verify true
  ```

## Available parameters per storage type

The following are the types of remote storage (protocols) and their config
options:

<details>

### Click for Amazon S3

By default, DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
DVC will be using default AWS credentials file to access S3. To override some of
these settings, you could use the following options.

- `url` - remote location, in the `s3://<bucket>/<key>` format:

  ```dvc
  $ dvc remote modify myremote url s3://mybucket/my/path
  ```

- `region` - change S3 remote region:

  ```dvc
  $ dvc remote modify myremote region us-east-2
  ```

- `profile` - credentials profile name to access S3:

  ```dvc
  $ dvc remote modify myremote profile myprofile
  ```

- `credentialpath` - credentials path to access S3:

  ```dvc
  $ dvc remote modify myremote credentialpath /path/to/my/creds
  ```

- `endpointurl` - endpoint URL to access S3:

  ```dvc
  $ dvc remote modify myremote endpointurl https://myendpoint.com
  ```

- `access_key_id` - AWS Access Key ID. May be used (along with
  `secret_access_key`) instead of `credentialpath`:

  ```dvc
  $ dvc remote modify myremote access_key_id my-access-key-id
  ```

- `secret_access_key` - AWS Secret Access Key. May be used (along with
  `access_key_id`) instead of `credentialpath`:

  ```dvc
  $ dvc remote modify myremote secret_access_key my-secret_access_key
  ```

- `use_ssl` - whether or not to use SSL. By default, SSL is used.

  ```dvc
  $ dvc remote modify myremote use_ssl false
  ```

- `listobjects` - whether or not to use `list_objects`. By default,
  `list_objects_v2` is used. Useful for ceph and other S3 emulators.

  ```dvc
  $ dvc remote modify myremote listobjects true
  ```

- `sse` - server-side encryption algorithm to use (e.g. AES256, aws:kms). By
  default, no encryption is used.

  ```dvc
  $ dvc remote modify myremote sse AES256
  ```

- `sse_kms_key_id` - identifier of the key to encrypt data uploaded when using
  SSE-KMS. Required when the `sse` parameter (above) is set to `aws:kms`. This
  parameter will be passed directly to AWS S3 functions, so DVC supports any
  value that S3 supports, including both key ids and aliases.

  ```dvc
  $ dvc remote modify myremote sse_kms_key_id mykeyid_or_alias
  ```

- `acl` - set object level access control list (ACL) such as `private`,
  `public-read`, etc. By default, no ACL is specified.

  ```dvc
  $ dvc remote modify myremote acl bucket-owner-full-control
  ```

- `grant_read`\* - grants `READ` permissions at object level access control list
  for specific grantees\*\*. Grantee can read object and its metadata.

  ```dvc
  $ dvc remote modify myremote grant_read \
          id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

- `grant_read_acp`\* - grants `READ_ACP` permissions at object level access
  control list for specific grantees\*\*. Grantee can read the object's ACP.

  ```dvc
  $ dvc remote modify myremote grant_read_acp \
          id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

- `grant_write_acp`\* - grants `WRITE_ACP` permissions at object level access
  control list for specific grantees\*\*. Grantee can modify the object's ACP.

  ```dvc
  $ dvc remote modify myremote grant_write_acp \
          id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

- `grant_full_control`\* - grants `FULL_CONTROL` permissions at object level
  access control list for specific grantees\*\*. Equivalent of grant_read +
  grant_read_acp + grant_write_acp

  ```dvc
  $ dvc remote modify myremote grant_full_control \
          id=aws-canonical-user-id,id=another-aws-canonical-user-id
  ```

  > \* `grant_read`, `grant_read_acp`, `grant_write_acp` and
  > `grant_full_control` params are mutually exclusive with `acl`.
  >
  > \*\* default ACL grantees are overwritten. Grantees are AWS accounts
  > identifiable by `id` (AWS Canonical User ID), `emailAddress` or `uri`
  > (predefined group).

  > **Sources**
  >
  > - [ACL Overview - Permissions](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#permissions)
  > - [Put Object ACL](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectAcl.html)

S3 remotes can also be configured entirely via environment variables:

```dvc
$ export AWS_ACCESS_KEY_ID='<my-access-key>'
$ export AWS_SECRET_ACCESS_KEY='<my-secret-key>'
$ dvc remote add -d myremote s3://mybucket/my/path
```

For more information about the variables DVC supports, please visit
[boto3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#environment-variable-configuration)

</details>

<details>

### Click for S3 API compatible storage

To communicate with a remote object storage that supports an S3 compatible API
(e.g. [Minio](https://min.io/),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) etc.),
configure the remote's `endpointurl` explicitly:

```dvc
$ dvc remote add -d myremote s3://mybucket/path/to/dir
$ dvc remote modify myremote endpointurl \
                    https://object-storage.example.com
```

Besides that, any settings that are available for Amazon S3 (see previous
section) may be available for S3 compatible storage. For example, let's setup a
DVC remote using the `example-name`
[DigitalOcean space](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key)
(equivalent to a bucket in AWS) in the `nyc3` region:

```dvc
$ dvc remote add -d myremote s3://example-name/path/to/use
$ dvc remote modify myremote endpointurl \
                             https://nyc3.digitaloceanspaces.com
```

</details>

<details>

### Click for Microsoft Azure Blob Storage

- `url` - remote location, in the `azure://<container>/<object>` format:

  ```dvc
  $ dvc remote modify myremote url azure://mycontainer/path
  ```

- `connection_string` - connection string:

  ```dvc
  $ dvc remote modify --local myremote connection_string \
                              'my-connection-string'
  ```

> The connection string contains sensitive user info. Therefore, it's safer to
> add it with the `--local` option, so it's written to a Git-ignored config
> file.

For more information on configuring Azure Storage connection strings, visit
[here](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string).

</details>

<details>

### Click for Google Drive

Please see
[Setup a Google Drive DVC Remote](/doc/user-guide/setup-google-drive-remote) for
a full guide on using Google Drive as DVC remote storage.

- `url` - remote location. See
  [valid URL format](/doc/user-guide/setup-google-drive-remote#url-format).

  ```dvc
  $ dvc remote modify myremote url \
                      gdrive://0AIac4JZqHhKmUk9PDA/dvcstore
  ```

- `gdrive_client_id` - Client ID for authentication with OAuth 2.0 when using a
  [custom Google Client project](/doc/user-guide/setup-google-drive-remote#using-a-custom-google-cloud-project).
  Also requires using `gdrive_client_secret`.

  ```dvc
  $ dvc remote modify myremote gdrive_client_id <client ID>
  ```

- `gdrive_client_secret` - Client secret for authentication with OAuth 2.0 when
  using a custom Google Client project. Also requires using `gdrive_client_id`.

  ```dvc
  $ dvc remote modify myremote gdrive_client_secret <client secret>
  ```

- `gdrive_user_credentials_file` - path where DVC stores OAuth credentials to
  access Google Drive data. `.dvc/tmp/gdrive-user-credentials.json` by default.

  ```dvc
  $ dvc remote modify myremote gdrive_user_credentials_file \
                      .dvc/tmp/myremote-credentials.json
  ```

See [Authorization](/doc/user-guide/setup-google-drive-remote#authorization) for
more details.

- `gdrive_trash_only` - configures `dvc gc` to move remote files to
  [trash](https://developers.google.com/drive/api/v2/reference/files/trash)
  instead of
  [deleting](https://developers.google.com/drive/api/v2/reference/files/delete)
  them permanently. `false` by default, meaning "delete". Useful for shared
  drives/folders, where delete permissions may not be given.

  ```dvc
  $ dvc remote modify myremote gdrive_trash_only true
  ```

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).

**For service accounts:**

A service account is a Google account associated with your GCP project, and not
a specific user. Please refer to
[Using service accounts](https://cloud.google.com/iam/docs/service-accounts) for
more information.

- `gdrive_use_service_account` - instructs DVC to authenticate using a service
  account instead of OAuth. Make sure that the service account has read/write
  access (as needed) to the file structure in the remote `url`.

  ```dvc
  $ dvc remote modify myremote gdrive_use_service_account true
  ```

- `gdrive_service_account_email` - email address of the Google Project's service
  account when `gdrive_use_service_account` is on. Also requires using
  `gdrive_service_account_p12_file_path`.

  ```dvc
  $ dvc remote modify myremote \
                      gdrive_service_account_email <service acct email>
  ```

- `gdrive_service_account_p12_file_path` - Google Project's service account
  `.p12` file path when `gdrive_use_service_account` is on. Also requires using
  `gdrive_service_account_email`.

  ```dvc
  $ dvc remote modify myremote \
                      gdrive_service_account_p12_file_path \
                      path/to/file.p12
  ```

- `gdrive_service_account_user_email` - email of a user account to
  [impersonate](https://developers.google.com/admin-sdk/directory/v1/guides/delegation)
  with the service account. Optional when `gdrive_use_service_account` is on.

  ```dvc
  $ dvc remote modify myremote \
                      gdrive_service_account_user_email <user email>
  ```

</details>

<details>

### Click for Google Cloud Storage

- `url` - remote location, in the `gs://<bucket>/<object>` format:

  ```dvc
  $ dvc remote modify myremote url gs://my-bucket/path
  ```

- `projectname` - override or provide a project name to use, if a default one is
  not set.

  ```dvc
  $ dvc remote modify myremote projectname myproject
  ```

**For service accounts:**

A service account is a Google account associated with your GCP project, and not
a specific user. Please refer to
[Using service accounts](https://cloud.google.com/iam/docs/service-accounts) for
more information.

- `credentialpath` - path to the file that contains the
  [service account key](/doc/user-guide/setup-google-drive-remote#using-service-accounts).
  Make sure that the service account has read/write access (as needed) to the
  file structure in the remote `url`.

  ```dvc
  $ dvc remote modify \
        myremote credentialpath '/home/.../project-XXXXXXX.json'
  ```

  Alternatively, the `GOOGLE_APPLICATION_CREDENTIALS` env var can be set:

  ```dvc
  $ export GOOGLE_APPLICATION_CREDENTIALS='.../project-XXXXXXX.json'
  ```

</details>

<details>

### Click for Aliyun OSS

- `url` - remote location, in the `oss://<bucket>/<object>` format:

  ```dvc
  $ dvc remote modify myremote url oss://my-bucket/path
  ```

- `oss_endpoint` - OSS endpoint values for accessing the remote container.

  ```dvc
  $ dvc remote modify myremote oss_endpoint endpoint
  ```

- `oss_key_id` - OSS key ID to access the remote.

  ```dvc
  $ dvc remote modify myremote --local oss_key_id my-key-id
  ```

- `oss_key_secret` - OSS secret key for authorizing access into the remote.

  ```dvc
  $ dvc remote modify myremote --local oss_key_secret my-key-secret
  ```

> The key ID and secret key contain sensitive user info. Therefore, it's safer
> to add them with the `--local` option, so they're written to a Git-ignored
> config file.

</details>

<details>

### Click for SSH

- `url` - remote location, in a regular
  [SSH format](https://tools.ietf.org/id/draft-salowey-secsh-uri-00.html#sshsyntax):

  ```dvc
  $ dvc remote modify myremote url \
                      ssh://user@example.com:1234/path/to/dir
  ```

  ⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
  Please check that you are able to connect both ways with tools like `ssh` and
  `sftp` (GNU/Linux).

  > Note that your server's SFTP root might differ from its physical root (`/`).

- `user` - username to access the remote.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC picks the username:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `ssh://user@example.com/path`);
  3. User defined in `~/.ssh/config` for this host (URL);
  4. Current user

- `port` - port to access the remote.

  ```dvc
  $ dvc remote modify myremote port 2222
  ```

  The order in which DVC decide the port number:

  1. `port` parameter set with this command (found in `.dvc/config`);
  2. Port defined in the URL (e.g. `ssh://example.com:1234/path`);
  3. Port defined in `~/.ssh/config` for this host (URL);
  4. Default SSH port 22

- `keyfile` - path to private key to access the remote.

  ```dvc
  $ dvc remote modify myremote keyfile /path/to/keyfile
  ```

- `password` - a private key passphrase or a password to access the remote.

  ```dvc
  $ dvc remote modify --local myremote password mypassword
  ```

> The username and password (may) contain sensitive user info. Therefore, it's
> safer to add them with the `--local` option, so they're written to a
> Git-ignored config file.

- `ask_password` - ask for a private key passphrase or a password to access the
  remote.

  ```dvc
  $ dvc remote modify myremote ask_password true
  ```

- `gss_auth` - use Generic Security Services authentication if available on host
  (for example,
  [with kerberos](https://en.wikipedia.org/wiki/Generic_Security_Services_Application_Program_Interface#Relationship_to_Kerberos)).
  Using this param requires `paramiko[gssapi]`, which is currently only
  supported by our pip package, and could be installed with
  `pip install 'dvc[ssh_gssapi]'`. Other packages (Conda, Windows, and MacOS
  PKG) do not support it.

  ```dvc
  $ dvc remote modify myremote gss_auth true
  ```

- `allow_agent` - whether to use [SSH agents](https://www.ssh.com/ssh/agent)
  (`true` by default). Setting this to `false` is useful when `ssh-agent` is
  causing problems, such as a "No existing session" error:

  ```dvc
  $ dvc remote modify myremote allow_agent false
  ```

</details>

<details>

### Click for HDFS

💡 Using a HDFS cluster as remote storage is also supported via the WebHDFS API.
Read more about by expanding the WebHDFS section in
[`dvc remote add`](/doc/command-reference/remote/add#supported-storage-types).

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url hdfs://user@example.com/path/to/dir
  ```

- `user` - username to access the remote.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

> The username may contain sensitive user info. Therefore, it's safer to add it
> with the `--local` option, so it's written to a Git-ignored config file.

</details>

<details>

### Click for HTTP

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url https://example.com/path/to/dir
  ```

  > The URL can include a query string, which will be preserved (e.g.
  > `example.com?loc=path%2Fto%2Fdir`)

- `auth` - authentication method to use when accessing the remote. The accepted
  values are:

  - `basic` -
    [basic authentication scheme](https://tools.ietf.org/html/rfc7617). `user`
    and `password` (or `ask_password`) parameters should also be configured.
  - `digest` -
    [digest Access Authentication Scheme](https://tools.ietf.org/html/rfc7616).
    `user` and `password` (or `ask_password`) parameters should also be
    configured.
  - `custom` - an additional HTTP header field will be set for all HTTP requests
    to the remote in the form: `custom_auth_header: password`.
    `custom_auth_header` and `password` (or `ask_password`) parameters should
    also be configured.

  ```dvc
  $ dvc remote modify myremote auth basic
  ```

- `method` - override the
  [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to
  use for file uploads (e.g. `PUT` should be used for
  [Artifactory](https://www.jfrog.com/confluence/display/JFROG/Artifactory+REST+API)).
  By default, `POST` is used.

  ```dvc
  $ dvc remote modify myremote method PUT
  ```

- `custom_auth_header` - HTTP header field name to use when the `auth` parameter
  is set to `custom`.

  ```dvc
  $ dvc remote modify myremote custom_auth_header My-Header
  ```

- `user` - username to use when the `auth` parameter is set to `basic` or
  `digest`.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC picks the username:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `http://user@example.com/path`);

- `password` - password to use for any `auth` method.

  ```dvc
  $ dvc remote modify myremote --local password mypassword
  ```

> The username and password (may) contain sensitive user info. Therefore, it's
> safer to add them with the `--local` option, so they're written to a
> Git-ignored config file.

- `ask_password` - ask each time for the password to use for any `auth` method.

  ```dvc
  $ dvc remote modify myremote ask_password true
  ```

  > Note that the `password` parameter takes precedence over `ask_password`. If
  > `password` is specified, DVC will not prompt the user to enter a password
  > for this remote.

- `ssl_verify` - allows to disable SSH verification, which is enabled by
  default.

  ```dvc
  $ dvc remote modify myremote ssl_verify false
  ```

</details>

<details>

### Click for WebHDFS

💡 WebHDFS serves as an alternative for using the same remote storage supported
by HDFS. Read more about by expanding the WebHDFS section in
[`dvc remote add`](/doc/command-reference/remote/add#supported-storage-types).

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url webhdfs://user@example.com/path/to/dir
  ```

- `user` - username to access the remote, can be empty in case of using `token`
  or if using a `HdfsCLI` cfg file. May only be used when Hadoop security is
  off. Defaults to current user as determined by `whoami`.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

- `token` - Hadoop delegation token for WebHDFS, can be empty in case of using
  `user` or if using a `HdfsCLI` cfg file. May be used when Hadoop security is
  on.

  ```dvc
  $ dvc remote modify --local myremote token mytoken
  ```

- `hdfscli_config` - path to a `HdfsCLI` cfg file. WebHDFS access depends on
  `HdfsCLI`, which allows the usage of a configuration file by default located
  in `~/.hdfscli.cfg`. In the file, multiple aliases can be set with their own
  connection parameters, like `url` or `user`. If using a cfg file,
  `webhdfs_alias` can be set to specify which alias to use.

  ```dvc
  $ dvc remote modify --local myremote hdfscli_config `/path/to/.hdfscli.cfg`
  ```

  Sample configuration file:

  ```ini
  [global]
  default.alias = myalias

  [myalias.alias]
  url = http://example.com/path/to/dir
  user = myuser

  [production.alias]
  url = http://prodexample.com/path/to/dir
  user = produser
  ```

  See more information in the `HdfsCLI`
  [docs](https://hdfscli.readthedocs.io/en/latest/quickstart.html#configuration).

- `webhdfs_alias` - alias in a `HdfsCLI` cfg file to use. Only relevant if used
  in conjunction with `hdfscli_config`. If not defined, `default.alias` in
  `HdfsCLI` cfg file will be used instead.

  ```dvc
  $ dvc remote modify --local myremote webhdfs_alias myalias
  ```

> The username, token, webhdfs_alias, and hdfscli_config may contain sensitive
> user info. Therefore, it's safer to add it with the `--local` option, so it's
> written to a Git-ignored config file.

</details>

<details>

### Click for WebDAV

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url \
        webdavs://example.com/nextcloud/remote.php/dav/files/USERNAME/
  ```

- `token` - token for WebDAV server, can be empty in case of using
  `user/password` authentication.

  ```dvc
  $ dvc remote modify --local myremote token '<mytoken>'
  ```

- `user` - username for WebDAV server, can be empty in case of using `token`
  authentication.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC searches for username is:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `webdavs://user@example.com/endpoint/path`)

- `password` - password for WebDAV server, can be empty in case of using `token`
  authentication.

  ```dvc
  $ dvc remote modify --local myremote password mypassword
  ```

> The username, password, and token (may) contain sensitive user info.
> Therefore, it's safer to add them with the `--local` option, so they're
> written to a Git-ignored config file.

> Note that `user/password` and `token` authentication are incompatible. You
> should authenticate against yout WebDAV remote by either `user/password` or
> `token`.

- `ask_password` - ask each time for the password to use for `user/password`
  authentication. This has no effect if `password` or `token` are set.

  ```dvc
  $ dvc remote modify myremote ask_password true
  ```

- `cert_path` - path to certificate used for WebDAV server authentication, if
  you need to use local client side certificates.

  ```dvc
  $ dvc remote modify myremote cert_path /path/to/cert
  ```

- `key_path` - path to private key to use to access a remote. Only has an effect
  in combination with `cert_path`.

  ```dvc
  $ dvc remote modify myremote key_path /path/to/key
  ```

  > Note that the certificate in `cert_path` might already contain the private
  > key.

- `timeout` - connection timeout (in seconds) for WebDAV server (default: 30).

  ```dvc
  $ dvc remote modify myremote timeout 120
  ```

</details>

## Example: Customize an S3 remote

Let's first set up a _default_ S3 remote.

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
$ dvc remote add -d myremote s3://mybucket/path
Setting 'myremote' as a default remote.
```

Modify its access profile:

```dvc
$ dvc remote modify myremote profile myusername
```

Now the project config file should look like this:

```ini
['remote "myremote"']
url = s3://mybucket/path
profile = myusername
[core]
remote = myremote
```
