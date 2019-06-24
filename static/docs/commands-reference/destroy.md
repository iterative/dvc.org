# destroy

Remove all
[DVC files and directories](/doc/user-guide/dvc-files-and-directories) from the
project.

## Synopsis

```usage
usage: dvc destroy [-h] [-q | -v] [-f]
```

## Description

It removes DVC-files, and the entire `.dvc/` meta directory from the current
workspace. Note that the DVC cache will normally be removed as well, unless it's
set to an external location with `dvc cache dir`. (By default a local cache is
located in the `.dvc/cache` directory.) If you were using
[symlinks for linking data](/doc/user-guide/large-dataset-optimization) from the
cache, DVC will replace them with copies, so that your data is intact after the
DVC repository destruction.

## Options

- `-f`, `--force` - do not prompt when destroying DVC project.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

```dvc
$ dvc init
$ echo foo > foo
$ dvc add foo
$ ls -a

.dvc .git code.py foo foo.dvc

$ dvc destroy

This will destroy all information about your pipelines, all data files, as well as cache in .dvc/cache.
Are you sure you want to continue?
yes

$ ls -a

.git code.py foo
```

#### External Cache directory

By default, the cache location is `.dvc/cache`. Let's change the cache location
to `/mnt/cache` and then execute `dvc destroy` command.

```dvc
$ dvc init
$ echo foo > foo
$ dvc cache dir /mnt/cache
$ dvc add foo

$ ls -a

.dvc .git code.py foo foo.dvc

# Content of /mnt/cache
$ ls - aR /mnt/cache
/mnt/cache/:
. .. d3

/mnt/cache/d3/:
. .. b07384d113edec49eaa6238ad5ff00

$ dvc destroy

This will destroy all information about your pipelines, all data files, as well as cache in .dvc/cache.
Are you sure you want to continue? [y/n]
yes

 $ ls -a
.git code.py foo

 $ ls - aR /mnt/cache
 /mnt/cache/:
 . .. d3

 /mnt/cache/d3/:
 . .. b07384d113edec49eaa6238ad5ff00
```

After changing the default cache location with `dvc cache dir` to `/mnt/cache`.

`dvc destroy` command removed DVC-files, and the entire `.dvc/` meta directory
from the current DVC workspace. But the cache files that are present in the
`/mnt/cache` directory still persists. There are no changes or deletion done
with the cache file.
