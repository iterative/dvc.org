# HTTP

<!--
## HTTP
-->

Start with `dvc remote add` to define the remote:

```cli
$ dvc remote add -d myremote https://example.com/path
```

## Configuration parameters

<admon type="info">

If any values given to the parameters below contain sensitive user info, add
them with the `--local` option, so they're written to a Git-ignored config file.

</admon>

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
