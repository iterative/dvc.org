# data status

Show changes in the data tracked by DVC in the workspace.

## Synopsis

```usage
usage: dvc data status [-h] [-q | -v]
                       [--granular] [--unchanged]
                       [--untracked-files [{no,all}]]
                       [--json]
```

## Description

<admon type="info">

For [pipelines](/user-guide/pipelines) status, use `dvc status`.

</admon>

The `data status` command displays the state of the working directory and the
changes with respect to the last Git commit (`HEAD`). It shows you what new
changes have been committed to DVC, which haven't been committed, which files
aren't being tracked by DVC and Git, and what files are missing from the
<abbr>cache</abbr>.

`data status` can be used as a companion to `git status`. When used together,
this pair of commands shows the status of all paths in a repository.

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

As shown above, the `dvc data status` displays changes in multiple categories:

- _Not in cache_ indicates that the hash for files are recorded in `dvc.lock`
  and `.dvc` files but the corresponding cache files are missing.
- _DVC committed changes_ indicates that there are changes that are
  `dvc-commit`-ed that differs with the last Git commit. There might be more
  detailed state on how each of those files changed: _added_, _modified_,
  _deleted_ and _unknown_.
- _DVC uncommitted changes_ indicates that there are changes in the working
  directory that are not `dvc commit`-ed yet. Same as _DVC committed changes_,
  there might be more detailed state on how each of those files changed.
- _Untracked files_ shows the files that are not being tracked by DVC and Git.
  This is disabled by default, unless [`--untracked-files`](#--untracked-files)
  is specified.
- _DVC unchanged files_ shows the files that are not changed. This is not shown
  by default, unless [`--unchanged`](#--unchanged) is specified.

By default, `dvc data status` does not show individual changes inside the
tracked directories, which can be enabled with [`--granular`](#--granular)
option.

## Options

- `--granular` - show granular, file-level information of the changes for
  DVC-tracked directories. By default, `dvc data status` does not show
  individual changes for files inside the tracked directories.

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

## Example: Combine with Git status

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
