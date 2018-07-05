# install

Install dvc hooks into the repository

```sh
    usage: dvc install [-h] [-q] [-v]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

```sh
    $ dvc install
    $ git checkout mybranch # will call `dvc checkout` automatically
```
