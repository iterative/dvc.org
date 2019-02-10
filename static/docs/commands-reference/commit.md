# commit

Record changes to the repository by saving outputs to cache.

```usage
    usage: dvc commit [-h] [-q | -v] [-f] [-d] [-R] [targets [targets ...]]

    positional arguments:
      targets               DVC files.

    optional arguments:
      -h, --help            show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -f, --force           Commit even if checksums for dependencies/outputs
                            changed.
      -d, --with-deps       Commit all dependencies of the specified target.
      -R, --recursive       Commit cache for subdirectories of the specified
                            directory.
```

## Examples

```dvc
    $ echo foo > foo
    $ dvc add foo
    $ dvc run -d foo -o bar --no-commit 'echo bar > bar'
    $ dvc status
    bar.dvc:
            changed outs:
                    missing cache:      bar
    $ dvc commit
    $ dvc status
    Pipeline is up to date. Nothing to reproduce.
```
