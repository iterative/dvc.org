# status

Show changed stages in the pipeline and mismatches between local cache and cloud remote.

```sh
    usage: dvc status [-h] [-q] [-v] [-j JOBS] [-c] [-r REMOTE]
                      [targets [targets ...]]

    positional arguments:
      targets               DVC files.

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
      -c, --cloud           Show status of a local cache compared to a remote
                            repository
      -r REMOTE, --remote REMOTE
                            Remote repository to compare local cache to
```

## Examples

```sh
    $ dvc status
      bar.dvc
              outs
                      changed:  bar
              deps
                      changed:  foo
      foo.dvc
              outs
                      changed:  foo
    $ dvc status -c
        new:      32e366fae424b7bd1a522c528f46daa4

```
