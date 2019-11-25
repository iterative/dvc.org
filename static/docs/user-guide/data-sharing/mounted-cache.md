# Sharing Data Through a Mounted Cache

We have seen already how to share data through a
[mounted DVC storage](/doc/user-guide/data-sharing/mounted-storage). In that
case we have a copy of the data on the DVC storage and at least one copy on each
user project, since deduplication does not work across filesystems.

However the data management can be further optimized if we use a shared cache.
The idea is that instead of mounting the DVC storage from the server, we can
directly mount the cache directory (`.dvc/cache/`). If all the users do this,
then effectively they will be using the same cache directory (which is mounted
from the NAS server). So, if one of them adds something to the cache, it will
appear automatically to the cache of all the others. As a result, no `dvc push`
and `dvc pull` are needed to share the data, just a `dvc checkout` will be
sufficient.

> ** ❗ Caution:** Deleting data from the cache will also make it disappear from
> the cache of the other users. So, be careful with the command `dvc gc` (which
> cleans obsolete data from the cache) and consult the other users of the
> project before using this command.

The optimization in data management comes from using the _symlink_ cache type.
You can find more details about it in the page of
[Large Dataset Optimization](https://dvc.org/doc/user-guide/large-dataset-optimization).

## Mounted Cache Example

In this example we will see how to share data with the help of a cache directory
that is mounted through SSHFS. We are using a SSHFS example because it is easy
to network-mount a directory with SSHFS. However once you understand how it
works, it should be easy to implement it for other types of network-mounted
storages (like NFS, Samba, etc.).

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/mounted-cache).

<p align="center">
<img src="/static/img/user-guide/data-sharing/mounted-cache.png"/>
</p>

<details>

### Prerequisites: Setup the server

We have to do these configurations on the SSH server:

- Create accounts for each user and add them to groups for accessing the Git
  repository and the DVC storage.
- Create a bare git repository (for example on `/srv/project.git/`) and an empty
  directory for the DVC cache (for example on `/srv/project.cache/`).
- Grant users read/write access to these directories (through the groups).

</details>

<details>

### Setup each user

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

### Mount the DVC cache

With SSHFS (and the SSH configuration on the section above), we can mount the
remote directory to `.dvc/cache/` of the project like this:

```dvc
$ mkdir -p ~/project/.dvc/cache
$ sshfs \
      dvc-server:/srv/project.cache/ \
      ~/project/.dvc/cache/
```

### Optimize data management

Since the cache directory is located on a mounted filesystem, we cannot use the
_reflink_ optimization for data management. However we can use _symlinks_ (which
work across the filesystems):

```dvc
$ dvc config cache.type 'reflink,symlink,hardlink,copy'
$ dvc config cache.protected true
```

The configuration file `.dvc/config` should look like this:

```ini
[cache]
type = "reflink,symlink,hardlink,copy"
protected = true
```

This configuration is the same for all the users, so we can add it to Git in
order to share it with the other users:

```dvc
$ git add .dvc/config
$ git commit -m "Use symlinks if reflinks are not available"
$ git push
```

### Sharing data

When we add data to the project with `dvc add` or `dvc run`, some DVC-files are
created, the data is stored in `.dvc/cache/`, and it is linked (with symlink)
from the workspace.

We can share the DVC-files with:

```dvc
$ git push
```

In order to receive the changes, the other users should do:

```dvc
$ git pull
$ dvc checkout
```

Notice that there is no need to use `dvc push` and `dvc pull` for sharing the
data, because it is like all the collaborating users are using the same
directory for the DVC cache. As soon as one of them saves a file in cache, it is
immediately available for `dvc checkout` to all the others. All they need to do
is to synchronize their DVC-files (with `git push` and `git pull`).
