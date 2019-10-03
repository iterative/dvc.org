# Shared Development Server

Some teams may prefer using one single shared machine to run their experiments.
This allows them to have better resource utilization such as the ability to use
multiple GPUs, centralize all data storage, etc.

![](/static/img/shared-server.png)

With DVC, you can easily setup shared data storage on the server. This allows
your team to store and share data for your projects effectively, and to have
instantaneous <abbr>workspace</abbr> restoration/switching speed – similar to
`git checkout` for your code.

### Preparation

Create a shared directory to be used as <abbr>cache</abbr> location for
everyone's <abbr>projects</abbr>, so that all your colleagues can use the same
project cache:

```dvc
$ mkdir -p /path/to/dvc-cache
```

You will have to make sure that the directory has proper permissions setup, so
that all your colleagues can read and write to it, and can access cache files
written by others. The most straightforward way to do this is to make sure that
everyone's users are members of the same group, and that your shared cache
directory is owned by this group, with the aforementioned permissions.

### Transfer existing cache (Optional)

This step is optional. You can skip it if you are setting up a new DVC project
whose cache directory is not stored in the default location, `.dvc/cache`. If
you did work on your project with DVC previously and you wish to transfer your
cache to the shared cache directory (external to your workspace), you will need
to simply move it from an old cache location to the new one:

```dvc
$ mv .dvc/cache/* /path/to/dvc-cache
```

### Configure shared cache

Tell DVC to use the directory we've set up above as an shared cache location by
running:

```dvc
$ dvc config cache.dir /path/to/dvc-cache
```

Commit changes to `.dvc/config` and push them to your git remote:

```dvc
$ git add .dvc/config
$ git commit -m "dvc: shared external cache dir"
```

### Examples

You and your colleagues can work in your own separate <abbr>workspaces</abbr> as
usual, and DVC will handle all your data in the most effective way possible.
Let's say you are cleaning up the data:

```dvc
$ dvc add raw
$ dvc run -d raw -o clean ./cleanup.py raw clean
$ git add raw.dvc clean.dvc
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can pull the project, and have both `raw` and `clean` data files
instantly appear in their workspace without moving anything manually. After
this, they could decide to continue building this pipeline and process the
cleaned up data:

```dvc
$ git pull
$ dvc checkout
$ dvc run -d clean -o processed ./process.py clean process
$ git add processed.dvc
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily make their work appear in your workspace by:

```dvc
$ git pull
$ dvc checkout
```
