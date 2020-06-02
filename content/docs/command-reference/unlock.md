# unlock

Unlock [DVC-file](/doc/user-guide/dvc-files-and-directories)
([stage](/doc/command-reference/run)). See `dvc lock` for more information.

## Synopsis

```usage
usage: dvc unlock [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        DVC-files to unlock.
```

## Description

There are several reasons that can produce data files to be locked in a DVC
project, `dvc lock` being the most obvious one.

If `dvc unlock` is used on locked stages, they will start to be checked by
`dvc status`, and updated by `dvc repro`.

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
