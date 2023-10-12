# cache migrate

Migrate existing <abbr>cache</abbr> data to the DVC 3.0 location.

## Synopsis

```usage
usage: dvc cache migrate [-h] [-q | -v] [--dvc-files] [--dry]
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

By default, `dvc cache migrate` only migrates cache data and does not modify
<abbr>DVC files</abbr> in the <abbr>DVC repository</abbr>. The `--dvc-files`
option can be specified to migrate entries in all DVC files in the repository to
the DVC 3.0 format.

<admon type="info">

Note that when using `--dvc-files` option, DVC will only migrate DVC files in
<abbr>workspace</abbr> (and Git history will not be re-written).

</admon>

## Options

- `--dvc-files` - migrate entries in all existing <abbr>DVC files</abbr> in the
  repository to use the DVC 3.0 format.

- `--dry` - only print actions which would be taken without actually migrating
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

## Example: Migrate existing cache and update DVC files

```cli
$ dvc cache migrate --dvc-files
Migrated 3 files to DVC 3.0 cache location.
Updating DVC file 'foo.dvc'
Modifying stage 'baz' in 'dir/dvc.yaml'
Updating lock file 'dir/dvc.lock'
Updating DVC file 'dir/bar.dvc'

To track the changes with git, run:

        git add dir/dvc.yaml foo.dvc dir/dvc.lock dir/bar.dvc

To enable auto staging, run:

        dvc config core.autostage true
```
