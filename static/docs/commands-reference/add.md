# add

Take a data file or a directory under DVC control.

```usage
    usage: dvc add [-h] [-q] [-v] targets [targets ...]

    positional arguments:
      targets               Input files/directories

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
```

Under the hood a few steps are happening:

1. Move the file content to the DVC cache (default location is `.dvc/cache`).
2. Calculate the file checksum.
3. Replace the file by a link to the file in the cache (see details below).
4. Create a corresponding DVC file (metafile `.dvc`) and store the checksum
to identify the right file in cache.

Only _metafile_ (basically, pointer to the data in cache) is stored in Git,
DVC manages data file contents.

See [DVC File Format](/doc/user-guide/dvc-file-format) for the detailed
description of the _metafile_ format.

DVC stores the file's last modification timestamp, inode, and the checksum into
a global state file `.dvc/state` to reduce time recomputing checksums later.

Note, by default dvc tries a range of link types (reflink, hardlink, symlink,
copy) to try to avoid copying any file contents and make dvc file operations
very quick even for large files. Reflink is the best link type we could have,
but even though it is becoming more and more common in modern filesystems, many
filesystems still don't support it and thus dvc has to resort to a much more
common hardlinks. See `dvc config` for more information.

For directories, the command does the same steps for each file recursively.
To retain information about the directory structure, a corresponding cache
file will be created in `.dvc/cache`.

## Examples

Take files under DVC control:

```dvc
    $ ls raw

    Badges.xml          PostLinks.xml           Votes.xml

    $ dvc add raw/Badges.xml raw/PostLinks.xml raw/Votes.xml
```

Note, DVC files have been created:

```dvc
    $ ls raw

    Badges.xml          PostLinks.xml           Votes.xml
    Badges.xml.dvc      PostLinks.xml.dvc       Votes.xml.dvc
```

Let's check one of them:

```
    $ cat raw/Badges.xml.dvc

    md5: e16f4a8bb4cd3c30562221b3271b92a6
    outs:
    - cache: true
      md5: 573e3e83636983961017902c60175bc0
      metric: false
      path: Badges.xml

```

You can see that the file contains a checksum for the file. It basically serves
as a pointer to the remote storage or local cache.
