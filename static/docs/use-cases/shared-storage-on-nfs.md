# Shared Storage on NFS

In the modern software development environment, teams are working together on
same dataset to get the results. It became necessary that data is accessible and
every team member has a same updated dataset. NFS (Network File System) storage
is widely used for storing and sharing files on the network. This allows you to
have better resource utilization such as ability to store large datasets on a
single host machine.

With DVC, you can easily setup a shared cache storage on the NFS server that
will allow your team to share and store data for your projects effectively as
possible and have a workspace restoration/switching speed as instant as
`git checkout` for your code.

With large data files it is better to set the cache directory to external NFS.
Not only just it will cache the data faster but also version the data. Suppose,
we have a dataset with 1 million images. With DVC, we can have multiple versions
of a dataset without affecting each other work and without creating duplicates
of a complete dataset. With `cache directory` set to `NFS server` you would
avoid copying large files from NFS server to the machine and DVC will manage the
links from the workspace to cache. For more information, visit
[Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning).

## Preparation

First configure NFS server and client machine, following this
[link](https://vitux.com/install-nfs-server-and-client-on-ubuntu/).

In order to make it work on a shared server, after configuring NFS server and
client we need to setup a shared cache location for your projects, so that every
team member is using the same cache location.

After configuring NFS on both server and client side. Let's create an export
directory on server side where all data will be stored.

```dvc
$ mkdir -p /storage
```

You will have to make sure that the directory has proper permissions setup, so
that every one on your team can read and write to it and can access cache files
written by others. The most straightforward way to do that is to make sure that
you and your colleagues are members of the same group (e.g. 'users') and that
your shared directory is owned by that group and has respective permissions.

Let's create a mount point of client side.

```dvc
$ mkdir -p /mnt/dataset/
```

From `/mnt/dataset/` you will be able to access `/storage` directory present in
host server from your local machine.

## Configuring Cache location

After mounting the shared directory on client side. Assuming project code is
present in `/project1`. Let's initialize a `dvc repo`.

```dvc
$ cd /project1/
$ git init
$ dvc init
$ git add .dvc .gitignore
$ git commit . -m "initialize DVC"
```

With `dvc init`, we initialized a DVC repository. For more information, visit
[here](/doc/get-started/initialize).

Tell DVC to use the directory we've set up as an external cache location by
running:

```dvc
$ dvc cache dir /mnt/dataset/storage
```

`dvc cache dir /path/to/cache/directory` - sets cache directory location.

```dvc
$ dvc config cache.type "reflink,symlink,hardlink,copy"
```

`cache.type "reflink,symlink,hardlink,copy"` - link type that DVC should use to
link data files from cache to your workspace. It enables symlinks to avoid
copying large files.

```dvc
$ dvc config cache.protected true
```

`cache.protected true` - to make links `read only` so that we you don't corrupt
data accidentally present in the workspace.

For more information on `config` options, visit
[here](https://dvc.org/doc/commands-reference/config#configuration-sections).

Also, let Git know about the changes we have done.

```dvc
$ git add .dvc .gitignore
$ git commit . -m "DVC cache location updated"
```

## Add data to DVC cache

Now, add first version of the dataset into the DVC cache (this is done once for
a dataset).

```dvc
$ cd /mnt/dataset/
$ cp -r . /project1/
$ cd /project1
$ mv /mnt/dataset/project1_data/ data/
$ dvc add data
```

After copying the data, we have moved the data that is present in the
`/mnt/dataset/project1_data/` to `./data` directory. This is only done once for
a dataset.

`dvc add data` will take files in `data` directory under DVC control. By default
an added file is committed to the DVC cache.

Now, commit changes to `.dvc/config` and push them to your git remote:

```dvc
$ git add data.dvc .gitignore
$ git commit . -m "add first version of the dataset"
$ git tag -a "v1.0" -m "dataset v1.0"
$ git push origin HEAD
$ git push origin v1.0
```

Next, you can easily get this appear in your workspace by:

```dvc
$ cd /home/user/project1/
$ git pull
$ dvc checkout
```

After `git pull`, you will be able to see a `data.dvc` file. To see more
information on `.dvc` file format, visit
[here](/doc/user-guide/dvc-file-format).

`data` directory will now be a symbolic link to the NFS storage.
