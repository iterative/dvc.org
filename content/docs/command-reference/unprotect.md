# unprotect

Unprotect tracked files or directories (when hardlinks or symlinks have been
enabled with `dvc config cache.type`).

## Synopsis

```usage
usage: dvc unprotect [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        Data files/directories to unprotect.
```

## Description

By default, this command is not necessary, as DVC avoids hardlinks and symlinks
to link tracked data files from the cache to the <abbr>workspace</abbr>.
However, these types of file links can be enabled with `dvc config cache`
(`cache.type` config option).

Enabling hardlinks or symlinks makes the tracked data files in the workspace
read-only. (This prevents users from accidentally corrupting the cache by
modifying file links.)

Running `dvc unprotect` guarantees that the target files or directories
(`targets`) in the workspace are physically "unlinked" from the cache and can be
safely updated. Read the
[Update a Tracked File](/doc/user-guide/how-to/update-tracked-files) guide to
learn more on this process.

`dvc unprotect` can be an expensive operation (involves copying data). Check
first whether your task matches one of the cases that are considered safe:

- Adding more files to a directory input dataset (say, images or videos)
- Deleting files from a directory dataset

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Enable symlinks:

```dvc
$ dvc config cache.type symlink
```

Track a data file with DVC:

```dvc
$ ls -lh
-rw-r--r--  1 10576022 Nov 27 13:30 Posts.xml.zip

$ dvc add Posts.xml.zip
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
```

Check that the file is writable now, the cached version is intact, and they are
not linked (the file in the <abbr>workspace</abbr> is a copy of the
<abbr>cached</abbr> file):

```dvc
$ ls -lh
-rw-r--r--  1  120B Nov 27 13:29 Posts.xml.zip.dvc
-rw-r--r--  1   10M Nov 27 13:30 Posts.xml.zip

$ ls -lh ls -lh .dvc/cache/ce/
-rw-r--r--@ 1 10M Apr 25  2017 68b98d82545628782c66192c96f2d2
```
