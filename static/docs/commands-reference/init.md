# init

This command initializes a DVC environment in a current Git repository.

```usage
    usage: dvc init [-h] [-q] [-v] [--no-scm]
    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
      --no-scm       Initiate dvc in directory that is not tracked by any scm
                     tool(e.g. git)
```

## Examples

Creating a new DVC repository:

```dvc
    $ mkdir tag_classifier
    $ cd tag_classifier

    $ git init
    $ dvc init
    $ git status

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
