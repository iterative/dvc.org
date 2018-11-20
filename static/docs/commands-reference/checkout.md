# checkout

Checkout data files from cache into the working space.

This command has to be called after `git checkout` since Git does not handle
files that are under DVC control. You can also use `dvc install` to install a git
hook that will call `dvc checkout` for you. See `dvc config` for more
information.

The command restores data files from cache to the working tree and removes data
files that are no longer on the working tree.

Note, this command does NOT copy any files (exception: `cache.type == copy`) -
DVC uses links to perform data file restoration. This is crucial for large files
where checking out as a 50Gb file might take a few minutes. For DVC, it will
take less than a second to restore a 50Gb data file.


```usage
    usage: dvc checkout [-h] [-q] [-v] [-d] [-f] [targets [targets ...]]

    positional arguments:
      targets        DVC files

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -d, --with-deps       Checkout all dependencies of the specified target.
        -f, --force           Do not prompt when removing working directory files.
```

DVC does not report in the output which data files were restored. However, it
reports removed files and files that DVC was unable to restore due to missing
cache. To restore a file with a missing cache, the reproduction command should
be called (`dvc repro`) or the cache can be pulled from the remote storage
(`dvc pull`).

## Examples

Checking out a branch example:

```dvc
    $ git checkout input_100K
    $ dvc checkout
```
