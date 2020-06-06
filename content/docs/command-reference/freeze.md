# freeze

Freeze a [stage](/doc/command-reference/run). Use `dvc unfreeze` to unfreeze the
stage.

## Synopsis

```usage
usage: dvc freeze [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        stages to freeze.
```

## Description

`dvc freeze` causes any stage to be considered _not changed_ by `dvc status` and
`dvc repro`. Stage reproduction will not regenerate <abbr>outputs</abbr> of
frozen stages, even if some dependencies have changed, and even if `--force` is
provided.

Freezing a stage is useful to avoid syncing data from the top of its
[pipeline](/doc/command-reference/pipeline), and keep iterating on the last
(unfrozen) stages only.

Note that <abbr>import stages</abbr> are considered always frozen. Use
`dvc update` to update the corresponding <abbr>data artifacts</abbr> from the
external data source. [Unfreeze](/doc/command-reference/unfreeze) them before
using `dvc repro` on a pipeline that needs their outputs.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple `.dvc` file:

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
