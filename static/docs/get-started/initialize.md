# Initialize

In order to start using DVC, you need first to initialize it in your project's
directory. DVC doesn't require Git and can work without any source control
management system, but for the best experience we recommend using DVC on top of
Git repositories.

If you don't have a directory for your project already, create it now with these
commands:

```dvc
    $ mkdir example-get-started && cd example-get-started
    $ git init
```

Run DVC initialization in a repository directory to create DVC metafiles and
directories:

```dvc
    $ dvc init
    $ git commit -m 'initialize DVC'
```

After DVC initialization, a new directory `.dvc` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from the user in general and the user does not interact with these files
directly.

The last command, `git commit`, puts `.dvc/config` and `.dvc/.gitignore` files
under Git control.

Check `dvc init` if you want to get more details about the initialization
process or [DVC Files and
Directories](/doc/user-guide/dvc-files-and-directories) to learn about DVC files
and directories structure.
