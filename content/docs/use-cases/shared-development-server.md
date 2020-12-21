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
$ sudo find /home/shared/dvc-cache -type f -exec chmod 0444 {} \;
$ sudo chown -R myuser:ourgroup /home/shared/dvc-cache/
```

## Configure the external shared cache

Tell DVC to use the directory we've set up above as the <abbr>cache</abbr> for
your <abbr>project</abbr>:

```dvc
$ dvc cache dir /home/shared/dvc-cache
```

And tell DVC to set group permissions on newly created or downloaded cache
files:

```dvc
$ dvc config cache.shared group
```

> See `dvc cache dir` and `dvc config cache` for more information.

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
$ dvc run -n clean_data -d raw -o clean ./cleanup.py raw clean
  # The data is cached in the shared location.
$ git add raw.dvc dvc.yaml dvc.lock .gitignore
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can [checkout](/doc/command-reference/checkout) the
<abbr>project</abbr> data (from the shared <abbr>cache</abbr>), and have both
`raw` and `clean` data files appear in their workspace without moving anything
manually. After this, they could decide to continue building this
[pipeline](/doc/command-reference/dag) and process the clean data:

```dvc
$ git pull
$ dvc checkout
A       raw  # Data is linked from cache to workspace.
$ dvc run -n process_clean_data -d clean -o processed ./process.py clean process
$ git add dvc.yaml dvc.lock
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```
