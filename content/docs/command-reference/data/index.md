# data

Contains a command that shows changes in data tracked by DVC:
[status](/doc/command-reference/data/status).

## Synopsis

```usage
usage: dvc data [-h] [-q | -v] {status} ...

positional arguments:
  COMMAND
    status         Show changes in the data tracked by DVC in the workspace.
```

## Description

DVC discovers data tracked by DVC using the file path and the file hash
specified in the `.dvc` and `dvc.lock` files, and builds an index out of it.

This is used by DVC, for example, to show `dvc data status`, by comparing
different versions of the index. DVC uses <abbr>cache</abbr> to compare between
the specified hashes, the workspace and the actual file present in the cache to
see if they have changed.
