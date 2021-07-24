# remote modify

Modify the configuration of a [data remote](/doc/command-reference/remote).

> This command is commonly needed after `dvc remote add` or
> [default](/doc/command-reference/remote/default) to set up credentials or
> other customizations to each remote storage type.

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

Remote `name` and `option` name are required. Config option names are specific
to the remote type. See `dvc remote add` and
[Available parameters](#available-parameters-per-storage-type) below for a list
of remote storage types.

This command modifies a `remote` section in the project's
[config file](/doc/command-reference/config). Alternatively, `dvc config` or
manual editing could be used to change the configuration.

## Command options (flags)

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

- `url` - the remote location can always be modified. This is how DVC determines
  what type of remote it is, and thus which other config options can be modified
  (see each type in the next section for more details).

  For example, for an Amazon S3 remote (see more details in the S3 section
  below):

  ```dvc
  $ dvc remote modify myremote url s3://mybucket/new/path
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
  DVC will recalculate the file hashes, to make sure that these haven't been
  modified or corrupted. This may slow down the aforementioned commands. The
  calculated hash is compared to the value saved in the corresponding <abbr>DVC
  file</abbr>.

  > Note that this option is enabled on **Google Drive** remotes by default.

  ```dvc
  $ dvc remote modify myremote verify true
  ```

## Available parameters per storage type

The following are the types of remote storage (protocols) and their config
options:

<details>

### Click for Amazon S3

- `url` - remote location, in the `s3://<bucket>/<key>` format:

  ```dvc
  $ dvc remote modify myremote url s3://mybucket/path
  ```

- `region` - change S3 remote region:

  ```dvc
  $ dvc remote modify myremote region us-east-2
  ```

By default, DVC authenticates using your AWS CLI
[configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
(if set). This uses the default AWS credentials file. Use the following
parameters to customize the authentication method:

- `profile` - credentials profile name to access S3:

  ```dvc
  $ dvc remote modify myremote profile myprofile
  ```

- `credentialpath` - S3 credentials file path:

  ```dvc
  $ dvc remote modify --local myremote credentialpath /path/to/creds
  ```

- `configpath` - path to the
  [AWS CLI config file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
  The default AWS CLI config file path (e.g. `~/.aws/config`) is used if this
  parameter isn't set.

  ```dvc
  $ dvc remote modify --local myremote configpath /path/to/config
  ```

  > Note that only the S3-specific
  > [configuration values](https://docs.aws.amazon.com/cli/latest/topic/s3-config.html#configuration-values)
  > are used.

- `endpointurl` - endpoint URL to access S3:

  ```dvc
  $ dvc remote modify myremote endpointurl https://myendpoint.com
  ```

- `access_key_id` - AWS Access Key ID. May be used (along with
  `secret_access_key`) instead of `credentialpath`:

  ```dvc
  $ dvc remote modify --local myremote access_key_id 'mykey'
  ```

- `secret_access_key` - AWS Secret Access Key. May be used (along with
  `access_key_id`) instead of `credentialpath`:

  ```dvc
  $ dvc remote modify --local myremote \
        secret_access_key 'mysecret'
  ```

- `session_token` - AWS
  [MFA](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html)
  session token. May be used (along with `access_key_id` and
  `secret_access_key`) instead of `credentialpath` when MFA is required:

  ```dvc
  $ dvc remote modify --local myremote session_token my-session-token
  ```

- `use_ssl` - whether or not to use SSL. By default, SSL is used.

  ```dvc
  $ dvc remote modify myremote use_ssl false
  ```

- `ssl_verify` - whether or not to verify SSL certificates, or a path to a
  custom CA certificates bundle to do so (implies `true`). The certs in
  [AWS CLI config](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-settings)
  (if any) are used by default.

  ```dvc
  $ dvc remote modify myremote ssl_verify false
  # or
  $ dvc remote modify myremote ssl_verify path/to/ca_bundle.pem
  ```

> The credentials file path, access key and secret, and other options contains
> sensitive user info. Therefore, it's safer to add it with the `--local`
> option, so it's written to a Git-ignored config file.

**Operational details**

Make sure you have the following permissions enabled: `s3:ListBucket`,
`s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`. This enables the S3 API
methods that are performed by DVC (`list_objects_v2` or `list_objects`,
`head_object`, `upload_file`, `download_file`, `delete_object`, `copy`).

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
  $ dvc remote modify --local myremote sse_kms_key_id 'key-alias'
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
  >
  > **References**
  >
  > - [ACL Overview - Permissions](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#permissions)
  > - [Put Object ACL](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectAcl.html)

Note that S3 remotes can also be configured via environment variables (instead
of `dvc remote modify`). These are tried if none of the params above are set.

Authentication example:

```dvc
$ dvc remote add -d myremote s3://mybucket/path
$ export AWS_ACCESS_KEY_ID='mykey'
$ export AWS_SECRET_ACCESS_KEY='mysecret'
$ dvc remote push
```

For more on the supported env vars, please see the
[boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#using-environment-variables)

</details>

<details>

### Click for S3-compatible storage

- `endpointurl` - URL to connect to the S3-compatible storage server or service
  (e.g. [Minio](https://min.io/),
  [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
  [IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) etc.):

  ```dvc
  $ dvc remote modify myremote endpointurl https://storage.example.com
  ```

Any other S3 parameter (see previous section) can also be set for S3-compatible
storage. Whether they're effective depends on each storage platform.

</details>

<details>

### Click for Microsoft Azure Blob Storage

- `url` (required) - remote location, in the `azure://<container>/<object>`
  format:

  ```dvc
  $ dvc remote modify myremote url azure://mycontainer/path
  ```

  Note that if the given container name isn't found in your account, DVC will
  attempt to create it.

- `account_name` (required) - storage account name

  ```dvc
  $ dvc remote modify myremote account_name 'myuser'
  ```

By default, DVC authenticates using an `account_name` and its [default
credential] (if any), which uses environment variables (e.g. set by `az cli`) or
a Microsoft application.

[default credential]:
  https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential

<details>

#### For Windows users

When using default authentication, you may need to enable some of these
exclusion parameters depending on your setup
([details][azure-default-cred-params]):

[azure-default-cred-params]:
  https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python#parameters

```dvc
$ dvc remote modify --system myremote
                    exclude_environment_credential true
$ dvc remote modify --system myremote
                    exclude_visual_studio_code_credential true
$ dvc remote modify --system myremote
                    exclude_shared_token_cache_credential true
$ dvc remote modify --system myremote
                    exclude_managed_identity_credential true
```

</details>

To use a custom authentication method, use the following parameters (listed in
order of precedence):

1. `connection_string` is used for authentication if given (all others params
   are ignored).
2. If `tenant_id` and `client_id` or `client_secret` are given, Active Directory
   (AD)
   [service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)
   auth is performed.
3. DVC will try next to connect with `account_key` or `sas_token` (in this
   order) if either are provided.
4. If `allow_anonymous_login` is set to `True`, then DVC will try to connect
   [anonymously](https://docs.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure).

> The authentication values below may contain sensitive user info. Therefore,
> it's safer to use the `--local` flag so they're written to a Git-ignored
> [config file](https://dvc.org/doc/command-reference/config).

- `connection_string` - Azure Storage
  [connection string](http://azure.microsoft.com/en-us/documentation/articles/storage-configure-connection-string/)
  (recommended).

  ```dvc
  $ dvc remote modify --local myremote connection_string 'mysecret'
  ```

* `tenant_id` - tenant ID for AD _service principal_ authentication (requires
  `client_id` and `client_secret` along with this):

  ```dvc
  $ dvc remote modify --local myremote tenant_id 'directory-id'
  ```

* `client_id` - client ID for _service principal_ authentication (when
  `tenant_id` is set):

  ```dvc
  $ dvc remote modify --local myremote client_id 'client-id'
  ```

* `client_secret` - client Secret for _service principal_ authentication (when
  `tenant_id` is set):

  ```dvc
  $ dvc remote modify --local myremote client_secret 'client-secret'
  ```

* `account_key` - storage account key:

  ```dvc
  $ dvc remote modify --local myremote account_key 'mysecret'
  ```

* `sas_token` - shared access signature token:

  ```dvc
  $ dvc remote modify --local myremote sas_token 'mysecret'
  ```

* `allow_anonymous_login` - whether to fall back to anonymous login if no other
  auth params are given (besides `account_name`). This will only work with
  public buckets:

  ```dvc
  $ dvc remote modify myremote allow_anonymous_login true
  ```

Note that Azure remotes can also authenticate via environment variables (instead
of `dvc remote modify`). These are tried if none of the params above are set.

For Azure connection string:

```dvc
$ export AZURE_STORAGE_CONNECTION_STRING='mysecret'
```

For account name and key/token auth:

```dvc
$ export AZURE_STORAGE_ACCOUNT='myuser'
# and
$ export AZURE_STORAGE_KEY='mysecret'
# or
$ export AZURE_STORAGE_SAS_TOKEN='mysecret'
```

For _service principal_ auth (via certificate file):

```dvc
$ export AZURE_TENANT_ID='directory-id'
$ export AZURE_CLIENT_ID='client-id'
$ export AZURE_CLIENT_CERTIFICATE_PATH='/path/to/certificate'
```

For simple username/password login:

```dvc
$ export AZURE_CLIENT_ID='client-id'
$ export AZURE_USERNAME='myuser'
$ export AZURE_PASSWORD='mysecret'
```

> See also description here for some
> [env vars](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential)
> available.

</details>

<details>

### Click for Google Drive

Please see
[Set up a Google Drive DVC Remote](/doc/user-guide/setup-google-drive-remote)
for a full guide on using Google Drive as DVC remote storage.

- `url` - remote location. See
  [valid URL format](/doc/user-guide/setup-google-drive-remote#url-format).

  ```dvc
  $ dvc remote modify myremote url \
                      gdrive://0AIac4JZqHhKmUk9PDA/dvcstore
  ```

- `gdrive_client_id` - Client ID for authentication with OAuth 2.0 when using a
  [custom Google Client project](/doc/user-guide/setup-google-drive-remote#using-a-custom-google-cloud-project-recommended).
  Also requires using `gdrive_client_secret`.

  ```dvc
  $ dvc remote modify myremote gdrive_client_id 'client-id'
  ```

- `gdrive_client_secret` - Client secret for authentication with OAuth 2.0 when
  using a custom Google Client project. Also requires using `gdrive_client_id`.

  ```dvc
  $ dvc remote modify myremote \
        gdrive_client_secret 'client-secret'
  ```

- `gdrive_user_credentials_file` - path where DVC stores OAuth credentials to
  access Google Drive data. `.dvc/tmp/gdrive-user-credentials.json` by default.

  ```dvc
  $ dvc remote modify myremote \
        gdrive_user_credentials_file .dvc/tmp/mycredentials.json
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

- `gdrive_use_service_account` - authenticate using a service account. Make sure
  that the service account has read/write access (as needed) to the file
  structure in the remote `url`.

  ```dvc
  $ dvc remote modify myremote gdrive_use_service_account true
  ```

- `gdrive_service_account_json_file_path` - path to the Google Project's service
  account `.json` key file (credentials).

  ```dvc
  $ dvc remote modify --local myremote \
                      gdrive_service_account_json_file_path \
                      path/to/file.json
  ```

- `gdrive_service_account_user_email` - the authority of a user account can be
  [delegated] to the service account if needed.

  ```dvc
  $ dvc remote modify myremote \
                 gdrive_service_account_user_email 'myemail-addr'
  ```

  ⚠️ DVC requires the following OAuth Scopes:

  - `https://www.googleapis.com/auth/drive`
  - `https://www.googleapis.com/auth/drive.appdata`

[delegated]:
  https://developers.google.com/admin-sdk/directory/v1/guides/delegation

</details>

<details>

### Click for Google Cloud Storage

- `url` - remote location, in the `gs://<bucket>/<object>` format:

  ```dvc
  $ dvc remote modify myremote url gs://mybucket/path
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
  $ dvc remote modify --local myremote \
          credentialpath '/home/.../project-XXX.json'
  ```

> The `credentialpath` value may contain personal user info. Therefore, it's
> convenient to use the `--local` flag so it's written to a Git-ignored
> [config file](https://dvc.org/doc/command-reference/config).

Alternatively, the `GOOGLE_APPLICATION_CREDENTIALS` environment variable can be
set:

```dvc
$ export GOOGLE_APPLICATION_CREDENTIALS='.../project-XXX.json'
```

</details>

<details>

### Click for Aliyun OSS

- `url` - remote location, in the `oss://<bucket>/<object>` format:

  ```dvc
  $ dvc remote modify myremote url oss://mybucket/path
  ```

- `oss_endpoint` -
  [OSS endpoint](https://www.alibabacloud.com/help/doc-detail/31837.html) values
  for accessing the remote container.

  ```dvc
  $ dvc remote modify myremote oss_endpoint endpoint
  ```

- `oss_key_id` - OSS key ID to access the remote.

  ```dvc
  $ dvc remote modify --local myremote oss_key_id 'mykey'
  ```

- `oss_key_secret` - OSS secret key for authorizing access into the remote.

  ```dvc
  $ dvc remote modify --local myremote oss_key_secret 'mysecret'
  ```

> The key ID and secret key contain sensitive user info. Therefore, it's safer
> to add them with the `--local` option, so they're written to a Git-ignored
> config file.

Note that OSS remotes can also be configured via environment variables (instead
of `dvc remote modify`). These are tried if none of the params above are set.
The available ones are shown below:

```dvc
$ export OSS_ACCESS_KEY_ID='mykey'
$ export OSS_ACCESS_KEY_SECRET='mysecret'
$ export OSS_ENDPOINT='endpoint'
```

</details>

<details>

### Click for SSH

- `url` - remote location, in a regular
  [SSH format](https://tools.ietf.org/id/draft-salowey-secsh-uri-00.html#sshsyntax).
  Note that this can already include the `user` parameter, embedded into the
  URL:

  ```dvc
  $ dvc remote modify myremote url \
                      ssh://user@example.com:1234/path
  ```

  ⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
  Please check that you are able to connect both ways with tools like `ssh` and
  `sftp` (GNU/Linux).

  > Note that your server's SFTP root might differ from its physical root (`/`).

- `user` - user name to access the remote:

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC picks the user name:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `ssh://user@example.com/path`);
  3. User defined in the SSH config file (e.g. `~/.ssh/config`) for this host
     (URL);
  4. Current system user

- `port` - port to access the remote.

  ```dvc
  $ dvc remote modify myremote port 2222
  ```

  The order in which DVC decide the port number:

  1. `port` parameter set with this command (found in `.dvc/config`);
  2. Port defined in the URL (e.g. `ssh://example.com:1234/path`);
  3. Port defined in the SSH config file (e.g. `~/.ssh/config`) for this host
     (URL);
  4. Default SSH port 22

- `keyfile` - path to private key to access the remote.

  ```dvc
  $ dvc remote modify --local myremote keyfile /path/to/keyfile
  ```

- `password` - a private key passphrase or a password to access the remote.

  ```dvc
  $ dvc remote modify --local myremote password mypassword
  ```

> The user name and password (may) contain sensitive user info. Therefore, it's
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
  `pip install 'dvc[ssh_gssapi]'`. Other packages (Conda, Windows, and macOS
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
  $ dvc remote modify myremote url hdfs://user@example.com/path
  ```

- `user` - user name to access the remote.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

> The user name may contain sensitive user info. Therefore, it's safer to add it
> with the `--local` option, so it's written to a Git-ignored config file.

- `kerb_ticket` - path to the Kerberos ticket cache for Kerberos-secured HDFS
  clusters

  ```dvc
  $ dvc remote modify --local myremote \
                              kerb_ticket /path/to/ticket/cache
  ```

</details>

<details>

### Click for WebHDFS

💡 WebHDFS serves as an alternative for using the same remote storage supported
by HDFS. Read more about by expanding the WebHDFS section in
[`dvc remote add`](/doc/command-reference/remote/add#supported-storage-types).

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url webhdfs://user@example.com/path
  ```

- `user` - user name to access the remote, can be empty in case of using `token`
  or if using a `HdfsCLI` cfg file. May only be used when Hadoop security is
  off. Defaults to current user as determined by `whoami`.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

- `token` - Hadoop delegation token for WebHDFS, can be empty in case of using
  `user` or if using a `HdfsCLI` cfg file. May be used when Hadoop security is
  on.

  ```dvc
  $ dvc remote modify --local myremote token 'mytoken'
  ```

- `hdfscli_config` - path to a `HdfsCLI` cfg file. WebHDFS access depends on
  `HdfsCLI`, which allows the usage of a configuration file by default located
  in `~/.hdfscli.cfg` (Linux). In the file, multiple aliases can be set with
  their own connection parameters, like `url` or `user`. If using a cfg file,
  `webhdfs_alias` can be set to specify which alias to use.

  ```dvc
  $ dvc remote modify --local myremote hdfscli_config \
                                `/path/to/.hdfscli.cfg`
  ```

  Sample configuration file:

  ```ini
  [global]
  default.alias = myalias

  [myalias.alias]
  url = http://example.com/path
  user = myuser

  [production.alias]
  url = http://prodexample.com/path
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

> The user name, token, webhdfs_alias, and hdfscli_config may contain sensitive
> user info. Therefore, it's safer to add it with the `--local` option, so it's
> written to a Git-ignored config file.

</details>

<details>

### Click for HTTP

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url https://example.com/path
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
  $ dvc remote modify --local myremote \
                        custom_auth_header 'My-Header'
  ```

- `user` - user name to use when the `auth` parameter is set to `basic` or
  `digest`.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC picks the user name:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `http://user@example.com/path`);

- `password` - password to use for any `auth` method.

  ```dvc
  $ dvc remote modify --local myremote password mypassword
  ```

> The user name and password (may) contain sensitive user info. Therefore, it's
> safer to add them with the `--local` option, so they're written to a
> Git-ignored config file.

- `ask_password` - ask each time for the password to use for any `auth` method.

  ```dvc
  $ dvc remote modify myremote ask_password true
  ```

  > Note that the `password` parameter takes precedence over `ask_password`. If
  > `password` is specified, DVC will not prompt the user to enter a password
  > for this remote.

- `ssl_verify` - whether or not to verify SSL certificates, or a path to a
  custom CA bundle to do so (`true` by default).

  ```dvc
  $ dvc remote modify myremote ssl_verify false
  # or
  $ dvc remote modify myremote ssl_verify path/to/ca_bundle.pem
  ```

</details>

<details>

### Click for WebDAV

- `url` - remote location:

  ```dvc
  $ dvc remote modify myremote url \
      webdavs://example.com/nextcloud/remote.php/dav/files/myuser/
  ```

- `token` - token for WebDAV server, can be empty in case of using
  `user/password` authentication.

  ```dvc
  $ dvc remote modify --local myremote token 'mytoken'
  ```

- `user` - user name for WebDAV server, can be empty in case of using `token`
  authentication.

  ```dvc
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC searches for user name is:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `webdavs://user@example.com/endpoint/path`)

- `password` - password for WebDAV server, can be empty in case of using `token`
  authentication.

  ```dvc
  $ dvc remote modify --local myremote password mypassword
  ```

> The user name, password, and token (may) contain sensitive user info.
> Therefore, it's safer to add them with the `--local` option, so they're
> written to a Git-ignored config file.

> Note that `user/password` and `token` authentication are incompatible. You
> should authenticate against your WebDAV remote by either `user/password` or
> `token`.

- `ask_password` - ask each time for the password to use for `user/password`
  authentication. This has no effect if `password` or `token` are set.

  ```dvc
  $ dvc remote modify myremote ask_password true
  ```

- `ssl_verify` - whether or not to verify SSL certificates, or a path to a
  custom CA bundle to do so (`true` by default).

  ```dvc
  $ dvc remote modify myremote ssl_verify false
  # or
  $ dvc remote modify myremote ssl_verify path/to/ca_bundle.pem
  ```

- `cert_path` - path to certificate used for WebDAV server authentication, if
  you need to use local client side certificates.

  ```dvc
  $ dvc remote modify --local myremote cert_path /path/to/cert
  ```

- `key_path` - path to private key to use to access a remote. Only has an effect
  in combination with `cert_path`.

  ```dvc
  $ dvc remote modify --local myremote key_path /path/to/key
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
$ dvc remote modify myremote profile myuser
```

Now the project config file should look like this:

```ini
['remote "myremote"']
url = s3://mybucket/path
profile = myuser
[core]
remote = myremote
```
