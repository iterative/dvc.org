# Sharing Data Through a Mounted DVC Storage

If the data storage server (or provider) has a protocol that is not supported
yet by DVC, but it allows us to mount a remote directory on the local
filesystem, then we can still make a setup for data sharing with DVC.

> This case might be useful when the data files are located on a
> network-attached storage (NAS) for example, and can be accessed through
> protocols like NFS, Samba, SSHFS, etc.

The solution is very similar to that of a
[Shared Development Server](/doc/user-guide/data-sharing/shared-server), using a
local DVC storage, which is actually located on the mounted directory. Whenever
we push data to our mounted storage, it is made available immediately to the
mounted storage of each user. So, the data sharing workflow is the normal one,
with `dvc push` and `dvc pull`.

> Different from the case of Shared Development Server, the local DVC storage
> and the project cannot be on the same filesystem (because the DVC storage is
> on a mounted remote directory). So, the deduplication optimization does not
> work that well. We have a copy of the data on the DVC storage, and at least
> one copy on each user project.

## Mounted Storage Example

In this example we will see how to share data with the help of a storage
directory that is mounted through SSHFS.

> Normally we don't need to do this, since we can
> [use a SSH remote storage](https://katacoda.com/dvc/courses/examples/ssh-storage)
> directly. But we are using it just as an example, since it is easy to
> network-mount a directory with SSHFS. Once you understand how it works, it
> should be easy to implement it for other types of mounted storages (like NFS,
> Samba, etc.).

<p align="center">
<img src="/static/img/user-guide/data-sharing/mounted-storage.png"/>
</p>

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/mounted-storage).

<details>

### Prerequisite: Setup the server

We have to do these configurations on the SSH server:

- Create accounts for each user and add them to groups for accessing the Git
  repository and the DVC storage.
- Create a bare git repository (for example on `/srv/project.git/`) and an empty
  directory for the DVC storage (for example on `/srv/project.cache/`).
- Grant users read/write access to these directories (through the groups).

</details>

<details>

### Prerequisite: Setup each user

When we have to access a SSH server, we definitely want to generate ssh key
pairs and setup the SSH config so that we can access the server without a
password.

Let's assume that for each user we can use the private ssh key
`~/.ssh/dvc-server` to access the server without a password, and we have also
added on `~/.ssh/config` lines like these:

```
Host dvc-server
    HostName host01
    User user1
    IdentityFile ~/.ssh/dvc-server
    IdentitiesOnly yes
```

Here `dvc-server` is the name or alias that we can use for our server, `host01`
can actually be the IP or the FQDN of the server, and `user1` is the username of
the first user on the server.

</details>

<details>

### Prerequisite: Mount the remote storage directory

With SSHFS (and the SSH configuration on the section above) we can mount the
remote directory on the server to a local one (let's say `$HOME/project.cache`),
like this:

```dvc
$ mkdir -p $HOME/project.cache
$ sshfs \
      dvc-server:/srv/project.cache \
      $HOME/project.cache
```

</details>

### Set the DVC storage

We can setup the project to use `$HOME/project.cache` as
[local DVC storage](/doc/user-guide/external-data/local#local-dvc-storage), by
adding a _default remote_ like this:

```dvc
$ dvc remote add --local --default \
      mounted-storage $HOME/project.cache

$ dvc remote list --local
mounted-storage /home/username/project.cache
```

Note that this configuration is specific for each user, so we have used the
`--local` option in order to save it on `.dvc/config.local`, which is ignored by
Git.

Now this configuration file should have a content like this:

```
['remote "mounted-storage"']
url = /home/username/project.cache
[core]
remote = mounted-storage
```

### Sharing data

When we add data to the project with `dvc add` or `dvc run`, some DVC-files are
created and the data is stored in `.dvc/cache/`. We can upload DVC-files to the
Git server with `git push`, and upload the cached files to the DVC storage with
`dvc push`:

```dvc
$ git push
$ dvc push
```

The command `dvc push` copies the cached files from `.dvc/cache/` to
`$HOME/project.cache/`. However, since this is a mounted directory, the cached
files are immediately copied to the server as well, and they become available on
the mounted directories of the other users.

The other users can receive the DVC-files and the cached data like this:

```dvc
$ git pull
$ dvc pull
```
