# remove

Remove data file or data directory.

```sh
    usage: dvc remove [-h] [-q] [-v] targets [targets ...]

    positional arguments:
        targets               Target to remove - file or directory.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

Remove `matrix-train.p` data file:

```sh
    $ dvc remove matrix-train.p
```
