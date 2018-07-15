# unlock

Unlock DVC file (stage). See `dvc lock` for more information.

```usage
    usage: dvc unlock [-h] [-q] [-v] targets [targets ...]

    positional arguments:
        targets               DVC files.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Example

* First, let's create a sample DVC file:

```dvc
    $ echo foo > foo
    $ dvc add foo
    $ dvc run -d foo -o bar cp foo bar

      Using 'bar.dvc' as a stage file
      Running command:
              cp foo bar
```

* Then, let's change the file `foo` the stage `bar.dvc` depends on:

```dvc
    $ rm foo
    $ echo foo1 > foo
    $ dvc status

      bar.dvc
              deps
                      changed:  foo
      foo.dvc
              outs
                      changed:  foo
```

* Now, let's lock the `bar` stage:

```dvc
    $ dvc lock bar.dvc
    $ dvc status

      foo.dvc
              outs
                      changed:  foo
```

* Run `dvc unlock` to unlock it back:

```dvc
    $ dvc unlock bar.dvc
    $ dvc status

      bar.dvc
              deps
                      changed:  foo
      foo.dvc
              outs
                      changed:  foo
```
