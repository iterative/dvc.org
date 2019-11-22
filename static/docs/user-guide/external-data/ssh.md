# External Data on a SSH Server

A SSH server usually is used as a DVC storage, but it may also be used to keep
and process data remotely (for example with [Dask](https://dask.org/)).

## Create Remotes

We can create a SSH remote like this:

```dvc
$ dvc remote add ssh-remote ssh://user@example.com/path/to/dir

$ dvc remote list
ssh-remote	ssh://user@example.com/path/to/dir

$ cat .dvc/config
['remote "ssh-remote"']
url = ssh://user@example.com/path/to/dir
```

We can modify the remote settings with `dvc remote modify`, for example:

```dvc
$ dvc remote modify ssh-remote url ssh://user@example.com:1234/path/to/dir

$ dvc remote list
ssh-remote	ssh://user@example.com:1234/path/to/dir

$ cat .dvc/config
['remote "ssh-remote"']
url = ssh://user@example.com:1234/path/to/dir
```

<details>

### Details: All remote options

- `url` - remote location URL.

  ```dvc
  $ dvc remote modify ssh-remote url ssh://user@example.com:1234/path/to/dir
  ```

- `user` - username to use to access a remote. The order in which dvc searches
  for username:

  1. `user` specified in one of the dvc configs;
  2. `user` specified in the url(e.g. `ssh://user@example.com/path`);
  3. `user` specified in `~/.ssh/config` for remote host;
  4. current user;

  ```dvc
  $ dvc remote modify ssh-remote user myuser
  ```

- `port` - port to use to access a remote. The order in which dvc searches for
  port:

  1. `port` specified in one of the dvc configs;
  2. `port` specified in the url(e.g. `ssh://example.com:1234/path`);
  3. `port` specified in `~/.ssh/config` for remote host;
  4. default ssh port 22;

  ```dvc
  $ dvc remote modify ssh-remote port 2222
  ```

- `keyfile` - path to private key to use to access a remote.

  ```dvc
  $ dvc remote modify ssh-remote keyfile /path/to/keyfile
  ```

- `password` - a private key passphrase or a password to use to use when
  accessing a remote.

  ```dvc
  $ dvc remote modify ssh-remote password mypassword
  ```

- `ask_password` - ask for a private key passphrase or a password to use when
  accessing a remote.

  ```dvc
  $ dvc remote modify ssh-remote ask_password true
  ```

- `gss_auth` - use Generic Security Services authentication if available on host
  (for example,
  [with kerberos](https://en.wikipedia.org/wiki/Generic_Security_Services_Application_Program_Interface#Relationship_to_Kerberos)).
  Using this option requires `paramiko[gssapi]`, which is currently only
  supported by our pip package, and could be installed with
  `pip install 'dvc[ssh_gssapi]'`. Other packages (Conda, Windows, and MacOS
  PKG) do not support it.

  ```dvc
  $ dvc remote modify ssh-remote gss_auth true
  ```

</details>

<details>

### Tip: Keep the password private

In general it is not advisable to use the option `password`, which stores the
plain text password on the configuration file. But if you do, make sure to store
it on the local configuration file, which is ignored by Git, so that it does not
end up being published on GitHub or some other public place.

You can do this by using the option `--local` of `dvc remote modify`, like this:

```dvc
$ dvc remote modify --local ssh-remote password 12345678

$ cat .dvc/config.local
['remote "ssh-remote"']
password = 12345678
```

</details>

<details>

### Tip: Recommended SSH configuration

When connecting to a SSH server it is recommended to use ssh keys instead of
passwords. These make the connection more secure and make the workflow easier
(since you don't have to stop for typing the password).

We can set up the SSH configuration like this:

```dvc
$ mkdir -p ~/.ssh
$ chmod 700 ~/.ssh/
$ cat <<EOF >> ~/.ssh/config
Host ssh-server
    HostName example.org
    Port 1234
    User myuser
    IdentityFile ~/.ssh/ssh-server-key
    IdentitiesOnly yes
EOF
```

Instead of `example.org` we can also use the IP of the SSH server.

Now we can simply use `ssh-server` and the hostname (or IP), port, user name,
etc. will be retrieved automatically from this configuration file.

We also need to generate a private/public key pair and send the public key to
the server:

```dvc
$ ssh-keygen -t rsa -q -N '' -f ~/.ssh/ssh-server-key
$ ssh-copy-id -i ~/.ssh/ssh-server-key.pub ssh-server
```

Now we can setup a SSH remote like this:

```dvc
$ dvc remote add ssh-remote ssh://ssh-server/path/to/dir
```

In this case we don't need to specify to DVC any server address, username, key
file, etc. because SSH gets them automatically from the configuration file
`~/.ssh/config`.

</details>

<details>

### Note: DVC requires both SSH and SFTP access

> **Note!** DVC requires both SSH and SFTP access to work with SSH remote
> storage. Please check that you are able to connect to the remote location with
> tools like `ssh` and `sftp` (GNU/Linux).

<!-- Separate MD quote: -->

> Note that your server's SFTP root might differ from its physical root (`/`).
> (On Linux, see the `ChrootDirectory` config option in `/etc/ssh/sshd_config`.)
> In these cases, the path component in the SSH URL (e.g. `/path/to/dir` above)
> should be specified relative to the SFTP root instead. For example, on some
> Sinology NAS drives, the SFTP root might be in directory `/volume1`, in which
> case you should use path `/path/to/dir` instead of `/volume1/path/to/dir`.

</details>

## DVC Storage

Let's say that we want to use the directory `/srv/dvc-storage/` on the server
`ssh-server` as a DVC storage for sharing data and collaboration (using
`dvc push` and `dvc pull`). We need to set a **default** remote like this:

```dvc
$ dvc remote add --default ssh-storage ssh://ssh-server/srv/dvc-storage
Setting 'ssh-storage' as a default remote.

$ dvc remote list
ssh-storage	ssh://ssh-server/srv/dvc-storage

$ cat .dvc/config
['remote "ssh-storage"']
url = ssh://ssh-server/srv/dvc-storage
[core]
remote = ssh-storage
```

> In the setup above we assume that we already have something like this on
> `~/.ssh/config`:
>
> ```
> Host ssh-server
>     HostName example.org
>     Port 1234
>     User myuser
>     IdentityFile ~/.ssh/ssh-server-key
>     IdentitiesOnly yes
> ```
>
> It also assumes that the private key is on `~/.ssh/ssh-server-key`

## External Dependencies

Let's take as an example a stage that simply downloads a file from a SSH
location:

```dvc
$ dvc run \
      -d ssh://user@example.com/srv/data/file.csv \
      -o file.csv \
      'scp user@example.com:/srv/data/file.csv file.csv'
```

We can do the same thing with a remote, like this:

```dvc
$ dvc remote add ssh-data ssh://user@example.com/srv/data
$ dvc run \
      -d remote://ssh-data/file.csv \
      -o file.csv \
      'scp.py remote://ssh-data/file.csv file.csv'
```

> In this case the command `scp.py` should get the real location of
> `remote://ssh-data/file.csv` using the
> [DVC API](https://github.com/iterative/dvc/blob/master/dvc/api.py)

## External Data and Outputs

For cached external outputs (specified using `-o`) we need to setup an external
cache location that will be used by DVC to store versions of the external file.
Non-cached external outputs (specified using `-O`) do not require an external
cache to be setup.

> When you setup an external cache for your external outputs, avoid using the
> same location that you are using for the DVC storage (which is accessed by
> `dvc push`, `dvc pull`, `dvc fetch`), because it may cause possible checksum
> overlaps. Checksum for some data file on an external storage can potentially
> collide with checksum generated locally for a different file, with a different
> content.

Let's take as example a stage that simply copies a local file to a SSH location.

```dvc
# Add a DVC storage
$ dvc remote add --default \
      ssh-storage ssh://user@example.com:/srv/dvc-storage

# Add SSH remote to be used as cache for the remote files
$ dvc remote add \
      ssh-cache ssh://user@example.com:/srv/cache

# Tell dvc to use the remote 'ssh-cache' as a SSH cache
$ dvc config cache.ssh ssh-cache

# Track data that is located on the SSH server
$ dvc add ssh://user@example.com:/srv/data/file.csv

# Create a stage with an SSH external output
$ dvc run \
      -d model.pkl \
      -o ssh://user@example.com:/srv/data/model.pkl \
      'scp model.pkl user@example.com:/srv/data/model.pkl'
```
