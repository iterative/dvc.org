# push

This command pushes all data file caches related to the current Git branch to
cloud storage. Cloud storage settings need to be configured. See cloud storage
configuration for more details on how to set up cloud storage.

```sh
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
      --all-branches        Push cache for all branches.
```

## Examples

Push all data file caches from the current Git branch to cloud:

```sh
    $ dvc push

    (1/8): [##################################] 100% 72271bebdf053178a5cce48b4
    (2/8): [##################################] 100% d7208b910d1a40fedc2da5a44
    (3/8): [##################################] 100% 7f6ed2919af9c9e94c32ea13d
    (4/8): [##################################] 100% 5988519f8465218abb23ce0e0
    (5/8): [##################################] 100% 11de13709a78379d253a3d0f5
    (6/8): [##################################] 100% 3f9c7c3ae51db2eed7ba99e6e
    (7/8): [##################################] 100% cfdaa4bba57fa07d81ff96685
    (8/8): [#######################           ] 57% 1de6178a9dd844e249ba05414
```
