# Local Storage on a Shared Development Server

Some teams may prefer using a single shared machine to run their experiments.
This allows them to have better resource utilization such as the ability to use
multiple GPUs, etc.

With DVC, you can easily setup a local data storage on the server. This allows
your team to store and share data of your projects efficiently, and to have
almost instantaneous data retrieval speed, similar to `git pull` for your code.

## Shared Server Example

Let's see an example of how two different users on the same host can share data
with the help of a local data storage. So, both of the users and the data
storage are located on the same machine and no remote server or storage is
involved.

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/shared-server).

<p align="center">
<img src="/static/img/user-guide/data-sharing/shared-server.png"/>
</p>

### Setup the server

We need to do these configurations on the server:

- Create accounts for each user and add them to groups for accessing the Git
  repository and the DVC storage.
- Create a bare git repository (for example on `/var/local/data/project.git/`)
  and an empty directory for the DVC storage (for example on
  `/var/local/data/project.cache/`).

- Grant users read/write access to these directories (through the groups).

### Configure local DVC storage

Clone the Git project to the homedir of the users. Then set the local DVC
storage as the default remote, like this:

```dvc
$ export DATA=/var/local/data
$ dvc remote add --default \
      local-storage $DATA/project.cache
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
$ git commit -m "Set default storage"
$ git push
```

### Sharing data

Data sharing among the different users is done the normal way, with `dvc push`
and `dvc pull`, except that in this case it is the local storage that is acting
as an intermediary between the users, instead of a remote storage.

After adding data to the project with `dvc add` and `dvc run`, it is stored in
`.dvc/cache`. We can share the code changes and the data like this:

```dvc
$ git push
$ dvc push
```

From the other users we can receive the code changes and data like this:

```dvc
$ git pull
$ dvc pull
```

### Optimizations

If all the user projects and the data storage are located on the same
deduplicating filesystem, then everything is fine, copying data around will be
done instantly and without increasing the disk usage.

If they are not on the same filesystem, or if the filesystem does not support
deduplication of data, then some optimizations are needed to make things
efficient. These optimizations may include:

1. Creating, formatting and mounting a filesystem which supports deduplication
   (like XFS, Btrfs, etc.)

2. Locating the data storage and all the user projects on this filesystem.

3. Adding symbolic links from the home directories of the users to their
   projects (which are located on the optimized filesystem).

For more detailed instructions check out this
[interactive example](https://katacoda.com/dvc/courses/examples/shared-server).
