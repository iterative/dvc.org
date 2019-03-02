# fetch

Fetches data files from the remote storage to the local cache.

The set of data files to fetch (usually it means downloading from the remote
storage) is determined by analyzing all `.dvc` files in the current branch,
unless `--all-branches` is specified.

The command fetches only outputs of a specific stage if dvc file is specified
`dvc push data.zip.dvc`.

See `dvc remote`, `dvc config` and 
[remote storages](https://dvc.org/doc/get-started/configure)
for more information on how to configure the remote storage.

```usage
    usage: dvc fetch [-h] [-q] [-v] [-j JOBS] [-r REMOTE] [-a]
                     [-T] [-d]
                     [targets [targets ...]]

    positional arguments:
      targets               DVC files.

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
      --show-checksums      Show checksums instead of file names.
      -r REMOTE, --remote REMOTE
                            Remote repository to fetch from
      -a, --all-branches    Fetch cache for all branches.
      -T, --all-tags        Fetch cache for all tags.
      -d, --with-deps       Fetch cache for all dependencies of the specified
                            target.
      -R RECURSIVE, --recursive RECURSIVE
                            Fetch cache for subdirectories of specified directory.

```

## Examples

Fetch all files used in the current Git branch:

```dvc
    $ dvc fetch

    (1/8): [#################################] 100% images/0001.jpg
    (2/8): [#################################] 100% images/0002.jpg
    (3/8): [#################################] 100% images/0003.jpg
    (4/8): [#################################] 100% images/0004.jpg
    (5/8): [#################################] 100% images/0005.jpg
    (6/8): [#################################] 100% images/0006.jpg
    (7/8): [#################################] 100% images/0007.jpg
    (8/8): [#################################] 100% model.pkl
```

Fetch outputs of a specific dvc file:
```dvc
    $ dvc fetch data.zip.dvc
    [#################################] 100% data.zip
```
