# fetch

Fetch files under DVC control from remote storage into the local cache.

## Synopsis

```usage
    usage: dvc fetch [-h] [-q | -v] [-j JOBS] [--show-checksums] [-r REMOTE] [-a]
                     [-T] [-d] [-R]
                     [targets [targets ...]]
    
    Fetch data files from the cloud.
    
    positional arguments:
      targets               DVC files.
```

## Description

Files under DVC control have been
[added](https://dvc.org/doc/get-started/add-files) and
[pushed](https://dvc.org/doc/get-started/share-data) to the remote previously,
and are now listed as outputs in a DVC file (`target`). See DVC File Format for
more info on outputs. If no `targets` are specified, the set of data files to
fetch is determined by analyzing all `.dvc` files in the current branch, unless
`--all-branches` is specified.

Fetching usually means downloading from the remote storage. See
`dvc remote add` for more information on how to configure different remote
storage providers.

`dvc fetch` is performed automatically by `dvc pull` when the target files are
not already in the local cache. Fetching brings files in from a remote to the
local DVC cache, in effect making them available for pulling to the workspace.

## Options

- ...

## Examples

Fetch all files used in the current Git branch:

```dvc
    $ dvc fetch

    (1/8): [#################################] 100% images/0001.jpg
    (2/8): [#################################] 100% images/0002.jpg
    (3/8): [#################################] 100% images/0003.jpg
    (4/8): [#################################] 100% images/0004.jpg
    (5/8): [#################################] 100% images/0005.jpg
    (6/8): [#################################] 100% images/0006.jpg
    (7/8): [#################################] 100% images/0007.jpg
    (8/8): [#################################] 100% model.pkl
```

Fetch outputs of a specific dvc file:
```dvc
    $ dvc fetch data.zip.dvc
    [#################################] 100% data.zip
```
