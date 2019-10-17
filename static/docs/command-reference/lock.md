# lock

Lock a [DVC-file](/doc/user-guide/dvc-file-format)
([stage](/doc/command-reference/run)). Use `dvc unlock` to unlock the file.

If a DVC-file is locked, the stage is considered unchanged. `dvc repro` will not
execute commands to regenerate outputs of locked stages, even if some
dependencies have changed and even if `--force` is provided.

## Synopsis

```usage
usage: dvc lock [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        DVC-files to lock.
```

## Description

`dvc lock` causes any DVC-file to be considered _not changed_ by `dvc status`
and `dvc repro`.

Locking a stage is useful to avoid syncing data from the top of its pipeline,
and keep iterating on the last (unlocked) stages only.

Note that <abbr>import stages</abbr> are considered always locked. They can not
be unlocked. Use `dvc update` on them to update the file, directory, or
<abbr>data artifact</abbr> from its external data source.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple DVC-file:

```dvc
$ echo foo > foo
$ dvc add foo
Saving information ...

$ dvc run -d foo -o bar cp foo bar
Running command:
  cp foo bar
...
```

Then, let's change the file `foo` that the stage described in `bar.dvc` depends
on:

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

Now, let's lock the `bar` stage:

```dvc
$ dvc lock bar.dvc
$ dvc status

  foo.dvc
          outs
                  changed:  foo
```

Run `dvc unlock` to unlock it back:

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
