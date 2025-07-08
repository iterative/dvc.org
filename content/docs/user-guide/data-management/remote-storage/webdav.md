# WebDAV

<!--
## WebDAV
-->

Start with `dvc remote add` to define the remote:

```cli
$ dvc remote add -d myremote \
                    webdavs://example.com/owncloud/remote.php/dav
```

If your remote is located in a subfolder of your WebDAV server e.g.
`files/myuser`, this path may be appended to the base URL:

```cli
$ dvc remote add -d myremote \
      webdavs://example.com/owncloud/remote.php/dav/files/myuser
```

## Configuration parameters

<admon type="info">

If any values given to the parameters below contain sensitive user info, add
them with the `--local` option, so they're written to a Git-ignored config file.

</admon>

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
