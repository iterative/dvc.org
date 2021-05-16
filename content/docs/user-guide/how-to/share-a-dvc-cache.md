---
title: 'How to Share a Cache Among Projects'
description: >-
  Setup a single cache for different projects or distributed copies of a same
  project.
---

# How to Share a DVC Cache

There are 2 main reasons to setup a shared <abbr>DVC cache</abbr>:

1. You have distributed copies of a DVC repository in a single shared server
   with multiple users. A shared cache is necessary to avoid duplicating the
   project's data on the single local storage available to all.
2. Your team works with multiple projects in environments with limited storage,
   which share a large storage unit. Everyone needs to use the shared drive
   anyway, and combining the cache locations will also prevent data duplication
   (across projects).

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

## Configure the shared cache

A <abbr>cache</abbr> outside the <abbr>workspace</abbr> is called an
[external cache](/doc/user-guide/managing-external-data#setting-up-an-external-cache).
Set it to the directory we created earlier with `dvc cache dir` and configure it
with `dvc config cache`:

```dvc
$ dvc cache dir /home/shared/dvc-cache

$ dvc config cache.shared group
$ dvc config cache.type symlink
```

Above, we first tell DVC to set group permissions on new cache files. Then we
enable symlinks to avoid having copies from the external cache to the
<abbr>workspace</abbr>.

> See `dvc config cache` and
> [File link types](/doc/user-guide/large-dataset-optimization) for more info.

⚠️ Note that enabling soft/hard links causes DVC to protect the linked data,
because editing them in-place would corrupt the cache. See `dvc unprotect`.

If you're using Git, commit the changes to your project's config file (usually
`.dvc/config`):

```dvc
$ git add .dvc/config
$ git commit -m "config external/shared DVC cache"
```
