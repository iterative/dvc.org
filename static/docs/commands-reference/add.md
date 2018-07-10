# add

Converts files and directories to DVC data files.

The command does the conversion from a *regular file* to a *DVC data file* in a
few steps:

1. Calculate the file checksum.
2. Create a cache file in the cache dir `.dvc/cache`.
3. Create a corresponding DVC file.
4. Replace the file with a link to the cache file.

DVC stores the file's last modification timestamp, inode, and the checksum into
a global state file `.dvc/state` to reduce time recomputing checksums later.

Note, by default dvc tries a range of link types (reflink, hardlink, symlink,
copy) to try to avoid copying any file contents and make dvc file operations
very quick even for large files. Reflink is the best link type we could have,
but even though it is becoming more and more common in modern filesystems, many
filesystems still don't support it and thus dvc has to resort to a much more
common hardlinks. See [`config`](https://dvc.org/doc/commands-reference#config)
for more information.

For directories, the command does the same steps for each file recursively.
To retain information about the directory structure, a corresponding cache
file will be created in `.dvc/cache`.

```usage
    usage: dvc add [-h] [-q] [-v] targets [targets ...]

    positional arguments:
      targets               Input files/directories

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
```

## Examples

Convert files into data files:

```dvc
    $ mkdir raw
    $ cp ~/Downloads/dataset/* raw
    $ ls raw

    Badges.xml          PostLinks.xml           Votes.xml

    $ dvc add raw/Badges.tsv raw/PostLinks.tsv raw/Votes.tsv
    $ ls raw

    Badges.xml          PostLinks.xml           Votes.xml
    Badges.xml.dvc      PostLinks.xml.dvc       Votes.xml.dvc

    $ cat raw/Badges.xml.dvc

    md5: e16f4a8bb4cd3c30562221b3271b92a6
    outs:
    - cache: true
      md5: 573e3e83636983961017902c60175bc0
      metric: false
      path: Badges.xml

```

Note, DVC files are created.
