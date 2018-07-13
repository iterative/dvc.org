# root

Returns relative path to project's directory.

Can be used to build a path to a dependency, command, or output.

```usage
    usage: dvc root [-h] [-q] [-v]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

1. Basic output:

  ```dvc
    $ dvc root

      .

    $ cd subdir
    $ dvc root

      ..
  ```

2. Referencing files:

  ```dvc
    $ dvc root

    ../../../

    $ dvc run -d $(dvc root)/data/file.cvs ... \
        python $(dvc root)/scripts/something.py
  ```
