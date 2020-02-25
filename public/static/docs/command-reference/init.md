# init

This command initializes a <abbr>DVC project</abbr> on a directory.

Note that by default the current working directory is expected to contain a Git
repository, unless the `--no-scm` or `--subdir` option is used.

## Synopsis

```usage
usage: dvc init [-h] [-q | -v] [--no-scm] [-f] [--subdir]
```

## Description

After DVC initialization, a new directory `.dvc/` will be created with the
`config` and `.gitignore` files. These and other files and directories are
hidden from user, as typically there's no need to interact with them directly.
See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
learn more.

`.dvc/cache` is one of the most important
[DVC directories](/doc/user-guide/dvc-files-and-directories). It will hold all
the contents of tracked data files. Note that `.dvc/.gitignore` lists this
directory, which means that the cache directory is not tracked by Git. This is a
local cache and you cannot `git push` it.

## Options

- `--no-scm` - skip Git specific initialization, `.dvc/.gitignore` will not be
  written.

- `--subdir` - initialize <abbr>DVC repository</abbr> in current directory and
  allow to search for Git repository in parent directories

- `-f`, `--force` - remove `.dvc/` if it exists before initialization. Will
  remove any existing local cache. Useful when a previous `dvc init` has been
  corrupted.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Create a new <abbr>DVC repository</abbr> (requires Git):

```dvc
$ mkdir example && cd example
$ git init
$ dvc init
$ git status
...
        new file:   .dvc/.gitignore
        new file:   .dvc/config

$ git commit -m "Init DVC"
```

Note that the <abbr>cache</abbr> directory (among others) is not tracked with
Git. It contains data and model files, and will be managed by DVC.

```dvc
$ cat .dvc/.gitignore
/state
/lock
...
/cache
```

Create a new <abbr>DVC repository</abbr> in a subdirectory of Git repository:

```dvc
$ mkdir repo && cd repo

$ git init
$ mkdir subrepo && cd subrepo

$ dvc init --subdir
```

In this case, Git repository is inside `repo` directory, while <abbr>DVC
repository</abbr> is inside `repo/subrepo`.

```dvc
$ tree repo -a
repo
├── .git
.
.
.
└── subrepo
    └── .dvc
```
