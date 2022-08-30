# data status

Show changes in data tracked by DVC between the last Git commit, the metafiles
and the workspace.

## Synopsis

```usage
usage: dvc data status [-h] [-q | -v]
                       [--granular] [--unchanged]
                       [--untracked-files [{no,all}]]
                       [--json]
```

## Description

Shows changes that have differences between the last Git commit (`HEAD`) and
committed data specified in [metafiles](/doc/user-guide/project-structure),
uncommitted changes that have differences between that specified in the
metafiles and the <abbr>workspace</abbr>, and the changes that are not in the
cache but is specified in those metafiles.

The first change shows what is already committed to DVC via `dvc add` or
`dvc commit` or `dvc repro` but the metafiles are not committed to git yet. The
second change shows the new changes to the data that is not tracked by DVC yet
or what you could `dvc commit`. The third change shows the files that are
missing from the cache. Some of those could be pulled from the remote.

Using `--untracked-files`, it'll show the files that are not being tracked by
DVC or Git.

By default, `dvc data status` shows changes in the level the file/directory is
being tracked in. With `--granular`, it will show changes in file-level.

The `--unchanged` option will list all of the files that aren't listed in
committed changes or uncommitted changes.

### Output

The `dvc data status` displays changes in multiple categories such as:

- _Not in cache_
- _DVC committed changes_
- _DVC uncommitted changes_
- _Untracked files_
- _DVC unchanged files_

The categories will only be displayed when there are changes related to those
categories.

The _DVC committed changes_ and _DVC uncommitted changes_ shows more detailed
state the files are in: _added_, _modified_, and _deleted_.

## Options

- `--granular` - show granular, file-level information of the changes for
  DVC-tracked directories. By default, DVC only shows the changes at the level
  where the data is being tracked at.

- `--untracked-files` - show files that are not being tracked by DVC and Git.

- `--unchanged` - show unchanged DVC-tracked files.

- `--json` - prints the command's output in easily parsable JSON format, instead
  of a human-readable output.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

```dvc
$ dvc data status
Not in cache:
  (use "dvc pull <file>..." to download files)
        data/data.xml

DVC committed changes:
  (git commit the corresponding dvc files to update the repo)
        modified: data/features/

DVC uncommitted changes:
  (use "dvc commit <file>..." to track changes)
        deleted: model.pkl
(there are other changes not tracked by dvc, use "git status" to see)
```

This shows that the `data/data.xml` is missing from the cache, `data/features/`
a directory, has changes that are being tracked by DVC but is not git-committed
yet, and a file `model.pkl` has been deleted from the workspace. The
`data/features/` directory is modified, but there is no further details to what
changed inside. The `--granular` flag can provide more information on that.

## Example: Granular output

Following on from the above example, using `--granular` will show file-level
information for the changes:

```dvc
$ dvc data status --granular
Not in cache:
  (use "dvc pull <file>..." to download files)
        data/data.xml

DVC committed changes:
  (git commit the corresponding dvc files to update the repo)
        added: data/features/foo

DVC uncommitted changes:
  (use "dvc commit <file>..." to track changes)
        deleted: model.pkl
(there are other changes not tracked by dvc, use "git status" to see)
```

Now there's more information in _DVC committed changes_ regarding the changes in
`data/features`. From the output, it shows that there is a new file added to
`data/features`: `data/features/foo`.
