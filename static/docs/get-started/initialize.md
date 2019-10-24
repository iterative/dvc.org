# Initialize

First of all install DVC from `pip` (on the [installation](/doc/install) page
there are other options and details):

```dvc
$ pip install dvc
```

Then create a <abbr>workspace</abbr>. DVC doesn't require Git and can work
without any source control management system, but for the best experience we
recommend using DVC on top of Git repositories.

```dvc
$ mkdir example-get-started
$ cd example-get-started
$ git init
```

Run DVC initialization in a repository directory to create the DVC meta files
and directories:

```dvc
$ dvc init
$ git commit -m "Initialize DVC project"
```

After DVC initialization, a new directory `.dvc/` will be created with the
`config` and `.gitignore` files, as well as `cache/` directory. These files and
directories are hidden from users in general, as there's no need to interact
with them directly See
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to learn
more.

> See `dvc init` if you want to get more details about the initialization
> process, and
> [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
> learn about the DVC internal file and directory structure.

The last command, `git commit`, puts the `.dvc/config` and `.dvc/.gitignore`
files (DVC internals) under Git control.
