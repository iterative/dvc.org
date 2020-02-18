# update

Update <abbr>data artifacts</abbr> imported from external <abbr>DVC
projects</abbr>, and corresponding [DVC-files](/doc/user-guide/dvc-file-format).

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

`dvc update` will not have an effect on import stages that are fixed to a commit
hash (`rev` field in the DVC-file). To update the imported artifacts to a
certain revision, `--rev` with specified revision can be used.

```dvc
dvc update --rev master
```

## Options

- `--rev` - specific
  [Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash) of the repository to update
  the file or directory from (also starts tracking the given revision).

  > Note that this adds or updates a `rev` field in the DVC-file that fixes it
  > to this revision (and updates `rev_lock` in the DVC-file). This can have an
  > impact on the behavior of `dvc update` later.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Updating imported artifacts

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

## Example: Updating imported artifacts to a specified revision

Let's import a data artifact from an older commit from our
[get started example repo](https://github.com/iterative/example-get-started) at
first:

```dvc
$ dvc import --rev baseline-experiment git@github.com:iterative/example-get-started model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

After this, the import stage (DVC-file) `model.pkl.dvc` is created.

Let's try to run `dvc update` on the given stage file, and see what happens.

```dvc
$ dvc update model.pkl.dvc
```

There was no output at all, meaning, the `model.pkl` file was not updated. This
is because, we tied the import stage with a `rev` that never changes (i.e. tag
is tied to a specific commit). Therefore, it was not updated.

Let's try to update the model to a different experiment `bigrams-experiment`.

```dvc
$ dvc update --rev bigrams-experiment model.pkl.dvc
WARNING: DVC-file 'model.pkl.dvc' changed.
WARNING: Stage 'model.pkl.dvc' changed.
Importing 'model.pkl (git@github.com:iterative/example-get-started)' -> 'model.pkl'
```

The import stage is overwritten, and will get updated from the latest changes in
the given revision(i.e. `bigrams-experiment` tag).

> In the above example, the value for `rev` in the new import stage will be
> `bigrams-experiment`.
