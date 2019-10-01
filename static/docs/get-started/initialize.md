# Initialize

In order to start using DVC, you need first to initialize it in your
<abbr>workspace</abbr>. DVC doesn't require Git and can work without any source
control management system, but for the best experience we recommend using DVC on
top of Git repositories.

If you don't have a directory for this <abbr>project</abbr> already, create it
now with these commands:

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

After DVC initialization, a new directory `.dvc/` will be created with `config`
and `.gitignore` files, and <abbr>cache</abbr> directory. These files and
directories are hidden from the user generally and are not meant to be
manipulated directly.

> See `dvc init` if you want to get more details about the initialization
> process, and
> [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
> learn about the DVC internal file and directory structure.

The last command, `git commit`, puts the `.dvc/config` and `.dvc/.gitignore`
files (DVC internals) under Git control.
