# Initialize

There are a few recommended ways to install DVC: OS-specific package/installer,
`pip`, `conda`, and Homebrew. See [Installation](/doc/install) for all the
options and details.

Let's start by creating a <abbr>workspace</abbr> we can version with Git. Then
run `dvc init` inside to create the DVC <abbr>project</abbr>:

```dvc
$ mkdir example-get-started
$ cd example-get-started
$ git init
$ dvc init
$ git commit -m "Initialize DVC project"
```

At DVC initialization, a new `.dvc/` directory will be created with the
`config`, `.gitignore`, among
[other files and directories](/doc/user-guide/dvc-files-and-directories) that
are hidden from the user.

> See `dvc init` if you want to get more details about the initialization
> process, and
> [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
> learn about the DVC internal file and directory structure.

The last command, `git commit`, versions the `.dvc/config` and `.dvc/.gitignore`
files (DVC internals) with Git.
