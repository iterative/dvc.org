# pull

Pulls data files to the working space.

The set of data files to pull (usually it means downloading from the remote
storage if file is not in the local cache yet) is determined by analyzing all
`.dvc` files in the current branch, unless `--all-branches` is specified.

After data file is in cache DVC utilizes OS specific mechanisms like reflinks or
hardlinks to put it into the working space without copying. See `dvc checkout`
for more details.

See `dvc remote`, `dvc config` and
[remote storages](https://dvc.org/doc/get-started/configure)
for more information on how to configure the remote storage.

```usage
    usage: dvc pull [-h] [-q] [-v] [-j JOBS] [-r REMOTE] [-a]
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
                            Remote repository to pull from
      -a, --all-branches    Fetch cache for all branches.
      -T, --all-tags        Fetch cache for all tags.
      -d, --with-deps       Fetch cache for all dependencies of the specified
                            target.
```

## Examples

Pull all files from the current Git branch:

```dvc
    $ dvc pull

    (1/8): [#################################] 100% images/0001.jpg
    (2/8): [#################################] 100% images/0002.jpg
    (3/8): [#################################] 100% images/0003.jpg
    (4/8): [#################################] 100% images/0004.jpg
    (5/8): [#################################] 100% images/0005.jpg
    (6/8): [#################################] 100% images/0006.jpg
    (7/8): [#################################] 100% images/0007.jpg
    (8/8): [#################################] 100% model.pkl
```
