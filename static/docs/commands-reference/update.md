# update

Update <abbr>data artifacts</abbr> imported from other DVC repositories.

## Synopsis

```usage
usage: dvc update [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        DVC-files to update.
```

## Description

After creating <abbr>import stages</abbr>
([DVC-files](/doc/user-guide/dvc-file-format)) with `dvc import` or
`dvc import-url`, the external data source can change. Use `dvc update` to bring
these imported file, directory, or <abbr>data artifact</abbr> up to date.

Note that import stages are locked by default. `dvc update` is the only single
command that updates locked stages.

> Using `dvc update` on a locked stage is equivalent to running `dvc unlock`,
> then `dvc repro`, and `dvc lock` again on it.

To indicate which import stages to update, specify the corresponding DVC-file
`targets` as command arguments.

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

As DVC mentions, the import stage (DVC-file) `model.pkl.dvc` is created. This
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

This time nothing has changed, since the source repository is pretty static.
