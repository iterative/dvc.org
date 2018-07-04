# init

This command initializes a DVC environment in a current Git repository.

```sh
    usage: dvc init [-h] [-q] [-v]
    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```

## Examples

Creating a new DVC repository:

```sh
    $ mkdir tag_classifier
    $ cd tag_classifier

    $ git init
    Initialized empty Git repository in /Users/dmitry/src/tag_classifier/.git/

    $ dvc init
    $ git status
    On branch master

    Initial commit

    Changes to be committed:

      (use "git rm --cached <file>..." to unstage)

            new file:   .dvc/.gitignore
            new file:   .dvc/config

    $ git commit -m 'Init DVC'
    [master (root-commit) 2db4618] Init DVC
     2 files changed, 41 insertions(+)
     create mode 100644 .dvc/.gitignore
     create mode 100644 .dvc/config
```
