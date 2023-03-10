# SSH

<!--
## SSH
-->

Start with `dvc remote add` to define the remote:

```cli
$ dvc remote add -d myremote ssh://user@example.com/path
```

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Check that you can connect both ways with tools like `ssh` and `sftp`
(GNU/Linux).

> Note that the server's SFTP root might differ from its physical root (`/`).

## Configuration parameters

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
