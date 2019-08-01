# update

Update <abbr>data artifacts</abbr> imported from other DVC repositories.

## Synopsis

```usage
usage: dvc update [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        DVC-files to update.
```

## Description

After creating import stages ([DVC-files](/doc/user-guide/dvc-file-format)) with
`dvc import`, the external data source can change. `dvc update` can be used to
bring the imported <abbr>data artifact</abbr> up to date. This is the only
command that does so with locked stages, and import stages are locked by
default.

> Using `dvc update` on a locked stage is equivalent to running `dvc unlock`,
> then `dvc repro`, and `dvc lock` again on an import stage.

To indicate which import stages to update, specify the corresponding DVC-file
`targets` as command arguments.

Note that by default, import stages created with `dvc import` are locked in
their DVC-files (via fields `lock: true` and `rev_lock`). For a locked stage,
`dvc update` does `dvc unlock` + `dvc repro` + `dvc lock`, basically.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Let's first import a data artifact from our
[get started example repo](https://github.com/iterative/example-get-started):

```dvc
$ dvc import git@github.com:iterative/example-get-started model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)' -> 'model.pkl'
...
Saving information to 'model.pkl.dvc'.
...
```

As DVC mentions, the import stage (DVC-file) `model.pkl.dvc` is created. this
[stage file](/doc/commands-reference/run) is locked by default though, so to
[reproduce](/doc/commands-reference/repro) it, we would need to run `dvc unlock`
on it first, then `dvc repro` (and `dvc lock` again). Let's just run
`dvc update` on it instead:

```dvc
$ dvc update model.pkl.dvc
Stage 'model.pkl.dvc' didn't change.
Output 'model.pkl' didn't change. Skipping saving.
Saving information to 'model.pkl.dvc'.
```

This time nothing has changed (since our Get Started sample repo is pretty
static).
