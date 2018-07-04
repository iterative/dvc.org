# checkout

Checkout data files from cache.
This command has to be called after `git checkout` since Git does not handle DVC
data files.

The command restores data files from cache to the working tree and removes data
files that are no longer on the working tree.

Note, this command does NOT copy any files - DVC uses hardlinks to perform data
file restoration. This is crucial for large files where checking out as a 50Gb
file might take a few minutes. For DVC, it will take less than a second to
restore a 50Gb data file.


```sh
    usage: dvc checkout [-h] [-q] [-v]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

Checking out a branch example::

```sh
    $ git checkout input_100K
    $ dvc checkout

    Remove 'data/model.p'
    Remove 'data/matrix-train.p'
    'data/Posts-train.tsv': cache file not found
```

DVC does not report in the output which data files were restored.
However, it reports removed files and files that DVC was unable to restore due
to missing cache. To restore a file with a missing cache, the reproduction
command should be called or the cache can be pulled from the cloud.

It might be convenient to assign a Git hook to `git checkout`:

```sh
    $ echo 'dvc checkout' > .git/hooks/post-checkout
    $ chmod +x .git/hooks/post-checkout
    $ git checkout input_100K  # dvc checkout is not needed anymore

    Remove 'data/model.p'
    Remove 'data/matrix-train.p'
    'data/Posts-train.tsv': cache file not found
```
