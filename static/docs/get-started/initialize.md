# Initialize

There are a few recommended ways to install DVC: OS-specific package/installer,
`pip`, `conda`, and Homebrew. See the **[installation](/doc/install)** page for
all the options and details.

In order to start using DVC, you need first to initialize it in your
<abbr>workspace</abbr>, but let's prepare it first:

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
