# Shared Development Server

It's pretty common to see that teams prefer using one single shared machine to
run their experiments. This allows you to have a better resource utilization
such as ability to use multiple GPUs, store all your data in one place, etc.

![](/static/img/shared-server.png)

With DVC, you can easily setup a shared data storage on the server that will
allow your team to store and share data for your projects effectively, as well
as to have an instantaneous <abbr>workspace</abbr> restoration/switching speed –
similar to `git checkout` for your code.

### Preparation

In order to leverage DVC on a shared server, you need to setup a shared
<abbr>cache</abbr> location for your <abbr>projects</abbr>, so that every team
member is using the same cache storage:

```dvc
$ mkdir -p /path/to/dvc-cache
```

You will have to make sure that the directory has proper permissions setup, so
that every one on your team can read and write to it and can access cache files
written by others. The most straightforward way to do that is to make sure that
you and your colleagues are members of the same group (e.g. `users`) and that
your shared cache directory is owned by that group and has respective
permissions.

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

You and your colleagues can work in your own <abbr>workspaces</abbr> as usual
and DVC will handle all your data in the most effective way possible. Let's say
you are cleaning up the data:

```dvc
$ dvc add raw
$ dvc run -d raw -o clean ./cleanup.py raw clean
$ git add raw.dvc clean.dvc
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can pull the code and have both `raw` and `clean` instantly
appear in their workspace without copying anything. After this they decide to
continue building this pipeline and process the cleaned up data:

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
