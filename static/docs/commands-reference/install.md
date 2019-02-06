# install

Install dvc hooks into the repository

```usage
    usage: dvc install [-h] [-q] [-v]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```
## Installed hooks
- pre-commit : dvc status
- post-checkout : dvc checkout

## Examples

```dvc
    $ dvc install
    $ cat .git/hooks/pre-commit
      #!/bin/sh
      exec dvc status
    $ cat .git/hooks/post-checkout
      #!/bin/sh
      exec dvc checkout
    $ git checkout mybranch # will call `dvc checkout` automatically
```
