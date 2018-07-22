# init

This command initializes a DVC environment in a current Git repository.

```usage
    usage: dvc init [-h] [-q] [-v] [--no-scm]

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
      --no-scm       Initiate dvc in directory that is not tracked by any scm
                     tool (e.g. git)
```

## Options

* `--no-scm` - skip Git specific initializations, `.dvc/.gitignore` will not be
populated and added to Git.

## Details

After DVC initialization, a new directory `.dvc` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from the user in general and the user does not interact with these files
directly.

`.dvc/cache directory` is one of the most important parts of any DVC
repositories. The directory contains all content of data files. The most
important part about this directory is that `.dvc/.gitignore` file is containing
this directory which means that the cache directory is not under Git control —
this is your local directory and you cannot push it to any Git remote.

## Examples

* Creating a new DVC repository:

```dvc
    $ mkdir tag_classifier
    $ cd tag_classifier

    $ git init
    $ dvc init
    $ git status

            new file:   .dvc/.gitignore
            new file:   .dvc/config

    $ git commit -m 'Init DVC'
```

* Cache directory is not under git control, it contains data and model files and
is managed by DVC:

```dvc
    $ cat .dvc/.gitignore
    cache
    state
    lock
```
