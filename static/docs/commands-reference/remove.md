# remove

Remove data file or data directory.

This command safely removes data files or stage outputs that are tracked by DVC
from your *workspace*. It takes a `.dvc` file and removes all outputs and
optionally removes the file itself.

Note, it *does not* remove files from the local cache or remote storage (see `dvc gc`).
However, remember to run `dvc push` to save the files you actually want to use in the
future or share.

```usage
    usage: dvc remove [-h] [-q] [-v] [-o | -p] targets [targets ...]

    positional arguments:
        targets               DVC files.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -o, --outs            Only remove DVC file outputs (default).
        -p, --purge           Remove DVC file and all its outputs
```

Check also [Update Tracked Files](/doc/user-guide/update-tracked-file) to see
how it can be used to replace or modify files that are under DVC control.

## Options

* `--outs` (default) - remove outputs described in the provided DVC file(s),
keep the DVC files.

* `--purge` - remove outputs and DVC files

## Examples

Let's imagine we have a `data.csv` under DVC control:

```dvc
    $ dvc add data.csv
    $ ls data.csv*

        data.csv
        data.csv.dvc
```

Remove `data.csv` data file:


```dvc
    $ dvc remove data.csv.dvc
    $ ls data.csv*

         data.csv.dvc
```

Purge DVC files:

```dvc
    $ dvc remove data.csv.dvc -p
    $ ls data.csv*
```
