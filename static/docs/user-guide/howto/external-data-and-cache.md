# Keep Data and Cache Outside the Project

Sometimes we would like to keep the data and cache outside the project
directory, so that we can search easily the code of the project.

Keeping the data outside of the project, on a fixed absolute path, is also
useful in case that there are several projects that use the same data.

Another case when this would be desirable is if we want to keep the data on an
[external drive](https://whatis.techtarget.com/definition/external-hard-drive)
because they are too big to fit on our home directory, or for some other
reasons.

> A similar case is also when the data is on a
> [network-attached storage (NAS)](https://searchstorage.techtarget.com/definition/network-attached-storage)
> and is mounted through NFS, SSHFS, Samba, etc. However, in this case the data
> is most probably used by a team of people, so make sure to check also the
> guide about sharing data with a
> [mounted DVC storage](/doc/user-guide/data-sharing/mounted-storage).

## Make the data directory accessible

Let's assume that the data of our project is located on `/data/project1/`. First
we have to make sure that we can read and write the `/data/` directory:

```dvc
$ sudo chown <username>: -R /data/
```

> For Windows refer to
> [User Account Control](https://docs.microsoft.com/en-us/windows/security/identity-protection/user-account-control/user-account-control-overview)

## Setup an external cache

An [external cache](/doc/user-guide/managing-external-data) resides outside of
the workspace directory. Let's create a directory for it:

```dvc
$ sudo mkdir -p /data/dvc-cache
$ sudo chown <username>: -R /data/dvc-cache
```

Now we can configure the project to use this external directory as
<abbr>cache</abbr>:

```dvc
$ cd ~/project1/
$ dvc config cache.dir /data/dvc-cache
$ cat .dvc/config
[cache]
dir = /data/dvc-cache
```

Commit changes to git:

```dvc
$ git add .dvc/config
$ git commit -m 'Setup external cache directory'
```

<details>

### Preseve the content of the old cache directory

If the default cache directory of the project (`.dvc/cache/`) is not empty, we
can preserve its content by moving it to the external directory:

```dvc
$ mv -a .dvc/cache/* /data/dvc-cache/
$ rm -rf .dvc/cache/
```

</details>

## Track external dependencies and outputs

Now, when you refer to the data files and directories in DVC commands, you'll
have to **use their absolute path**. <abbr>DVC-files</abbr> will be created in
the <abbr>project</abbr>, and you can track their modifications with Git as
usual.

For example, let's say that the raw data files are in `/data/project1/raw/`, and
you are cleaning them up. You could do it like this:

```dvc
$ dvc add /data/project1/raw
...
$ dvc run \
      -f clean.dvc \
      -d /data/project1/raw \
      -o /data/project1/clean \
      ./cleanup.py \
          /data/project1/raw \
          /data/project1/clean
```

If you check the contents of `raw.dvc` (and `clean.dvc`) you'll notice that the
`path` field refers to the external directories:

```yaml
md5: 9cbbacd47133debf91dcb41891c64730
wdir: .
outs:
  - md5: 0ee0a6bc0a1f1be0610f7a3f67f1cb54.dir
    path: /data/project1/raw
    cache: true
    metric: false
    persist: false
```

You can also check and verify that indeed all the data and cache files are
stored on the external directory:

```dvc
$ ls /data/
dvc-cache  project1

$ ls /data/project1/
clean  raw

$ ls /data/dvc-cache/
...
```

<details>

### Optimize data management

Since we're talking about large data, it's worth spending some time to
understand how DVC can
[optimize data management](/doc/user-guide/large-dataset-optimization), so that
it does not create unnecessary copies of large data.

In short, if the partition where `/data/` is located is formatted with XFS,
Btrfs, ZFS, or any other deduplicating file system (that supports _reflinks_),
DVC will automatically use the most efficient way of handling large datasets,
without custom configuration.

If reflinks are not available, then you should consider setting the cache type
to _symlink_ or _hardlink_, like this:

```dvc
$ dvc config cache.type "reflink,symlink,hardlink,copy"
$ dvc config cache.protected true
```

However this implies that, for data files that are added to the project with
`dvc add <datafile>`, you may need to run `dvc unprotect <datafile>` before
modifying them. For more details, refer to `dvc unprotect`.

</details>
