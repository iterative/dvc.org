# Initialize

In order to start using DVC, you need to first initialize it in your project's directory. DVC doesn't require Git and can work without any source control management system, but for the best experience we recommend using DVC on top of Git repositories. 

If you don't have a directory for your project already, create it now with these commands:

```dvc
    $ mkdir myrepo && cd myrepo
    $ git init
```

Run DVC initialization in a repository directory to create DVC metafiles and directories:

```dvc
    $ dvc init
    $ git commit -m 'initialize DVC'
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
