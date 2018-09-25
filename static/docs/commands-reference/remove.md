# remove

Remove data file or data directory.

```usage
    usage: dvc remove [-h] [-q] [-v] [-o | -p] targets [targets ...]

    positional arguments:
        targets               DVC files.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -o, --outs            Only remove DVC file outputs.(default)
        -p, --purge           Remove DVC file and all its outputs
```

## Examples

Remove `data.csv` data file:

```dvc
    $ dvc add data.csv
    $ ls data.csv*

        data.csv
        data.csv.dvc

    $ dvc remove data.csv.dvc
    $ ls data.csv*

         data.csv.dvc

    $ dvc remove data.csv.dvc -p
    $ ls data.csv*
```
