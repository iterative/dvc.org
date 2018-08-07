# Initialize

DVC works on top of Git repositories. You run DVC initialization in a repository
directory to create DVC metafiles and directories:

```dvc
    $ mkdit myrepo
    $ git init
    $ cd myrepo
    $ dvc init
    $ git commit -m 'Init DVC'
```

After DVC initialization, a new directory `.dvc` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from the user in general and the user does not interact with these files
directly. Check `dvc init` if you want to get more details.
