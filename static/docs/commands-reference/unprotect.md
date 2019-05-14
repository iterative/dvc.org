# unprotect

Unprotect a file or a directory.

Running `dvc unprotect` guarantees that file or directory in the working space
is physically "unlinked" from the cache and can be safely updated. Check the
[Update a Tracked File](/doc/user-guide/update-tracked-file) to learn more.

```usage
    usage: dvc unprotect [-h] [-q | -v] targets [targets ...]

    Unprotect data file/directory.

    positional arguments:
      targets        Data files/directory.
```

`dvc unprotect` can be an expensive operation (involves copying data), check
first if your task matches one of the cases that are considered safe without
running `dvc unprotect`:

- Adding more files to a directory input data set (say, images or videos).

- Deleting files from a directory data set.

- _Advanced_. If your underlying file system supports _reflinks_ (copy on write)
  and DVC [protected mode](/doc/commands-reference/config#cache) is off.

- _Advanced_. If your [cache type](/doc/commands-reference/config#cache) is set
  to `copy` and DVC [protected mode](/doc/commands-reference/config#cache) is
  off.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

1. Make sure that protected mode is enabled:

```dvc
    $ dvc config cache.protected true
```

2. Put a data file under DVC control:

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

3. Check that file is a read-only link (@ sign means a link):

```dvc
    $ ls -lh
    -r--r--r--@ 1 10576022 Apr 25  2017 Posts.xml.zip
    -rw-r--r--  1      120 Nov 27 13:29 Posts.xml.zip.dvc
```

4. Unprotect the file:

```dvc
    $ dvc unprotect Posts.xml.zip
    [##############################] 100% Posts.xml.zip
```

4. Check that the file is writable now, the cached version is intact, and they
   are not linked (the file in the workspace is a copy of the file):

```dvc
   $ ls -lh
   -rw-r--r--  1  120B Nov 27 13:29 Posts.xml.zip.dvc
   -rw-r--r--  1   10M Nov 27 13:30 Posts.xml.zip

   $ ls -lh ls -lh .dvc/cache/ce/
   -rw-r--r--@ 1 10M Apr 25  2017 68b98d82545628782c66192c96f2d2
```
