# unfreeze

Unfreeze [stage](/doc/command-reference/run). See `dvc freeze` for more
information.

## Synopsis

```usage
usage: dvc unfreeze [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        stages to unfreeze.
```

## Description

There are several reasons that can produce data files to be frozen in a DVC
project, `dvc freeze` being the most obvious one.

If `dvc unfreeze` is used on frozen stages, they will start to be checked by
`dvc status`, and updated by `dvc repro`.

Note that <abbr>import stages</abbr> are considered always frozen. They can not
be unfrozen. Use `dvc update` on them to update the file, directory, or
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

Now, let's freeze the `bar` stage:

```dvc
$ dvc freeze bar.dvc
$ dvc status

  foo.dvc
          outs
                  changed:  foo
```

Run `dvc unfreeze` to unfreeze it back:

```dvc
$ dvc unfreeze bar.dvc
$ dvc status

  bar.dvc
          deps
                  changed:  foo
  foo.dvc
          outs
                  changed:  foo
```
