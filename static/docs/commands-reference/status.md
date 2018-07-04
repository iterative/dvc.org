# status

Show mismatches between local cache and cloud remote.

```sh
    usage: dvc status [-h] [-q] [-v] [-j JOBS]

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
```

## Examples

Show statuses:

```sh
    $ dvc status
    new file:   src/myrepo_1/.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9
```
