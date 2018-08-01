# push

This command pushes all data file caches related to the current Git branch to
the remote storage.

See `dvc remote`, `dvc config` and
[remote storages](https://dvc.org/doc/get-started/configure)
for more information on how to configure the remote storage.

```usage
    usage: dvc push [-h] [-q] [-v] [-j JOBS] [-r REMOTE] [--all-branches]
                    [targets [targets ...]]

    positional arguments:
      targets               DVC files.

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
      -r REMOTE, --remote REMOTE
                            Remote repository to push to
      -a, --all-branches    Push cache for all branches.
```

## Examples

Push all data file caches from the current Git branch to the default remote:

```dvc
    $ dvc push

    (1/8): [##################################] 100% images/0001.jpg
    (2/8): [##################################] 100% images/0002.jpg
    (3/8): [##################################] 100% images/0003.jpg
    (4/8): [##################################] 100% images/0004.jpg
    (5/8): [##################################] 100% images/0005.jpg
    (6/8): [##################################] 100% images/0006.jpg
    (7/8): [##################################] 100% images/0007.jpg
    (8/8): [#######################           ] 57% model.pkl
```
