It's pretty common to see that teams prefer using one single shared machine to
run their experiments. This allows you to have a better resource utilization
such as ability to use multiple GPUs, store all your data in one place, etc.

![](/static/img/shared-server.png)

With DVC, you can easily setup a shared data storage on the server that will
allow your team to share and store data for your projects as effectively as
possible and have a workspace restoration/switching speed as instant
as`git checkout` for your code.

### Preparation

In order to make it work on a shared server, we need to setup a shared cache
location for your projects, so that every team member is using the same cache
location.

> It will be beneficial to have a shared cache location on the server. It avoid
> copying large files from shared server to the local machine.

Let's setup Network File System(NFS), which is used for sharing of files and
folders. NFS allows us to mount your local file system over a network and remote
hosts to interact with them as they are mounted locally on the same system. For
configuring NFS on client and server side, follow this
[link](https://vitux.com/install-nfs-server-and-client-on-ubuntu/).

On server side, create an export directory where all data will be stored.

```dvc
mkdir -p /project1_data
```

You will have to make sure that the directory has proper permissions setup,so
that every one on your team can read and write to it and can access cache files
written by others. The most straightforward way to do that is to make sure that
you and your colleagues are members of the same group (e.g. 'users') and that
your shared directory is owned by that group and has respective permissions.

Let's create a mount point of client side.

```dvc
mkdir -p /mnt/dataset/project1_data
```

### Configure Cache

After mounting the shared directory on client side. Assuming project code is in
`/home/user/project1`. Let's initialize a `dvc repo` .

```dvc
cd /home/user/project1/
dvc init
git add .dvc .gitignore
git commit . -m "initialize DVC"
```

Tell DVC to use the directory we've set up as an external cache location by
running:

```dvc
dvc cache dir /mnt/data  #changing dvc cache directory
dvc config cache.type "reflink,symlink,hardlink,copy" # to enable symlinks to avoid copying
dvc config cache.protected true # to make links RO so that we you don't corrupt them accidentally
git add .dvc .gitignore
git commit . -m "DVC cache location updated"
```

### Add data to DVC cache

Now, add first version of the dataset into the DVC cache (this is done once for
a dataset).

```dvc
cd /mnt/dataset/
cp -r . /home/user/project1/
cd /home/user/project1
mv /mnt/dataset/project1_data/ data/
dvc add data
```

Commit changes to `.dvc/config` and push them to your git remote:

```dvc
git add data.dvc .gitignore
git commit . -m "add first version of the dataset"
git tag -a "v1.0" -m "dataset v1.0"
git push origin HEAD
git push origin v1.0
```

Next, you can easily get this appear in your workspace by:

```dvc
cd /home/user/project1/
git pull
dvc checkout
```
