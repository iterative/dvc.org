# remote modify

Configure a [DVC remote](/doc/user-guide/data-management/remote-storage).

<admon type="tip">

This command is commonly needed after `dvc remote add` or `dvc remote default`
to set up credentials or for other customizations specific to the
[storage type](#available-parameters-per-storage-type).

</admon>

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

- `url` - the remote location (URL or path) can always be modified. See each
  type in the next section for valid URL formats.

  <admon type="info">

  This is how DVC determines what type of remote this is, and thus which other
  config options can be modified.

  </admomn>

- `jobs` - change the default number of processes for
  [remote storage](/doc/command-reference/remote) synchronization operations
  (see the `--jobs` option of `dvc push`, `dvc pull`, `dvc import`,
  `dvc update`, `dvc gc -c`, etc.). Accepts positive integers. The default is
  `4 \* cpu_count()`.

  ```cli
  $ dvc remote modify myremote jobs 8
  ```

- `verify` - set to `true` for `dvc pull` and `dvc fetch` to recalculate file
  hashes to check whether their contents have changed (compared to the values
  saved in the corresponding <abbr>metafile</abbr>). This may slow down the
  operations.

  <admon type="info">

  Note that this option is enabled on **Google Drive** remotes by default.

  </admon>

  ```cli
  $ dvc remote modify myremote verify true
  ```

## Available parameters per storage type

The following are the types of remote storage (protocols) and their config
options:

<details>

### Amazon S3

This is a summary. See more
[details and options](/doc/remote-reference/amazon-s3).

- `url` - update the S3 location. Format: `s3://<bucket>/<key>`

- `version_aware`, `worktree` - enable a [cloud versioning] strategy.

[cloud versioning]: /docs/user-guide/data-management/cloud-versioning

**Authentication**

<admon type="info">

The AWS user needs the following permissions: `s3:ListBucket`, `s3:GetObject`,
`s3:PutObject`, `s3:DeleteObject`.

</admon>

<admon type="warn">

The `--local` flag is needed to write sensitive user info to a Git-ignored
config file (`.dvc/config.local`) so that no secrets are leaked through Git. See
`dvc config` for more info. Example:

```cli
$ dvc remote modify --local myremote \
                    access_key_id 'mysecret'
$ dvc remote modify --local myremote \
                    secret_access_key 'mysecret'
```

</admon>

- `configpath`, `credentialpath`, `profile` - custom AWS CLI [config and/or
  credential file] paths, and [profile] name

- `access_key_id`, `secret_access_key`, `session_token` - AWS access key ID,
  secret access key, and [MFA] session token (when required). May be used
  instead of `credentialpath`.

[config and/or credential file]:
  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
[profile]:
  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[MFA]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html

**Other**

- `region` - specific AWS region

  ```cli
  $ dvc remote modify myremote region 'us-east-2'
  ```

- `endpointurl` - custom endpoint to use non-Amazon
  [S3-compatible storage](#s3-compatible-storage)

- `read_timeout`, `connect_timeout` - time in seconds until a timeout exception
  is thrown when attempting to read or connect (60 by default).

- `listobjects` - whether to use the `list_objects()` S3 API method instead of
  the default `list_objects_v2()`

- `use_ssl`, `ssl_verify` - used to enable and setup SSL

- `sse`, `sse_kms_key_id`, `sse_customer_key`, `sse_customer_algorithm` - enable
  and configure [server-side encryption].

- `acl` - object-level access control list ([ACL])

- `grant_read`, `grant_read_acp`, `grant_read_acp`, `grant_write_acp`,
  `grant_full_control` - grant object-level ACL [permissions] to specific
  [grantees].

[server-side encryption]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html
[ACL]: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
[grantees]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#specifying-grantee
[permissions]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#permissions

</details>

<details>

### S3-compatible storage

- `endpointurl` - URL to connect to the S3-compatible storage server or service
  (e.g. [Minio](https://min.io/),
  [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
  [IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) etc.):

  ```cli
  $ dvc remote modify myremote \
                      endpointurl https://storage.example.com
  ```

Any other S3 parameter (see previous section) can also be set for S3-compatible
storage. Whether they're effective depends on each storage platform.

</details>

<details>

### Microsoft Azure Blob Storage

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` (required) - remote location, in the `azure://<container>/<object>`
  format:

  ```cli
  $ dvc remote modify myremote url azure://mycontainer/path
  ```

  Note that if the given container name isn't found in your account, DVC will
  attempt to create it.

- `account_name` - storage account name. Required for every authentication
  method except `connection_string` (which already includes it).

  ```cli
  $ dvc remote modify myremote account_name 'myaccount'
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

```cli
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

To use a custom authentication method, you can either use this command to
configure the appropriate auth params, use environment variables, or rely on an
Azure config file (in that order). More details below.

> See some [Azure auth examples](#example-some-azure-authentication-methods).

#### Authenticate with DVC config parameters

The following parameters are listed in the order they are used by DVC when
attempting to authenticate with Azure:

1. `connection_string` is used for authentication if given (`account_name` is
   ignored).
2. If `tenant_id` and `client_id`, `client_secret` are given, Active Directory
   (AD) [service principal] auth is performed.
3. DVC will next try to connect with `account_key` or `sas_token` (in this
   order) if either are provided.
4. If `allow_anonymous_login` is set to `True`, then DVC will try to connect
   [anonymously].

[service principal]:
  https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal
[anonymously]:
  https://docs.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure

- `connection_string` - Azure Storage
  [connection string](http://azure.microsoft.com/en-us/documentation/articles/storage-configure-connection-string/)
  (recommended).

  ```cli
  $ dvc remote modify --local myremote \
                              connection_string 'mysecret'
  ```

* `tenant_id` - tenant ID for AD _service principal_ authentication (requires
  `client_id` and `client_secret` along with this):

  ```cli
  $ dvc remote modify --local myremote tenant_id 'mytenant'
  ```

* `client_id` - client ID for _service principal_ authentication (when
  `tenant_id` is set):

  ```cli
  $ dvc remote modify --local myremote client_id 'myclient'
  ```

* `client_secret` - client Secret for _service principal_ authentication (when
  `tenant_id` is set):

  ```cli
  $ dvc remote modify --local myremote client_secret 'mysecret'
  ```

* `account_key` - storage account key:

  ```cli
  $ dvc remote modify --local myremote account_key 'mykey'
  ```

* `sas_token` - shared access signature token:

  ```cli
  $ dvc remote modify --local myremote sas_token 'mysecret'
  ```

* `allow_anonymous_login` - whether to fall back to anonymous login if no other
  auth params are given (besides `account_name`). This will only work with
  public buckets:

  ```cli
  $ dvc remote modify myremote allow_anonymous_login true
  ```

#### Authenticate with environment variables

Azure remotes can also authenticate via env vars (instead of
`dvc remote modify`). These are tried if none of the params above are set.

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

> See also description here for some
> [env vars](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential)
> available.

#### Authenticate with an Azure config file

As a final option (if no params or env vars are set), some of the auth methods
can propagate from an Azure configuration file (typically managed with
[az config](https://docs.microsoft.com/en-us/cli/azure/config)):
`connection_string`, `account_name`, `account_key`, `sas_token` and
`container_name`. The default directory where it will be searched for is
`~/.azure` but this can be customized with the `AZURE_CONFIG_DIR` env var.

- `version_aware` - Use
  [version-aware](/docs/user-guide/data-management/cloud-versioning#version-aware-remotes)
  cloud versioning features for this Azure remote. Files stored in the remote
  will retain their original filenames and directory hierarchy, and different
  versions of files will be stored as separate versions of the corresponding
  object in the remote.

- `worktree` - Use
  [worktree](/docs/user-guide/data-management/cloud-versioning#worktree-remotes)
  cloud versioning features for this Azure remote. Files stored in the remote
  will retain their original filenames and directory hierarchy, and different
  versions of files will be stored as separate versions of the corresponding
  object in cloud storage. DVC will also attempt to ensure that the current
  version of objects in the remote match the latest version of files in the DVC
  repository. When both `version_aware` and `worktree` are set, `worktree` takes
  precedence.

<admon type="tip">

The `version_aware` and `worktree` options require that
[Blob versioning](https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview)
be enabled on the specified Azure storage account and container.

</admon>

</details>

<details>

### Google Drive

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

Please see
[Set up a Google Drive DVC Remote](/doc/user-guide/how-to/setup-google-drive-remote)
for a full guide on using Google Drive as DVC remote storage.

- `url` - remote location. See
  [valid URL format](/doc/user-guide/how-to/setup-google-drive-remote#url-format).

  ```cli
  $ dvc remote modify myremote url \
                      gdrive://0AIac4JZqHhKmUk9PDA/dvcstore
  ```

- `gdrive_client_id` - Client ID for authentication with OAuth 2.0 when using a
  [custom Google Client project](/doc/user-guide/how-to/setup-google-drive-remote#using-a-custom-google-cloud-project-recommended).
  Also requires using `gdrive_client_secret`.

  ```cli
  $ dvc remote modify myremote gdrive_client_id 'client-id'
  ```

- `gdrive_client_secret` - Client secret for authentication with OAuth 2.0 when
  using a custom Google Client project. Also requires using `gdrive_client_id`.

  ```cli
  $ dvc remote modify myremote gdrive_client_secret 'client-secret'
  ```

- `profile` - file basename used to cache OAuth credentials. Helpful to avoid
  using the wrong credentials when multiple GDrive remotes use the same
  `gdrive_client_id`. The default value is `default`.

  ```cli
  $ dvc remote modify --local myremote profile myprofile
  ```

- `gdrive_user_credentials_file` - specific file path to cache OAuth
  credentials. The default is
  `$CACHE_HOME/pydrive2fs/{gdrive_client_id}/default.json` (unless `profile` is
  specified), where the `CACHE_HOME` location per platform is:

  | macOS              | Linux (\*typical) | Windows                 |
  | ------------------ | ----------------- | ----------------------- |
  | `~/Library/Caches` | `~/.cache`        | `%CSIDL_LOCAL_APPDATA%` |

  ```cli
  $ dvc remote modify myremote \
        gdrive_user_credentials_file path/to/mycredentials.json
  ```

See
[Authorization](/doc/user-guide/how-to/setup-google-drive-remote#authorization)
for more details.

- `gdrive_trash_only` - configures `dvc gc` to move remote files to
  [trash](https://developers.google.com/drive/api/v2/reference/files/trash)
  instead of
  [deleting](https://developers.google.com/drive/api/v2/reference/files/delete)
  them permanently. `false` by default, meaning "delete". Useful for shared
  drives/folders, where delete permissions may not be given.

  ```cli
  $ dvc remote modify myremote gdrive_trash_only true
  ```

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).

- `gdrive_acknowledge_abuse` - acknowledge the risk of downloading potentially
  [abusive](https://support.google.com/docs/answer/148505) files. Anything
  identified as such (malware, personal info., etc.) can only be downloaded by
  their owner (with this param enabled).

  ```cli
  $ dvc remote modify myremote gdrive_acknowledge_abuse true
  ```

**For service accounts:**

A service account is a Google account associated with your GCP project, and not
a specific user. Please refer to
[Using service accounts](https://cloud.google.com/iam/docs/service-accounts) for
more information.

- `gdrive_use_service_account` - authenticate using a service account. Make sure
  that the service account has read/write access (as needed) to the file
  structure in the remote `url`.

  ```cli
  $ dvc remote modify myremote gdrive_use_service_account true
  ```

- `gdrive_service_account_json_file_path` - path to the Google Project's service
  account `.json`
  [key file](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account)
  (credentials).

  ```cli
  $ dvc remote modify --local myremote \
                      gdrive_service_account_json_file_path \
                      path/to/file.json
  ```

- `gdrive_service_account_user_email` - the authority of a user account can be
  [delegated] to the service account if needed.

  ```cli
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

### Google Cloud Storage

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location, in the `gs://<bucket>/<object>` format:

  ```cli
  $ dvc remote modify myremote url gs://mybucket/path
  ```

- `projectname` - override or provide a project name to use, if a default one is
  not set.

  ```cli
  $ dvc remote modify myremote projectname myproject
  ```

**For service accounts:**

A service account is a Google account associated with your GCP project, and not
a specific user. Please refer to
[Using service accounts](https://cloud.google.com/iam/docs/service-accounts) for
more information.

- `credentialpath` - path to the file that contains the
  [service account key](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account).
  Make sure that the service account has read/write access (as needed) to the
  file structure in the remote `url`.

  ```cli
  $ dvc remote modify --local myremote \
          credentialpath '/home/.../project-XXX.json'
  ```

Alternatively, the `GOOGLE_APPLICATION_CREDENTIALS` environment variable can be
set:

```cli
$ export GOOGLE_APPLICATION_CREDENTIALS='.../project-XXX.json'
```

- `version_aware` - Use
  [version-aware](/docs/user-guide/data-management/cloud-versioning#version-aware-remotes)
  cloud versioning features for this Google Cloud Storage remote. Files stored
  in the remote will retain their original filenames and directory hierarchy,
  and different versions of files will be stored as separate versions of the
  corresponding object in the remote.

- `worktree` - Use
  [worktree](/docs/user-guide/data-management/cloud-versioning#worktree-remotes)
  cloud versioning features for this Google Cloud Storage remote. Files stored
  in the remote will retain their original filenames and directory hierarchy,
  and different versions of files will be stored as separate versions of the
  corresponding object in cloud storage. DVC will also attempt to ensure that
  the current version of objects in the remote match the latest version of files
  in the DVC repository. When both `version_aware` and `worktree` are set,
  `worktree` takes precedence.

<admon type="tip">

The `version_aware` and `worktree` options require that
[Object versioning](https://cloud.google.com/storage/docs/object-versioning) be
enabled on the specified bucket.

</admon>

</details>

<details>

### Aliyun OSS

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location, in the `oss://<bucket>/<object>` format:

  ```cli
  $ dvc remote modify myremote url oss://mybucket/path
  ```

- `oss_endpoint` -
  [OSS endpoint](https://www.alibabacloud.com/help/doc-detail/31837.html) values
  for accessing the remote container.

  ```cli
  $ dvc remote modify myremote oss_endpoint endpoint
  ```

- `oss_key_id` - OSS key ID to access the remote.

  ```cli
  $ dvc remote modify --local myremote oss_key_id 'mykey'
  ```

- `oss_key_secret` - OSS secret key for authorizing access into the remote.

  ```cli
  $ dvc remote modify --local myremote oss_key_secret 'mysecret'
  ```

Note that OSS remotes can also be configured via environment variables (instead
of `dvc remote modify`). These are tried if none of the params above are set.
The available ones are shown below:

```cli
$ export OSS_ACCESS_KEY_ID='mykey'
$ export OSS_ACCESS_KEY_SECRET='mysecret'
$ export OSS_ENDPOINT='endpoint'
```

</details>

<details>

### SSH

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location, in a regular
  [SSH format](https://tools.ietf.org/id/draft-salowey-secsh-uri-00.html#sshsyntax).
  Note that this can already include the `user` parameter, embedded into the
  URL:

  ```cli
  $ dvc remote modify myremote url \
                      ssh://user@example.com:1234/path
  ```

  ⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
  Please check that you are able to connect both ways with tools like `ssh` and
  `sftp` (GNU/Linux).

  > Note that your server's SFTP root might differ from its physical root (`/`).

- `user` - user name to access the remote:

  ```cli
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC picks the user name:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `ssh://user@example.com/path`);
  3. User defined in the SSH config file (e.g. `~/.ssh/config`) for this host
     (URL);
  4. Current system user

- `port` - port to access the remote.

  ```cli
  $ dvc remote modify myremote port 2222
  ```

  The order in which DVC decide the port number:

  1. `port` parameter set with this command (found in `.dvc/config`);
  2. Port defined in the URL (e.g. `ssh://example.com:1234/path`);
  3. Port defined in the SSH config file (e.g. `~/.ssh/config`) for this host
     (URL);
  4. Default SSH port 22

- `keyfile` - path to private key to access the remote.

  ```cli
  $ dvc remote modify --local myremote keyfile /path/to/keyfile
  ```

- `password` - a password to access the remote

  ```cli
  $ dvc remote modify --local myremote password mypassword
  ```

- `ask_password` - ask for a password to access the remote.

  ```cli
  $ dvc remote modify myremote ask_password true
  ```

- `passphrase` - a private key passphrase to access the remote

  ```cli
  $ dvc remote modify --local myremote passphrase mypassphrase
  ```

- `ask_passphrase` - ask for a private key passphrase to access the remote.

  ```cli
  $ dvc remote modify myremote ask_passphrase true
  ```

- `gss_auth` - use Generic Security Services authentication if available on host
  (for example,
  [with kerberos](https://en.wikipedia.org/wiki/Generic_Security_Services_Application_Program_Interface#Relationship_to_Kerberos)).
  Using this param requires `paramiko[gssapi]`, which is currently only
  supported by our pip package, and could be installed with
  `pip install 'dvc[ssh_gssapi]'`. Other packages (Conda, Windows, and macOS
  PKG) do not support it.

  ```cli
  $ dvc remote modify myremote gss_auth true
  ```

- `allow_agent` - whether to use [SSH agents](https://www.ssh.com/ssh/agent)
  (`true` by default). Setting this to `false` is useful when `ssh-agent` is
  causing problems, such as a "No existing session" error:

  ```cli
  $ dvc remote modify myremote allow_agent false
  ```

</details>

<details>

### HDFS

💡 Using a HDFS cluster as remote storage is also supported via the WebHDFS API.
Read more about by expanding the WebHDFS section in
[`dvc remote add`](/doc/command-reference/remote/add#supported-storage-types).

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location:

  ```cli
  $ dvc remote modify myremote url hdfs://user@example.com/path
  ```

- `user` - user name to access the remote.

  ```cli
  $ dvc remote modify --local myremote user myuser
  ```

- `kerb_ticket` - path to the Kerberos ticket cache for Kerberos-secured HDFS
  clusters

  ```cli
  $ dvc remote modify --local myremote \
                              kerb_ticket /path/to/ticket/cache
  ```

</details>

<details>

### WebHDFS

💡 WebHDFS serves as an alternative for using the same remote storage supported
by HDFS. Read more about by expanding the WebHDFS section in
[`dvc remote add`](/doc/command-reference/remote/add#supported-storage-types).

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location:

  ```cli
  $ dvc remote modify myremote url webhdfs://user@example.com/path
  ```

  > Do not provide a `user` in the URL with `kerberos` or `token`
  > authentication.

- `user` - user name to access the remote. Do not set this with `kerberos` or
  `token` authentication.

  ```cli
  $ dvc remote modify --local myremote user myuser
  ```

- `kerberos` - enable Kerberos authentication (`false` by default):

  ```cli
  $ dvc remote modify myremote kerberos true
  ```

- `kerberos_principal` - [Kerberos principal] to use, in case you have multiple
  ones (for example service accounts). Only used if `kerberos` is `true`.

  ```cli
  $ dvc remote modify myremote kerberos_principal myprincipal
  ```

  [kerberos principal]:
    https://web.mit.edu/kerberos/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html

- `proxy_to` - Hadoop [superuser] to proxy as. _Proxy user_ feature must be
  enabled on the cluster, and the user must have the correct access rights. If
  the cluster is secured, Kerberos must be enabled (set `kerberos` to `true`)
  for this to work. This parameter is incompatible with `token`.

  ```cli
  $ dvc remote modify myremote proxy_to myuser
  ```

  [superuser]:
    https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/Superusers.html

- `use_https` - enables SWebHdfs. Note that DVC still expects the protocol in
  `url` to be `webhdfs://`, and will fail if `swebhdfs://` is used.

  ```cli
  $ dvc remote modify myremote use_https true
  ```

  [swebhdfs]:
    https://hadoop.apache.org/docs/r3.1.0/api/org/apache/hadoop/fs/SWebHdfs.html

- `ssl_verify` - whether to verify SSL requests. Defaults to `true` when
  `use_https` is enabled, `false` otherwise.

  ```cli
  $ dvc remote modify myremote ssl_verify false
  ```

- `token` - Hadoop [delegation token] (as returned by the [WebHDFS API]). If the
  cluster is secured, Kerberos must be enabled (set `kerberos` to `true`) for
  this to work. This parameter is incompatible with providing a `user` and with
  `proxy_to`.

  ```cli
  $ dvc remote modify myremote token "mysecret"
  ```

  [delegation token]:
    https://hadoop.apache.org/docs/stable/hadoop-aws/tools/hadoop-aws/delegation_tokens.html
  [webhdfs api]:
    https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delegation_Token_Operations

</details>

<details>

### HTTP

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location:

  ```cli
  $ dvc remote modify myremote url https://example.com/path
  ```

  > The URL can include a query string, which will be preserved (e.g.
  > `example.com?loc=path%2Fto%2Fdir`)

- `auth` - authentication method to use when accessing the remote. The accepted
  values are:

  - `basic` -
    [basic authentication scheme](https://tools.ietf.org/html/rfc7617). `user`
    and `password` (or `ask_password`) parameters should also be configured.
  - `digest` (**removed** in 2.7.1) -
    [digest Access Authentication Scheme](https://tools.ietf.org/html/rfc7616).
    `user` and `password` (or `ask_password`) parameters should also be
    configured.
  - `custom` - an additional HTTP header field will be set for all HTTP requests
    to the remote in the form: `custom_auth_header: password`.
    `custom_auth_header` and `password` (or `ask_password`) parameters should
    also be configured.

  ```cli
  $ dvc remote modify myremote auth basic
  ```

- `method` - override the
  [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to
  use for file uploads (e.g. `PUT` should be used for
  [Artifactory](https://www.jfrog.com/confluence/display/JFROG/Artifactory+REST+API)).
  By default, `POST` is used.

  ```cli
  $ dvc remote modify myremote method PUT
  ```

- `custom_auth_header` - HTTP header field name to use when the `auth` parameter
  is set to `custom`.

  ```cli
  $ dvc remote modify --local myremote \
                      custom_auth_header 'My-Header'
  ```

- `user` - user name to use when the `auth` parameter is set to `basic`.

  ```cli
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC picks the user name:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `http://user@example.com/path`);

- `password` - password to use for any `auth` method.

  ```cli
  $ dvc remote modify --local myremote password mypassword
  ```

- `ask_password` - ask each time for the password to use for any `auth` method.

  ```cli
  $ dvc remote modify myremote ask_password true
  ```

  > Note that the `password` parameter takes precedence over `ask_password`. If
  > `password` is specified, DVC will not prompt the user to enter a password
  > for this remote.

- `ssl_verify` - whether or not to verify SSL certificates, or a path to a
  custom CA bundle to do so (`true` by default).

  ```cli
  $ dvc remote modify myremote ssl_verify false
  # or
  $ dvc remote modify myremote ssl_verify path/to/ca_bundle.pem
  ```

- `read_timeout` - set the time in seconds till a timeout exception is thrown
  when attempting to read a portion of data from a connection (60 by default).
  Let's set it to 5 minutes for example:

  ```cli
  $ dvc remote modify myremote read_timeout 300
  ```

- `connect_timeout` - set the time in seconds till a timeout exception is thrown
  when attempting to make a connection (60 by default). Let's set it to 5
  minutes for example:

  ```cli
  $ dvc remote modify myremote connect_timeout 300
  ```

</details>

<details>

### WebDAV

> If any values given to the parameters below contain sensitive user info, add
> them with the `--local` option, so they're written to a Git-ignored config
> file.

- `url` - remote location:

  ```cli
  $ dvc remote modify myremote url \
      webdavs://example.com/nextcloud/remote.php/dav/files/myuser/
  ```

- `token` - token for WebDAV server, can be empty in case of using
  `user/password` authentication.

  ```cli
  $ dvc remote modify --local myremote token 'mytoken'
  ```

- `user` - user name for WebDAV server, can be empty in case of using `token`
  authentication.

  ```cli
  $ dvc remote modify --local myremote user myuser
  ```

  The order in which DVC searches for user name is:

  1. `user` parameter set with this command (found in `.dvc/config`);
  2. User defined in the URL (e.g. `webdavs://user@example.com/endpoint/path`)

- `password` - password for WebDAV server, can be empty in case of using `token`
  authentication.

  ```cli
  $ dvc remote modify --local myremote password mypassword
  ```

> Note that `user/password` and `token` authentication are incompatible. You
> should authenticate against your WebDAV remote by either `user/password` or
> `token`.

- `ask_password` - ask each time for the password to use for `user/password`
  authentication. This has no effect if `password` or `token` are set.

  ```cli
  $ dvc remote modify myremote ask_password true
  ```

- `ssl_verify` - whether or not to verify SSL certificates, or a path to a
  custom CA bundle to do so (`true` by default).

  ```cli
  $ dvc remote modify myremote ssl_verify false
  # or
  $ dvc remote modify myremote ssl_verify path/to/ca_bundle.pem
  ```

- `cert_path` - path to certificate used for WebDAV server authentication, if
  you need to use local client side certificates.

  ```cli
  $ dvc remote modify --local myremote cert_path /path/to/cert
  ```

- `key_path` - path to private key to use to access a remote. Only has an effect
  in combination with `cert_path`.

  ```cli
  $ dvc remote modify --local myremote key_path /path/to/key
  ```

  > Note that the certificate in `cert_path` might already contain the private
  > key.

- `timeout` - connection timeout (in seconds) for WebDAV server (default: 30).

  ```cli
  $ dvc remote modify myremote timeout 120
  ```

</details>

## Example: Customize an S3 remote

Let's first set up a _default_ S3 remote.

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```cli
$ dvc remote add -d myremote s3://mybucket/path
Setting 'myremote' as a default remote.
```

Modify its access profile:

```cli
$ dvc remote modify myremote profile myprofile
```

Now the project config file should look like this:

```ini
['remote "myremote"']
    url = s3://mybucket/path
    profile = myuser
[core]
    remote = myremote
```

## Example: Some Azure authentication methods

Using a default identity (e.g. credentials set by `az cli`):

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify myremote account_name 'myaccount'
$ dvc push
```

> Note that this may require the `Storage Blob Data Contributor` and other roles
> on the account.

Using a `connection_string`:

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify --local myremote connection_string 'mysecret'
$ dvc push
```

Using `account_key`:

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify --local myremote account_name 'myaccount'
$ dvc remote modify --local myremote account_key 'mysecret'
$ dvc push
```

Using `sas_token`:

```cli
$ dvc remote add -d myremote azure://mycontainer/object
$ dvc remote modify --local myremote account_name 'myaccount'
$ dvc remote modify --local myremote sas_token 'mysecret'
$ dvc push
```
