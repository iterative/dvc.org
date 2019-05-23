# unprotect

Unprotect tracked files or directories (when the cache protected mode has been
enabled with `dvc config cache`).

## Synopsis

```usage
usage: dvc unprotect [-h] [-q | -v] targets [targets ...]

Unprotect data file/directory.

positional arguments:
  targets        Data files/directory.
```

## Description

By default this command is not necessary, as DVC avoids hardlinks and symlinks
to link tracked data files in the workspace to the cache. However, these types
of file links can be enabled with `dvc config cache` (`cache.type` config
option). These link types also require the `cache.protected` mode to be turned
on, which makes the tracked data files in the workspace read-only to prevent
users from accidentally corrupting the cache by modifying them.

Running `dvc unprotect` guarantees that the target files or directories
(`targets`) in the workspace are physically "unlinked" from the cache and can be
safely updated. Read the
[Update a Tracked File](/doc/user-guide/update-tracked-file) guide to learn more
on this process.

`dvc unprotect` can be an expensive operation (involves copying data), check
first whether your task matches one of the cases that are considered safe, even
when cache protected mode is enabled:

- Adding more files to a directory input data set (say, images or videos).

- Deleting files from a directory data set.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Enable cache protected mode is enabled:

```dvc
    $ dvc config cache.protected true
```

Put a data file under DVC control:

```dvc
$ ls -lh
-rw-r--r--  1 10576022 Nov 27 13:30 Posts.xml.zip

$ dvc add Posts.xml.zip
Adding 'Posts.xml.zip' to '.gitignore'.
Saving 'Posts.xml.zip' to cache '.dvc/cache'.
Saving information to 'Posts.xml.zip.dvc'.

To track the changes with git run:

	git add .gitignore Posts.xml.zip.dvc
```

Check that file is a read-only link (@ sign means a link):

```dvc
$ ls -lh
-r--r--r--@ 1 10576022 Apr 25  2017 Posts.xml.zip
-rw-r--r--  1      120 Nov 27 13:29 Posts.xml.zip.dvc
```

Unprotect the file:

```dvc
$ dvc unprotect Posts.xml.zip
[##############################] 100% Posts.xml.zip
```

Check that the file is writable now, the cached version is intact, and they are
not linked (the file in the workspace is a copy of the file):

```dvc
$ ls -lh
-rw-r--r--  1  120B Nov 27 13:29 Posts.xml.zip.dvc
-rw-r--r--  1   10M Nov 27 13:30 Posts.xml.zip

$ ls -lh ls -lh .dvc/cache/ce/
-rw-r--r--@ 1 10M Apr 25  2017 68b98d82545628782c66192c96f2d2
```
