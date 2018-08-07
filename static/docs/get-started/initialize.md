# Initialize

DVC works on top of Git repositories. You run DVC initialization in a repository
directory to create DVC metafiles and directories:

```dvc
    $ mkdir myrepo
    $ git init
    $ cd myrepo
    $ dvc init
    $ git commit -m 'Init DVC'
```

After DVC initialization, a new directory `.dvc` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from a user in general and a user does not interact with these files
directly.

The last command, `git commit`, puts `.dvc/config` and `.dvc/.gitignore` files
under Git control.

Check `dvc init` if you want to get more details about the initialization process
or [DVC Files and Directories](/doc/dvc-files-and-directories) to learn about
DVC files and directories structure.
