# HDFS & WebHDFS

<!--
## HDFS & WebHDFS
-->

Start with `dvc remote add` to define the remote:

```cli
$ dvc remote add -d myremote hdfs://user@example.com:path
```

⚠️ Using HDFS with a Hadoop cluster might require additional setup. Our
assumption is that the client is set up to use it. Specifically, [`libhdfs`]
should be installed.

[`libhdfs`]:
  https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/LibHdfs.html
[webhdfs api]: #webhdfs

## HDFS configuration parameters

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

## WebHDFS

Using an HDFS cluster as remote storage is also supported via the WebHDFS API.

If your cluster is secured, then WebHDFS is commonly used with Kerberos and
HTTPS. To enable these for the DVC remote, set `use_https` and `kerberos` to
`true`.

```cli
$ dvc remote add -d myremote webhdfs://example.com/path
$ dvc remote modify myremote use_https true
$ dvc remote modify myremote kerberos true
$ dvc remote modify --local myremote token SOME_BASE64_ENCODED_TOKEN
```

⚠️ Using WebHDFS requires to enable REST API access in the cluster: set the
config property `dfs.webhdfs.enabled` to `true` in `hdfs-site.xml`.

💡 You may want to run `kinit` before using the remote to make sure you have an
active kerberos session.

## WebHDFS configuration parameters

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

- `password` - Password to use in combination with `user` for Basic
  Authentication. If you provide `password` you must also provide `user`. Since
  this is a password it is recommended to store this in your local config (i.e.
  not in Git)

  ```cli
  $ dvc remote modify --local password "mypassword"
  ```

- `data_proxy_target` - Target mapping to be used in the call to the fsspec
  WebHDFS constructor (see
  https://filesystem-spec.readthedocs.io/en/latest/api.html?highlight=data_proxy#fsspec.implementations.webhdfs.WebHDFS.__init__
  ). This enables support for access to a WebHDFS cluster that is behind a High
  Availability proxy server and rewrites the URL used for connecting.

  For example, if you access you provide the url `webhdfs://host:port/` and you
  provide the value `https://host:port/gateway/cluster` for the
  `data_proxy_target` parameter, then internally the fsspec WebHDFS will rewrite
  every occurrence of `https://host:port/webhdfs/v1` into
  `https://host:port/gateway/cluster/webhdfs/v1`

  ```cli
  $ dvc remote modify data_proxy_target "https://host:port/gateway/cluster"
  ```
