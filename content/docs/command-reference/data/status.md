# data status

Show changes to the files and directories tracked by DVC in the
<abbr>workspace</abbr>.

<admon type="tip">

For the status of <abbr>data pipelines</abbr>, see `dvc status`.

</admon>

## Synopsis

```usage
usage: dvc data status [-h] [-q | -v]
                       [--granular] [--unchanged]
                       [--untracked-files [{no,all}]]
                       [--json]
                       [--not-in-remote] [--no-remote-refresh]
```

## Description

The `data status` command displays the state of the <abbr>workspace</abbr> and
the changes with respect to the last Git commit (`HEAD`). It shows you what new
changes have been committed to DVC, which haven't been committed, which files
aren't being tracked by DVC and Git, and what files are missing from the
<abbr>cache</abbr>.

`data status` can be used as a companion to `git status`. When used together,
this pair of commands shows the status of all paths in a repository.

The `dvc data status` command only outputs information, it won't modify or
change anything in your <abbr>workspace</abbr>. It's a good practice to check
the state of your repository before doing `dvc commit` or `git commit` so that
you don't accidentally commit something you don't mean to.

An example output might look something like follows:

```cli
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

- _Not in cache_ indicates that there are file hashes in `.dvc` or `dvc.lock`
  files, but the corresponding <abbr>cache</abbr> files are missing. This may
  happen after cloning a DVC repository but before using `dvc pull` (or
  `dvc fetch`) to download the data; or after using `dvc gc`.

- _Not in remote_ indicates that there are file hashes in `.dvc` or `dvc.lock`
  files, but the corresponding <abbr>remote</abbr> files are missing. This may
  happen after adding new files into dvc but before using `dvc push` to upload
  the data; or after using `dvc gc -c`.

- _DVC committed changes_ are new, modified, or deleted tracked files or
  directories that have been [committed to DVC]. These may be ready for
  committing to Git.

- _DVC uncommitted changes_ are new, modified, or deleted tracked files or
  directories that have not been [committed to DVC] yet. You can `dvc add` or
  `dvc commit` these.

- _Untracked files_ have not been added to DVC (nor Git). Only shown if the
  `--untracked-files` flag is used.

- _Unchanged files_ have no modifications. Only shown if the `--unchanged` flag
  is used.

Individual changes to files inside [tracked directories] are not shown by default
but this can be enabled with the `--granular` flag.

[committed to dvc]: /doc/command-reference/commit
[tracked directories]: /doc/command-reference/add#adding-entire-directories

## Options

- `--granular` - show granular file-level changes inside DVC-tracked
  directories. Note that some granular changes may be reported as `unknown` as
  DVC tracks
  [directory-level hash values](/doc/user-guide/project-structure/internal-files#directories).

- `--untracked-files` - show files that are not being tracked by DVC and Git.

- `--unchanged` - show unchanged DVC-tracked files.

- `--not-in-remote` - show files that are missing from the <abbr>remote</abbr>.

- `--no-remote-refresh` - use cached <abbr>remote</abbr> index (don't check
  remote). Only has an effect along with `--not-in-remote`.

- `--json` - prints the command's output in easily parsable JSON format, instead
  of a human-readable output.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

```cli
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
yet, and a file `model.pkl` has been deleted from the <abbr>workspace</abbr>.
The `data/features/` directory is modified, but there is no further details to
what changed inside. The `--granular` option can provide more information on
that.

## Example: Full repository status (including Git)

```cli
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

$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   dvc.lock

no changes added to commit (use "git add" and/or "git commit -a")
```

`dvc data status` and `git status` combined show you the full status of a
repository. `dvc data status` shows you changes to DVC data, and `git status`
shows changes to the corresponding `dvc.lock` or `.dvc` files (as well as
unrelated changes to your Git repository).

## Example: Granular output

Following on from the above example, using `--granular` will show file-level
information for the changes:

```cli
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

## Example: Remote status

```cli
$ dvc data status --not-in-remote
Not in cache:
  (use "dvc fetch <file>..." to download files)
        data/data.xml

Not in remote:
  (use "dvc push <file>..." to upload files)
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
