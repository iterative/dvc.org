# update

Update <abbr>data artifacts</abbr> imported from external <abbr>DVC
repositories</abbr>, and corresponding
[DVC-files](/doc/user-guide/dvc-file-format).

## Synopsis

```usage
usage: dvc update [-h] [-q | -v] targets [targets ...]

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

Note that import stages are considered always "locked", meaning that if you run
`dvc repro`, they won't be updated. `dvc update` is the only command that can
update them. Also, for `dvc import` import stages, the `rev_lock` field is
updated by `dvc update`.

Another detail to note is that when the `--rev` (revision) option of
`dvc import` has been used to create an import stage, DVC is not aware of what
kind of
[Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References) this
is, for example a branch or a tag. For static references such as tags (unless
manually updated), or for SHA commits, `dvc update` will not have any effect on
the import. Refer to the
[re-importing example](/doc/command-reference/import#example-fixed-revisions-re-importing)
to learn how to "update" fixed-revision imports.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

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
