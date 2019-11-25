# Sharing Data Through a Synced DVC Storage

There are cloud data storage providers that are not supported yet by DVC (for
example look at the ones supported by [rclone](https://rclone.org/)). But this
does not mean that we cannot use them to share data with the help of DVC. If it
is possible to synchronize a local directory with a remote one (which is
supported by almost all storage providers), then we are good to go. We can still
make a setup that allows us to share DVC data.

This setup is similar to that of a mounted storage, except that the
synchronization of the data does not happen transparently. We first make a
`dvc push` to send data to the local DVC storage, then synchronize the local DVC
storage with the central one. To receive the data we should first synchronize
the central DVC storage with the local one, then we can make a `dvc pull` to get
it from the local DVC storage to the project.

## Synced Storage Example

In this example we will see how to achieve this with the help of a SSH storage
and `rsync`.

> SSH is one the storage types that is already supported by DVC, and normally we
> don't need to do this. But we are using it just as an example, since SSH is
> easy to be used for synchronizing with a remote directory. Once you understand
> how it works, it should be easy to implement it for other storage types.

<p align="center">
<img src="/static/img/user-guide/data-sharing/synced-storage.png"/>
</p>

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/synced-storage).

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

### Set the DVC storage

We will use a local directory as the default storage of the project, like this:

```dvc
$ mkdir -p $HOME/project.cache
$ dvc remote add --local --default \
      synced-storage $HOME/project.cache

$ dvc remote list --local
synced-storage /home/username/project.cache
```

Note that this configuration is specific for each user, so we have used the
`--local` option in order to save it on `.dvc/config.local`, which is ignored by
Git. Now this configuration file should have a content like this:

```
['remote "synced-storage"']
url = /home/username/project.cache
[core]
remote = synced-storage
```

### Sharing data

When we add data to the project with `dvc add` or `dvc run`, some DVC-files are
created and the data is stored in `.dvc/cache/`. We can upload DVC-files to the
Git server with `git push`, and upload the cached files to the local DVC storage
with `dvc push`:

```dvc
$ git push
$ dvc push
```

The command `dvc push` copies the cached files from `.dvc/cache/` to
`$HOME/project.cache/`. In order to send the data to the server we also have to
synchronize the local DVC storage with the remote one. With `rsync` (and with
the help of SSH configurations that we have done on the previous sections) it
can be as simple as this:

```dvc
$ rsync -r -P \
      $HOME/project.cache/ \
      dvc-server:/srv/project.cache/
```

To get the cached files on their local DVC storage, the other users have to
synchronize first with a command like this:

```dvc
$ rsync -r -P \
      dvc-server:/srv/project.cache/ \
      $HOME/project.cache/
```

Then they can receive the DVC-files and the cached data like this:

```dvc
$ git pull
$ dvc pull
```

<details>

### Optimization: Deduplicate the storage

For each file that is cached, there is a copy on the workspace, a copy on
`.dvc/cache/`, and another copy on `$HOME/project.cache/` (besides the copy on
the remote storage).

If you have a deduplicating filesystem (like XFS, Btrfs, etc.) then everything
is fine because making copies of the same file does not actually increase the
disk usage. If not, then you can create and mount by loopback a deduplicating
filesystem, and move the project and caches there.

For more detailed instructions check out the
[interactive example](https://katacoda.com/dvc/courses/examples/synced-storage).

</details>

<details>

### Optimization: Automate synchronization steps

Notice that whenever we run `dvc push` we also have to run `rsync`, and before a
`dvc pull` we also have to run `rsync`. This can be automated and simplified by
defining aliases or functions on `~/.bashrc`, which might look like these:

```dvc
push() {
    set -x
    git push
    dvc push
    rsync -rP ~/project.cache/ dvc-server:/srv/project.cache/
    set +x
}

pull() {
    set -x
    git pull
    rsync -rP dvc-server:/srv/project.cache/ ~/project.cache/
    dvc pull
    set +x
}
```

Then, to share code changes and data you just run:

```dvc
$ push
```

And to receive code changes and data you just run:

```dvc
$ pull
```

Another way to make the synchronization transparent to the users is to setup
cron jobs that synchronize periodically the local DVC storage with the central
one.

</details>
