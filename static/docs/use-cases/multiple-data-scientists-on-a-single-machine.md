# Shared Development Server

It's pretty common to see that teams prefer using one single shared machine to
run their experiments. This allows you to have a better resource utilization
such as ability to use multiple GPUs, store all your data in one place, etc.

![](/static/img/shared-server.png)

With DVC, you can easily setup a shared data storage on the server that will
allow your team to share and store data for your projects as effectively as
possible and have a workspace restoration/switching speed as instant
as`git checkout` for your code.

### Preparation

In order to make it work on a shared server, you need to setup a shared cache
location for your projects, so that every team member is using the same cache
storage:

```dvc
$ mkdir -p /dvc-cache
```

You will have to make sure that the directory has proper permissions setup, so
that every one on your team can read and write to it and can access cache files
written by others. The most straightforward way to do that is to make sure that
you and your colleagues are members of the same group (e.g. 'users') and that
your shared cache directory is owned by that group and has respective
permissions.

### Transfer Existing Cache (Optional)

This step is optional. You can skip it if you are setting up a new DVC
repository and don't have your local cache stored in `.dvc/cache`. If you did
work on your project with DVC previously and you wish to transfer your cache to
the external cache directory, you will need to simply move it from an old cache
location to the new one:

```dvc
$ mv .dvc/cache/* /dvc-cache
```

### Configure External Cache

Tell DVC to use the directory we've set up as an external cache location by
running:

```dvc
$ dvc config cache.dir /dvc-cache
```

Commit changes to `.dvc/config` and push them to your git remote:

```dvc
$ git add .dvc/config
$ git commit -m "dvc: setup external cache dir"
```

### Example

You and your colleagues can work in your own workspaces as usual and DVC will
handle all your data in the most effective way possible. Let's say you are
cleaning up the data:

```dvc
$ dvc add raw
$ dvc run -d raw -o clean ./cleanup.py raw clean
$ git add raw.dvc clean.dvc
$ git commit -m "cleanup raw data"
$ git push
```

Your colleague can pull the code and have both `raw` and `clean` instantly
appear in his workspace without copying. After this he decides to continue
building the pipeline and process the cleaned up data:

```dvc
$ git pull
$ dvc checkout
$ dvc run -d clean -o processed ./process.py clean process
$ git add processed.dvc
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily get his work appear in your workspace by:

```dvc
$ git pull
$ dvc checkout
```
