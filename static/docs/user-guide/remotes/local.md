# Local DVC Remotes

A "local DVC remote" is a directory in the machine's file system.

> While the term may seem contradictory, it doesn't have to be. The "local" part
> refers to the machine where the project is stored, so it can be any directory
> accessible to the same system. The "remote" part refers specifically to the
> project/repository itself.

Using an absolute path (recommended):

```dvc
$ dvc remote add myremote /tmp/my-remote-dir
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = /tmp/my-remote-dir
```

> Note that the absolute path `/tmp/my-remote-dir` is saved as is.

Using a relative path:

```dvc
$ dvc remote add myremote ../my-remote-dir
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = ../../my-remote-dir
```

> Note that `../my-remote-dir` has been resolved relative to the `.dvc/` dir,
> resulting in `../../my-remote-dir`.
