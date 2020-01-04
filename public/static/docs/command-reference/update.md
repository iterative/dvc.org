# update

Update <abbr>data artifacts</abbr> imported from external <abbr>DVC
repositories</abbr>, and corresponding
[DVC-files](/doc/user-guide/dvc-file-format).

## Synopsis

```usage
usage: dvc update [-h] [-q | -v] [--rev [REV]] targets [targets ...]

positional arguments:
  targets        DVC-files to update.
```

## Description

After creating <abbr>import stages</abbr>
([DVC-files](/doc/user-guide/dvc-file-format)) with `dvc import` or
`dvc import-url`, the data source can change. Use `dvc update` to bring these
imported file, directory, or <abbr>data artifact</abbr> up to date.

To indicate which import stages to update, we must specify the corresponding
DVC-file `targets` as command arguments.

Note that import stages are considered always locked, meaning that if you run
`dvc repro`, they won't be updated. `dvc update` is the only command that can
update them.

To "update" fixed-revision to static references (e.g. tags), or for SHA commits,
use `dvc update` with the `--rev` option.

## Options

- `--rev` - specific
  [Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash) of the DVC repository to
  update the data from. Using this option also updates the fixed-revision.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's first import a data artifact from our
[get started example repo](https://github.com/iterative/example-get-started):

```dvc
$ dvc import git@github.com:iterative/example-get-started model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

As DVC mentions, the import stage (DVC-file) `model.pkl.dvc` is created. This
[stage file](/doc/command-reference/run) is locked by default though, so to
[reproduce](/doc/command-reference/repro) it, we would need to run `dvc unlock`
on it first, then `dvc repro` (and `dvc lock` again). Let's just run
`dvc update` on it instead:

```dvc
$ dvc update model.pkl.dvc
Output 'model.pkl' didn't change. Skipping saving.
Saving information to 'model.pkl.dvc'.
```

This time nothing has changed, since the source <abbr>project</abbr> is rather
stable.

> Note that `dvc update` updates the `rev_lock` field of the corresponding
> [DVC-file](/doc/user-guide/dvc-file-format) (when there are changes to bring
> in).

To update from and also lock to a specific revision of a <abbr>data
artifact</abbr>, we may use the `--rev` option this time:

```dvc
$ dvc update --rev v2 model.pkl.dvc
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

Since the source files has changed, we see the results of our "update".
