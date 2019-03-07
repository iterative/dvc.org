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
[pushed](https://dvc.org/doc/get-started/share-data) to the remote 
previously, and are now listed as outputs in a DVC file (`target`). See DVC 
File Format for more info on outputs. If no `targets` are specified, the set 
of data files to fetch is determined by analyzing all `.dvc` files in the 
current branch, unless `--all-branches` is specified.

Fetching usually means downloading from the remote storage. The default 
remote is used unless `--remote` is specified. See `dvc remote add` for more 
information on how to configure different 
remote storage providers.

`dvc fetch` is performed automatically by `dvc pull` when the target files 
are not already in the local cache. Fetching brings files in from a remote to
 the local DVC cache, in effect making them available for pulling to the 
 workspace.

## Options

- `-r REMOTE`, `--remote REMOTE` - Specify a `REMOTE` to fetch from. (See
  `dvc remote` for more information about remotes.) It not provided, the 
  default remote (See `dvc config core.remote`) is used.

- `-d`, `--with-deps` - Fetch cache for all dependencies of the specified 
  `target`.

- `-R`, `--recursive` - Fetch cache for subdirectories of the specified 
  directory?

- `-j JOBS`, `--jobs JOBS` - Number of threads to run simultaneously. Using 
  more jobs may improve the total download speed if a combination of small and
  large files are being fetched. Default = 1?

- `-a`, `--all-branches` - Fetch cache for all Git branches, not just the 
  active one.

- `-T`, `--all-tags` - Fetch cache for all Git tags.

- `--show-checksums` - Show checksums instead of file names when printing the
  download progress.

- `-v`, `--verbose` - Displays detailed tracing information.

- `-q`, `--quiet` - Do not write anything to standard output. Exit with 0 if 
  all `targets` are successfully fetched to cache (or already there), otherwise
  exit with 1.

- `-h`, `--help` - prints the usage/help message, and exit.

## Examples
> W.I.P. Diagrams and good examples would be cool.

The command fetches only outputs of specific stages if one or more dvc files (targets) are specified dvc push data.zip.dvc


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

## Source code

See `CmdDataFetch` class in 
https://github.com/iterative/dvc/blob/master/dvc/command/data_sync.py