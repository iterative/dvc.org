# Shared Development Server

Some teams may prefer using one single shared machine to run their experiments.
This allows better resource utilization, such as the ability to use multiple
GPUs, centralized data storage, etc. With DVC, you can easily setup shared data
storage on a server accessed by several users or for any other reason, in a way
that enables almost instantaneous <abbr>workspace</abbr> restoration/switching
speed for everyone – similar to `git checkout` for your code.

![](/img/shared-server.png)

## Preparation

Create a directory external to your <abbr>DVC projects</abbr> to be used as a
shared <abbr>cache</abbr> location for everyone's projects:

```dvc
$ mkdir -p /home/shared/dvc-cache
```

Make sure that the directory has proper permissions, so that all your colleagues
can write to it, and can read cached files written by others. The most
straightforward way to do this is to make all users members of the same group,
and have the shared cache directory owned by that group.

## Transfer existing cache (optional)

You can skip this part if you are setting up a new DVC project where the local
<abbr>cache directory</abbr> (`.dvc/cache` by default), hasn't been used.

If you did work on the <abbr>DVC projects</abbr> previously and wish to transfer
its existing cache to the shared cache directory, you will simply need to move
its contents from the old location to the new one:

```dvc
$ mv .dvc/cache/* /home/shared/dvc-cache
```

Now, ensure that the cached directories and files have appropriate permissions,
so that they can be accessed by your colleagues (assuming their users are
members of the same group):

```dvc
$ sudo find /home/shared/dvc-cache -type d -exec chmod 0775 {} \;
$ sudo find /home/shared/dvc-cache -type f -exec chmod 0664 {} \;
$ sudo chown -R myuser:ourgroup /home/shared/dvc-cache/
```

## Configure the external shared cache

Tell DVC to use the directory we've set up above as the <abbr>cache</abbr> for
your <abbr>project</abbr>:

```dvc
$ dvc config cache.dir /home/shared/dvc-cache
```

You could also use a dedicated command to specify the cache directory to use a
path relative to your project.

```dvc
$ dvc cache dir /home/shared/dvc-cache
```

You could choose both of this interchangeably at times but it's more advisable
to use `dvc config cache.dir` for using an external cache, as the use of
absolute path is much easier than a path relative to your project.

And tell DVC to set group permissions on newly created or downloaded cache
files:

```dvc
$ dvc config cache.shared group
```

> See `dvc config cache` and `dvc cache dir` for more information on these
> config options.

If you're using Git, commit changes to your project's config file (`.dvc/config`
by default):

```dvc
$ git add .dvc/config
$ git commit -m "config external/shared DVC cache"
```

## Examples

You and your colleagues can work in your own separate <abbr>workspaces</abbr> as
usual, and DVC will handle all your data in the most effective way possible.
Let's say you are cleaning up raw data for later stages:

```dvc
$ dvc add raw
$ dvc run -d raw -o clean ./cleanup.py raw clean
  # The data is cached in the shared location.
$ git add raw.dvc clean.dvc
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can [checkout](/doc/command-reference/checkout) the
<abbr>project</abbr> data (from the shared <abbr>cache</abbr>), and have both
`raw` and `clean` data files appear in their workspace without moving anything
manually. After this, they could decide to continue building this
[pipeline](/doc/command-reference/pipeline) and process the clean data:

```dvc
$ git pull
$ dvc checkout
A       raw  # Data is linked from cache to workspace.
$ dvc run -d clean -o processed ./process.py clean process
$ git add processed.dvc
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```
