# root

Relative path to project's directory

```sh
    usage: dvc root [-h] [-q] [-v]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

```sh
    $ dvc root
      .
    $ cd subdir
    $ dvc root
      ..
```
