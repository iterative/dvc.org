# Keep Data and Cache on External Drive

Sometimes the data may be stored on an
[external hard drive](https://whatis.techtarget.com/definition/external-hard-drive).
Usually such data is huge, which means that it won't fit on our local drive, and
even if it did, it would take a long time to copy it back and forth from the
external drive to the internal one. For example let's say that the size of the
external drive is 16TB, while the local drive is only 320GB.

In this case we would like to process the data where it is already located (on
the external drive). We also would like to store the results there, as well as
the <abbr>cached</abbr> files.

<details>

### A simple approach: initialize the workspace on the external drive itself

The easiest way to do this would be to initialize the workspace on the external
drive itself. If we assume that the external drive is mounted on
`/mnt/external-drive/` and the data is on `/mnt/external-drive/data/raw`, then
it could be done like this:

```dvc
$ cd /mnt/external-drive/
$ git init
$ dvc init
$ dvc add data/raw
...
```

But often this is not possible (or preferable). Another solution is described in
the rest of this page.

</details>

Most likely, the best approach for this is to setup the <abbr>workspace</abbr>
in our local drive, while all the data files and their caches stay on the
external drive.

## Make the data directory accessible

Let's assume that the external drive is mounted on `/mnt/external-drive/`. First
we have to make sure that we can read and write this data directory:

```dvc
$ sudo chown <username>: -R /mnt/external-drive/
$ chmod u+rw -R /mnt/external-drive/
```

> Or refer to
> [User Account Control](https://docs.microsoft.com/en-us/windows/security/identity-protection/user-account-control/user-account-control-overview)
> for Windows.

## Create a DVC project with external cache

An [external cache](/doc/user-guide/external-outputs) resides outside of the
workspace directory. Let's create a directory for it on `/mnt/external-drive/`:

```dvc
$ mkdir -p /mnt/external-drive/dvc-cache
```

Now you can initialize a <abbr>project</abbr> on your home directory:

```dvc
$ cd ~/project/
$ git init
$ dvc init
```

> If this was an existing project, we could preserve the content of its cache by
> moving it to the external directory with
> `mv -a .dvc/cache/* /mnt/external-drive/dvc-cache/`

Configure it to use the external directory as <abbr>cache</abbr>:

```dvc
$ dvc config cache.dir /mnt/external-drive/dvc-cache
$ cat .dvc/config
[cache]
dir = /mnt/external-drive/dvc-cache
```

Commit changes to git:

```dvc
$ git add .dvc/config
$ git commit -m 'Initialize DVC with external cache'
```

## Tracking external dependencies and outputs

Now, when you refer to the data files and directories in DVC commands, you'll
have to **use their absolute path**. <abbr>DVC-files</abbr> will be created in
the <abbr>project</abbr>, and you can track their modifications with Git as
usual.

For example, let's say that the raw data files are in
`/mnt/external-drive/data/raw/`, and you are cleaning them up. You could do it
like this:

```dvc
$ dvc add /mnt/external-drive/data/raw
...
$ dvc run \
      -f clean.dvc \
      -d /mnt/external-drive/data/raw \
      -o /mnt/external-drive/data/clean \
      ./cleanup.py \
          /mnt/external-drive/data/raw \
          /mnt/external-drive/data/clean
```

<details>

### Tip: use an environment variable for the data path

In a real life situation you may want to declare an environment variable like
`DATA=/mnt/external-drive/data`, in order to shorten the command lines:

```dvc
$ dvc add $DATA/raw
...
$ dvc run -f clean.dvc -d $DATA/raw -o $DATA/clean \
          ./cleanup.py $DATA/raw $DATA/clean
```

</details>

If you check the contents of `raw.dvc` (and `clean.dvc`) you'll notice that the
`path` field refers to the external directories:

```yaml
md5: 9cbbacd47133debf91dcb41891c64730
wdir: .
outs:
  - md5: 0ee0a6bc0a1f1be0610f7a3f67f1cb54.dir
    path: /mnt/external-drive/data/raw
    cache: true
    metric: false
    persist: false
```

You can also check and verify that indeed all the data and cache files are
stored on the external drive:

```dvc
$ ls /mnt/external-drive/
data  dvc-cache

$ ls /mnt/external-drive/data/
clean  raw

$ ls /mnt/external-drive/dvc-cache
...
```

Now you can add and commit the DVC-files with Git:

```dvc
$ git add .
$ git commit -m 'Cleanup raw data'
```

<details>

### Optimizing data management

Since we're talking about large data, it's worth spending some time to
understand how DVC can
[optimize data management](/doc/user-guide/large-dataset-optimization), so that
it does not create unnecessary copies of large data.

In short, if your external drive is formatted with XFS, Btrfs, ZFS, or any other
file system that supports _reflinks_, DVC will automatically use the most
efficient way of handling large datasets, without custom configuration.

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

## Other similar cases

If instead of an external drive we had a
[network-attached storage (NAS)](https://searchstorage.techtarget.com/definition/network-attached-storage)
mounted on `/mnt/external-drive/` (through NFS, Samba, etc.), the solution would
be the same. However, in this case the data is most probably used by a team of
people; Please refer to
[Shared Development Server](/doc/use-cases/shared-development-server) for more
information on that use case.
