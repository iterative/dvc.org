# Pipeline

Manage pipeline.

```usage
    usage: dvc pipeline [-h] [-q] [-v] {show} ...

    positional arguments:
      {show}         Use dvc pipeline CMD --help for command-specific help
        show         Show pipeline

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```

## Show

Show stages in the pipeline that lead to the specified stage.

```usage
    usage: dvc pipeline show [-h] [-q] [-v] [-c] targets [targets ...]

    positional arguments:
      targets         DVC files.

    optional arguments:
      -h, --help      show this help message and exit
      -q, --quiet     Be quiet.
      -v, --verbose   Be verbose.
      -c, --commands  Print commands instead of paths to DVC files.
```

### Example
```dvc
    $ dvc pipeline show output.dvc

    raw.dvc
    data.dvc
    output.dvc

    $ dvc pipeline show output.dvc --commands  

    download.py s3://mybucket/myrawdata raw
    cleanup.py raw data
    process.py data output
```
