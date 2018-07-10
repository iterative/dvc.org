# root

Relative path to project's directory

```usage
    usage: dvc root [-h] [-q] [-v]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

```dvc
    $ dvc root
      .
    $ cd subdir
    $ dvc root
      ..
```
