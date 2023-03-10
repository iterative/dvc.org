# remote modify

Configure an existing `dvc remote`.

<admon type="tip">

This command is commonly needed after `dvc remote add` to set up credentials or
other customizations. See [Remote storage configuration] for more information.

[remote storage configuration]:
  /doc/user-guide/data-management/remote-storage#configuration

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

The DVC remote's `name` and a valid `option` to modify are required. Most
[config parameters](#available-parameters-per-storage-type) are specific to the
[storage type](#supported-storage-types).

This command updates a [`remote`] section in the [config file] (`.dvc/config`):

```cli
$ dvc remote modify temp url /mnt/c/tmp/dvcstore
```

```git
# .dvc/config
['remote "temp"']
-     url = /tmp/dvcstore
+     url = /mnt/c/tmp/dvcstore
```

<admon type="info">

If you [installed DVC] via `pip` and plan to use cloud services as remote
storage, you might need to install these optional dependencies: `[s3]`,
`[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Use `[all]` to include them
all. For example:

```cli
$ pip install "dvc[s3]"
```

[installed dvc]: /doc/install

</admon>

[`remote`]: /doc/command-reference/config#remote
[config file]: /doc/command-reference/config

## Command options/flags

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

- `jobs` - change the default number of processes for remote storage
  synchronization operations (see the `--jobs` option of `dvc push`, `dvc pull`,
  `dvc get`, `dvc import`, `dvc update`, `dvc add --to-remote`, `dvc gc -c`,
  etc.). Accepts positive integers. The default is `4 * cpu_count()`.

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

## Supported storage types

Each type of storage has different config options you can set. See all the
details in the pages linked below.

### Cloud providers

- [Amazon S3] (AWS) and [S3-compatible] e.g. MinIO
- Microsoft [Azure Blob Storage]
- [Google Cloud Storage] (GCP)
- [Google Drive]
- [Aliyun OSS]

[amazon s3]: /doc/user-guide/data-management/remote-storage/amazon-s3
[s3-compatible]:
  /doc/user-guide/data-management/remote-storage/amazon-s3#s3-compatible-servers-non-amazon
[azure blob storage]:
  /doc/user-guide/data-management/remote-storage/azure-blob-storage
[google cloud storage]:
  /doc/user-guide/data-management/remote-storage/google-cloud-storage
[google drive]: /doc/user-guide/data-management/remote-storage/google-drive
[aliyun oss]: /doc/user-guide/data-management/remote-storage/aliyun-oss

### Self-hosted / On-premises

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

<admon type="tip">

Using an HDFS cluster as remote storage is also supported via the WebHDFS API.
Read more about it [here].

[here]: /doc/command-reference/remote/add#webhdfs

</admon>

<admon type="info">

If any values given to the parameters below contain sensitive user info, add
them with the `--local` option, so they're written to a Git-ignored config file.

</admon>

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

<admon type="tip">

WebHDFS serves as an alternative for using the same remote storage supported by
HDFS. Read more about it [here].

</admon>

<admon type="info">

If any values given to the parameters below contain sensitive user info, add
them with the `--local` option, so they're written to a Git-ignored config file.

</admon>

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

- `custom_auth_header` - HTTP header field name to use for authentication. Value
  is set via `password`.

  ```cli
  $ dvc remote modify --local myremote \
                      custom_auth_header 'My-Header'
  ```

- `password` - password for WebDAV server, combined either with `user` or
  `custom_auth_header`. Leave empty for `token` authentication.

  ```cli
  $ dvc remote modify --local myremote password mypassword
  ```

  <admon type="info">

  Auth based on `user` or `custom_auth_header` (with `password`) is incompatible
  with `token` auth.

  </admon>

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
