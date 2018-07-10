# move

Move output of a DVC file.

```usage
    usage: dvc move [-h] [-q] [-v] src dst

    positional arguments:
        src                   Source
        dst                   Destination

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

```dvc
    $ dvc add data.csv
    $ ls

     data.csv
     data.csv.dvc

    $ dvc move data.csv input.csv
    $ ls

     input.csv
     input.csv.dvc
```
