# destroy

Remove all
[DVC files and directories](/doc/user-guide/dvc-files-and-directories) from a
<abbr>DVC project</abbr>.

## Synopsis

```usage
usage: dvc destroy [-h] [-q | -v] [-f]
```

## Description

`dvc destroy` removes `dvc.yaml`, `.dvc` files, and the internal `.dvc/`
directory from the <abbr>workspace</abbr>.

Note that the <abbr>cache directory</abbr> will be removed as well, unless it's
[set to an external location](/doc/use-cases/shared-development-server#configure-the-external-shared-cache)
(by default a local cache is located in `.dvc/cache`). If you were using
[symlinks for linking](/doc/user-guide/large-dataset-optimization) data from the
cache, DVC will replace them with the latest versions of the actual files and
directories first, so that your data is intact after the project's destruction.

> Refer to
> [DVC files and directories](/doc/user-guide/dvc-files-and-directories) for
> more details on the directories and files deleted by this command.

## Options

- `-f`, `--force` - do not prompt when destroying this project.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

```dvc
$ dvc init
$ echo foo > foo
$ dvc add foo
$ ls -a

.dvc .git code.py foo foo.dvc

$ dvc destroy
This will destroy all information about your pipelines, all data files...
Are you sure you want to continue?
yes

$ ls -a

.git code.py foo
```

## Example: External cache directory

By default, the <abbr>cache</abbr> location is `.dvc/cache`. Let's change the
cache location to `/mnt/cache` and then execute `dvc destroy` command:

```dvc
$ dvc init
$ echo foo > foo
$ dvc cache dir /mnt/cache
$ dvc add foo
```

`dvc cache dir` changed the location of the cache directory to an external
location. Content of <abbr>workspace</abbr>:

```dvc
$ ls -a
.dvc .git code.py foo foo.dvc
```

Content of `/mnt/cache` directory:

```dvc
$ tree /mnt/cache
/mnt/cache/
└── b1
    └── 946ac92492d2347c6235b4d2611184
```

Let's execute `dvc destroy`:

```dvc
$ dvc destroy

This will destroy all information about your pipelines, all data files...
Are you sure you want to continue? [y/n]
yes

$ ls -a
.git code.py foo
```

`dvc destroy` command removed DVC-files, and the internal `.dvc/` directory from
the <abbr>workspace</abbr>. But the cache files that are present in the
`/mnt/cache` directory still persist:

```dvc
$ tree /mnt/cache
/mnt/cache/
└── b1
    └── 946ac92492d2347c6235b4d2611184
```
