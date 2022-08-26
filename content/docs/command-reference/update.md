# update

Update files or directories imported from external <abbr>DVC repositories</abbr>
or [URLs](/doc/command-reference/import-url#description), and the corresponding
import `.dvc` files.

## Synopsis

```usage
usage: dvc update [-h] [-q | -v] [--rev <commit>] [-R] [--no-download] [--to-remote]
                  [-r <name>] [-j <number>] targets [targets ...]

positional arguments:
  targets      Import .dvc files to update. Using -R, directories
               to search for .dvc files can also be given.
```

## Description

After creating import stages (`.dvc` files) with `dvc import` or
`dvc import-url`, the data source can change. Use `dvc update` to bring these
imported files or directories up to date.

To indicate which import stages to update, we can specify the corresponding
`.dvc` file `targets` as command arguments.

Note that import stages are considered always frozen, meaning that if you run
`dvc repro`, they won't be updated. `dvc update` is the only command that can
update them.

`dvc update` without flags will not have an effect on import stages that are
fixed to a commit hash (`rev` field in the `.dvc` file). Use the `--rev` option
to update an imported artifact to a different revision.

```dvc
$ dvc update --rev master
```

## Options

- `--rev <commit>` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to
  update the file or directory from. The latest commit in `master` (tip of the
  default branch) is used by default when this option is not specified.

  > Note that this changes the `rev` field in the import stage, fixing it to the
  > revision.

- `-R`, `--recursive` - determines the files to update by searching each target
  directory and its subdirectories for import `.dvc` files to inspect. If there
  are no directories among the targets, this option has no effect.

- `--no-download` - Update data checksums in the `.dvc` file (`md5`, `etag`, or
  `checksum` fields) without actually downloading the latest data. See
  `dvc import-url --no-download`/`dvc import --no-download` for more context.
  Cannot be combined with `--to-remote`.

- `--to-remote` - update a `.dvc` file created with `dvc import-url` and
  [transfer](/doc/command-reference/import-url#example-transfer-to-remote-storage)
  the data directly to remote storage (the default one unless one is specified
  with -r) without saving it locally. Use
  [dvc pull](https://dvc.org/doc/command-reference/pull) to get the data
  locally.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) (can only be used with
  `--to-remote`).

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to download data
  from the source. The default value is `4 * cpu_count()`. Using more jobs may
  speed up the operation.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Let's first import a data artifact from our
[get started example repo](https://github.com/iterative/example-get-started):

```dvc
$ dvc import git@github.com:iterative/example-get-started model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

As DVC mentions, the import stage (`.dvc` file) `model.pkl.dvc` is created. This
[stage](/doc/command-reference/run) is frozen by default though, so to
[reproduce](/doc/command-reference/repro) it, we would need to run
`dvc unfreeze` on it first, then `dvc repro` (and `dvc freeze` again). Let's
just run `dvc update` on it instead:

```dvc
$ dvc update model.pkl.dvc
Output 'model.pkl' didn't change. Skipping saving.
Saving information to 'model.pkl.dvc'.
```

This time nothing has changed, since the source <abbr>project</abbr> is rather
stable.

> Note that `dvc update` updates the `rev_lock` field of the corresponding
> `.dvc` file (when there are changes to bring in).

## Example: Updating fixed revisions to a different version

> See also
> [Importing and updating fixed revisions](/doc/command-reference/import#example-importing-and-updating-fixed-revisions).

Let's import a model from a specific version of our
[get started example repo](https://github.com/iterative/example-get-started)
first:

```dvc
$ dvc import --rev baseline-experiment \
            git@github.com:iterative/example-get-started \
            model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

After this, the import stage (`.dvc` file) `model.pkl.dvc` is created. Let's try
to run `dvc update` on this file and see what happens.

```dvc
$ dvc update model.pkl.dvc
```

There was no output at all, meaning, the `model.pkl` file was not updated. This
is because we tied the import stage to a `rev` that hasn't changed
(i.e.`baseline-experiment` tag points to a specific Git commit). Therefore, it
was not updated.

Let's try to update the model to a different version:

```dvc
$ dvc update --rev bigrams-experiment model.pkl.dvc
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

The import stage is overwritten, and will get updated from the latest changes in
the given commit (tag `bigrams-experiment`).
