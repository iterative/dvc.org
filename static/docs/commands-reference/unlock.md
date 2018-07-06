# unlock

Unlock DVC file for reproduction.

```sh
    usage: dvc unlock [-h] [-q] [-v] targets [targets ...]

    positional arguments:
        targets               DVC files.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Example
```sh
    $ echo foo > foo
    $ dvc add foo
    $ dvc run -d foo -o bar cp foo bar
      Using 'bar.dvc' as a stage file
      Running command:
              cp foo bar
    $ rm foo
    $ echo foo1 > foo
    $ dvc status
      bar.dvc
              deps
                      changed:  foo
      foo.dvc
              outs
                      changed:  foo
    $ dvc lock bar.dvc
    $ dvc status
      foo.dvc
              outs
                      changed:  foo
    $ dvc unlock bar.dvc
    $ dvc status
      bar.dvc
              deps
                      changed:  foo
      foo.dvc
              outs
                      changed:  foo
```
