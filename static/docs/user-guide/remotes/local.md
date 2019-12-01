# Local DVC Remotes

A "local DVC remote" is a directory in the machine's file system.

> While the term may seem contradictory, it doesn't have to be. The "local" part
> refers to the machine where the project is stored, so it can be any directory
> accessible to the same system. The "remote" part refers specifically to the
> project/repository itself.

Using an absolute path (recommended):

```dvc
$ dvc remote add myremote /tmp/my-remote-dir
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = /tmp/my-remote-dir
```

> Note that the absolute path `/tmp/my-remote-dir` is saved as is.

Using a relative path:

```dvc
$ dvc remote add myremote ../my-remote-dir
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = ../../my-remote-dir
```

> Note that `../my-remote-dir` has been resolved relative to the `.dvc/` dir,
> resulting in `../../my-remote-dir`.

### Local DVC Storage

A local DVC storage might be useful in these cases:

- When we are using a
  [shared development server](/doc/user-guide/data-sharing/shared-server)
- When our data storage is
  [network-mounted](/doc/user-guide/data-sharing/mounted-storage)
- When our data storage is
  [synchronized with a central storage](/doc/user-guide/data-sharing/synched-storage)

Assuming that we want to use `/var/data/dvc-storage/` as a local DVC storage, we
can configure it by creating a _default_ remote, like this:

```dvc
$ dvc remote add --default storage /var/data/dvc-storage
Setting 'storage' as a default remote.

$ dvc remote list
storage	/var/data/dvc-storage

$ cat .dvc/config
['remote "storage"']
url = /var/data/dvc-storage
[core]
remote = storage
```
