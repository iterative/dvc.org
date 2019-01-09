# status

Show changed stages in the pipeline and mismatches between local cache and cloud
remote.


## Synopsis

```usage
    usage: dvc status [-h] [-q | -v] [-j JOBS] [--show-checksums]
                      [-c] [-r REMOTE] [-a] [-T] [-d]
                      [targets [targets ...]]
```

## Description

## Options

## Examples

```dvc
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

        new:      foo

```
