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

DVC tracks data by saving contents to it's cache, and records its `path` and
hash value in `.dvc` and `dvc.lock` metafiles.

This is used, for example, to show the changes in `dvc data status` -- by
comparing between the hash value between last version committed to Git and the
one present in the `.dvc` and `dvc.lock` files in the workspace, against what is
currently checked-out in the workspace.
