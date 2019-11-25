# Local Storage on a Shared Development Server

Some teams may prefer to use a single shared machine for running their
experiments. This allows them to have better resource utilization such as the
ability to use multiple GPUs, etc.

With DVC, we can easily setup a
[local data storage](/doc/user-guide/external-data/local#local-dvc-storage) on
the shared server. To share data we use the normal DVC workflow of `dvc push`
(for sending cached data to the local DVC storage), and `dvc pull` (for
retrieving them from the DVC storage).

> For having the best performance on this workflow we should make sure that the
> (local) DVC storage and all the user projects are located on the same
> deduplicating filesystem. In this case DVC would automatically use _reflink
> copy_ and this would ensure a minimal disk space usage and an instantaneous
> data transfer speed.

## Shared Server Example

Let's see an example of how two different users on the same host can share data
with the help of a
[local DVC storage](/doc/user-guide/external-data/local#local-dvc-storage). So,
both of the users and the data storage are located on the same machine and no
remote server or storage is involved.

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/shared-server).

<p align="center">
<img src="/static/img/user-guide/data-sharing/shared-server.png"/>
</p>

<details>

### Prerequisite: Setup the server

We need to do these configurations on the server:

- Create accounts for each user and add them to groups for accessing the Git
  repository and the DVC storage.
- Create a bare git repository (for example on `/var/local/data/project.git/`)
  and an empty directory for the DVC storage (for example on
  `/var/local/data/project.cache/`).
- Grant users read/write access to these directories (through the groups).

</details>

### Set the DVC storage

We can setup the project to use the
[local DVC storage](/doc/user-guide/external-data/local#local-dvc-storage) by
adding a _default remote_, like this:

```dvc
$ export DATA=/var/local/data
$ dvc remote add --default local-storage $DATA/project.cache
Setting 'local-storage' as a default remote.

$ dvc remote list
local-storage /var/local/data/project.cache
```

The configuration file `.dvc/config` now should look like this:

```
['remote "local-storage"']
url = /var/local/data/project.cache
[core]
remote = local-storage
```

We can add it to Git and commit, since it is the same for all the users:

```dvc
$ git add .dvc/config
$ git commit -m "Setup local DVC storage"
$ git push
```

### Sharing data

Data sharing among the different users is done the normal way, with `dvc push`
and `dvc pull`, except that in this case it is the _local DVC storage_ that is
acting as an intermediary between the users, instead of a remote one.

When we add data to the project with `dvc add` or `dvc run`, some DVC-files are
created and the data is stored in `.dvc/cache/`. We can upload DVC-files to the
Git server with `git push`, and upload the cached files to the DVC storage with
`dvc push`:

```dvc
$ git push
$ dvc push
```

The other users can receive the DVC-files and the cached data like this:

```dvc
$ git pull
$ dvc pull
```

<details>

### Data sharing optimizations

If all the user projects and the local DVC storage are located on the same
_deduplicating_ filesystem, then everything is fine, copying data around will be
done instantly and without increasing the disk usage.

If they are not on the same filesystem, or if the filesystem does not support
deduplication of data, then some optimizations are needed to make things
efficient. These optimizations may include:

1. Creating, formatting and mounting a deduplicating filesystem (like XFS,
   Btrfs, etc.)
2. Locating the DVC storage and all the user projects on this filesystem.
3. Adding symbolic links from the home directories of the users to their
   projects (which are located on the optimized filesystem).

For more detailed instructions check out this
[interactive example](https://katacoda.com/dvc/courses/examples/shared-server).

</details>
