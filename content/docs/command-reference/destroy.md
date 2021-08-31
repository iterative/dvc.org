# destroy

Remove all <abbr>DVC files</abbr> and
[internals](/doc/user-guide/project-structure/internal-files) from a <abbr>DVC
project</abbr>.

## Synopsis

```usage
usage: dvc destroy [-h] [-q | -v] [-f]
```

## Description

`dvc destroy` removes `dvc.yaml`, `.dvc` files, and the internal `.dvc/`
directory from the <abbr>project</abbr>.

Note that the <abbr>cache directory</abbr> will be removed as well, unless it's
set to an
[external location](/doc/user-guide/managing-external-data#setting-up-an-external-cache)
(by default a local cache is located in `.dvc/cache`). If you have setup
[symlinks](/doc/user-guide/large-dataset-optimization) (from cache to workspace)
in your project, DVC will replace them with the latest versions of the actual
files and directories first, so that your data is intact after destruction.

[external cache]:
  /doc/user-guide/managing-external-data#setting-up-an-external-cache

> Refer to [Project Structure](/doc/user-guide/project-structure) for more
> details on the directories and files deleted by this command.

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

## Example: Preserve an external cache directory

By default, the <abbr>cache</abbr> location is `.dvc/cache`. Let's change its
location to `/mnt/cache` using `dvc cache dir`, add some data, and then try
`dvc destroy`:

```dvc
$ dvc cache dir /mnt/cache
$ echo foo > foo
$ dvc add foo
```

Contents of the <abbr>workspace</abbr>:

```dvc
$ ls -a
.dvc .git code.py foo foo.dvc
```

Contents of the (external) cache (`b1/946a...` contains `foo`):

```dvc
$ tree /mnt/cache
/mnt/cache/
└── b1
    └── 946ac92492d2347c6235b4d2611184
```

OK, let's destroy the <abbr>DVC project</abbr>:

```dvc
$ dvc destroy

This will destroy all information about your pipelines, all data files...
Are you sure you want to continue? [y/n]
yes

$ ls -a
.git code.py foo
```

`foo.dvc` and the internal `.dvc/` directory were removed (this would include
any cached data prior to changing the cache location). But the cache files in
`/mnt/cache` persist:

```dvc
$ tree /mnt/cache
/mnt/cache/
└── b1
    └── 946ac92492d2347c6235b4d2611184
```
