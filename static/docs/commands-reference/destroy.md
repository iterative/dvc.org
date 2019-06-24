# destroy

Remove all
[DVC files and directories](/doc/user-guide/dvc-files-and-directories) from the
project.

## Synopsis

```usage
usage: dvc destroy [-h] [-q | -v] [-f]
```

## Description

It removes all the files present in the current DVC workspace. Note that the DVC
cache will normally be removed as well, unless it's set to an external location
with `dvc cache dir`. (By default a local cache is located in the `.dvc/cache`
directory.) If you were using
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

.dvc .git foo foo.dvc

$ dvc destroy

This will destroy all information about your pipelines, all data files, as well
as cache in .dvc/cache.
Are you sure you want to continue? [y/n]
yes

$ ls -a

.git .gitignore
```

Let's have a look what happens when the `cache` directory is set to another
location.

```dvc
$ dvc init
$ echo foo > foo
$ dvc config cache.dir /mnt/cache
$ dvc add foo

$ ls -a

.dvc foo foo.dvc .git .gitignore

# Content of /mnt/cache
$ ls - aR /mnt/cache
/mnt/cache/:
. .. d3

/mnt/cache/d3/:
. .. b07384d113edec49eaa6238ad5ff00

$ dvc destroy

This will destroy all information about your pipelines, all data files,
as well as cache in .dvc/cache.
Are you sure you want to continue? [y/n]
yes

 $ ls -a
.git .gitignore

 $ ls - aR /mnt/cache
 /mnt/cache/:
 . .. d3

 /mnt/cache/d3/:
 . .. b07384d113edec49eaa6238ad5ff00
```

Files present in `/mnt/cache` directory still persists.
