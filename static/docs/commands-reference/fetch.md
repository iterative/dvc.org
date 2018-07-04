# fetch

This command fetches all currently used data file caches from cloud storage.

```sh
    usage: dvc fetch [-h] [-q] [-v] [-j JOBS] [-r REMOTE] [--all-branches]
                     [targets [targets ...]]

    positional arguments:
      targets               DVC files.

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
      -r REMOTE, --remote REMOTE
                            Remote repository to fetch from
      --all-branches        Fetch cache for all branches.
```

## Examples

Fetch all files used in the current Git branch:

```sh
    $ dvc fetch
    (1/8): [#################################] 100% 54a6f1787490ba13fb811a46b
    (2/8): [#################################] 100% 5806dc797c08fb6ddd5d97d46
    (3/8): [#################################] 100% 5988519f8465218abb23ce0e0
    (4/8): [#################################] 100% 7f6ed2919af9c9e94c32ea13d
    (5/8): [#################################] 100% 11de13709a78379d253a3d0f5
    (6/8): [#################################] 100% c6f5a256d628e144db4181de8
    (7/8): [#################################] 100% 3f9c7c3ae51db2eed7ba99e6e
    (8/8): [#################################] 100% cfdaa4bba57fa07d81ff96685
```
