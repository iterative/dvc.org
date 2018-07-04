# add

Converts files and directories to DVC data files.

The command does the conversion from a *regular file* to a *DVC data file* in a
few steps:

1. Calculate the file checksum.
2. Create a cache file in the cache dir `.dvc/cache`.
3. Create a corresponding DVC file.
4. Replace the file with a hardlink to the cache file.

DVC stores the file's last modification timestamp, inode, and the checksum into
a global state file `.dvc/state` to reduce time recomputing checksums later.

Note, this command does NOT copy any file contents and will run quickly even for
a large files. Step (2) from the above is also made by hardlinks movement, not
file content. The only heavy step is (1),  which requires checksum calculation.

For directories, the command does the same steps for each file recursively.
To retain information about the directory structure, a corresponding directory
will be created in `.dvc/cache`.

```sh
    usage: dvc add [-h] [-q] [-v] targets [targets ...]

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
```

## Examples

Convert files into data files:

```sh
    $ mkdir raw
    $ cp ~/Downloads/dataset/* raw
    $ ls raw

    Badges.xml          PostLinks.xml           Votes.xml

    $ dvc add raw/Badges.tsv raw/PostLinks.tsv raw/Votes.tsv
    $ ls raw

    Badges.xml          PostLinks.xml           Votes.xml
    Badges.xml.dvc      PostLinks.xml.dvc       Votes.xml.dvc
```

Note, DVC files are created.
