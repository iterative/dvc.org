# data status

Show changes to the files and directories tracked by DVC.

## Synopsis

```usage
usage: dvc data status [-h] [-q | -v]
                       [--granular] [--unchanged]
                       [--untracked-files [{no,all}]]
                       [--json]
```

## Description

The `data status` command displays the state of the working directory and the
changes with respect to the last Git commit (`HEAD`). It shows you what new
changes have been committed to DVC, which haven't been committed, which files
aren't being tracked by DVC and Git, and what files are missing from the
<abbr>cache</abbr>.

The `dvc data status` command only outputs information, it won't modify or
change anything in your working directory. It's a good practice to check the
state of your repository before doing `dvc commit` or `git commit` so that you
don't accidentally commit something you don't mean to.

An example output might look something like follows:

```dvc
$ dvc data status
Not in cache:
  (use "dvc fetch <file>..." to download files)
        data/data.xml

DVC committed changes:
  (git commit the corresponding dvc files to update the repo)
        modified: data/features/

DVC uncommitted changes:
  (use "dvc commit <file>..." to track changes)
  (use "dvc checkout <file>..." to discard changes)
        deleted: model.pkl
(there are other changes not tracked by dvc, use "git status" to see)
```

`dvc data status` displays changes in multiple categories:

- `Not in cache` indicates that there are file records (hashes) in `.dvc` or
  `dvc.lock` files, but the corresponding <abbr>cache</abbr> files are missing.
  This may happen after cloning a DVC repository but before using `dvc pull` (or
  `dvc fetch`) to download the data; or after using `dvc gc`.

- `DVC committed changes` are new, modified, or deleted tracked files or
  directories that have been [committed to DVC]. These may be ready for
  committing to Git.

- `DVC uncommitted changes` are new, modified, or deleted tracked files or
  directories that have not been [committed to DVC] yet. You can `dvc add` or
  `dvc commit` these.

- `Untracked files` have not been added to DVC (nor Git). Only shown if the
  `--untracked-files` flag is used.

- `Unchanged files` have no modifications. Only shown if the `--unchanged` flag
  is used.

Individual changes to files inside [directories tracked as a whole] are not
shown by default but this can be enabled with the `--granular` flag.

[committed to dvc]: /doc/command-reference/commit
[directories tracked as a whole]:
  /doc/command-reference/add#adding-entire-directories

## Options

- `--granular` - show granular file-level changes inside DVC-tracked
  directories. Not included by default

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
  (use "dvc fetch <file>..." to download files)
        data/data.xml
DVC committed changes:
  (git commit the corresponding dvc files to update the repo)
        modified: data/features/
DVC uncommitted changes:
  (use "dvc commit <file>..." to track changes)
  (use "dvc checkout <file>..." to discard changes)
        deleted: model.pkl
(there are other changes not tracked by dvc, use "git status" to see)
```

This shows that the `data/data.xml` is missing from the cache, `data/features/`
a directory, has changes that are being tracked by DVC but is not Git committed
yet, and a file `model.pkl` has been deleted from the workspace. The
`data/features/` directory is modified, but there is no further details to what
changed inside. The `--granular` option can provide more information on that.

## Example: Granular output

Following on from the above example, using `--granular` will show file-level
information for the changes:

```dvc
$ dvc data status --granular
Not in cache:
  (use "dvc fetch <file>..." to download files)
        data/data.xml

DVC committed changes:
  (git commit the corresponding dvc files to update the repo)
        added: data/features/foo

DVC uncommitted changes:
  (use "dvc commit <file>..." to track changes)
  (use "dvc checkout <file>..." to discard changes)
        deleted: model.pkl
(there are other changes not tracked by dvc, use "git status" to see)
```

Now there's more information in _DVC committed changes_ regarding the changes in
`data/features`. From the output, it shows that there is a new file added to
`data/features`: `data/features/foo`.
