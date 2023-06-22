# cache migrate

Migrate existing <abbr>cache</abbr> data to the DVC 3.0 location.

## Synopsis

```usage
usage: dvc cache migrate [-h] [-q | -v] [--dry]
```

## Description

Forces migration of <abbr>cache</abbr> data for files which were tracked in
older DVC releases to the DVC 3.0 location. Files from the old cache location
will be re-hashed using the DVC 3.0 hash algorithm, atomically moved to the new
cache location, and then a link will be created from the old location to the new
one.

On most local filesystems, this is equivalent to the de-duplication of files
tracked in DVC 3.0 and files tracked in older releases.

<admon type="warn">

On filesystems that do not support any type of
[linking](/doc/user-guide/data-management/large-dataset-optimization#file-link-types-for-the-dvc-cache),
data will be copied from the old cache location into the DVC 3.0 location
(resulting in no de-duplication).

</admon>

## Options

- `--dry` - Only print actions which would be taken without actually migrating
  any data.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Check the steps which will be taken before migrating

```cli
$ dvc cache migrate --dry
94975 files will be re-hashed and migrated to the DVC 3.0 cache location.
```

## Example: Migrate existing cache

```cli
$ dvc cache migrate
Migrated 94975 files to DVC 3.0 cache location.
```
