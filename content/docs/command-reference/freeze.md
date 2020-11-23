# freeze

Freeze [stages](/doc/command-reference/run) until `dvc unfreeze` is used on
them. Frozen stages are never executed by `dvc repro`.

## Synopsis

```usage
usage: dvc freeze [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        Stages or .dvc files to freeze
```

## Description

`dvc freeze` causes the [stages](/doc/command-reference/run) indicated as
`targets` to be considered _not changed_ by `dvc status` and `dvc repro`. Stage
reproduction will not regenerate <abbr>outputs</abbr> of frozen stages, even if
their <abbr>dependencies</abbr> have changed, and even if `--force` is used.

Freezing a stage is useful to avoid syncing data from the top of its
[pipeline](/doc/command-reference/dag), and keep iterating on the last
(non-frozen) stages only.

Note that <abbr>import stages</abbr> are frozen by default. Use `dvc update` to
update the imported data from the external data source.
[Unfreeze](/doc/command-reference/unfreeze) them before using `dvc repro` on a
pipeline that needs their outputs.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a dummy stage that copies `foo` to `bar`:

```dvc
$ echo foo > foo
$ dvc add foo
$ dvc run -n make_copy -d foo -o bar cp foo bar
```

> See `dvc run` for more details.

Then, let's change the file `foo` that the stage `make_copy` depends on:

```dvc
$ echo zoo > foo
$ dvc status
make_copy:
	changed deps:
		modified:           foo
foo.dvc:
	changed outs:
		modified:           foo
```

`dvc status` notices that `foo` has changed. Let's now freeze the `make_copy`
stage and see what's the project status after that:

```dvc
$ dvc freeze make_copy
$ dvc status
foo.dvc:
	changed outs:
		modified:           foo
```

DVC notices that `foo` changed due to the `foo.dvc` file that tracks this file
(as `outs`), but the `make_copy` stage no longer records the change among its
`deps`.

> You can use `dvc unfreeze` to go back to the regular project status.
