# move

Rename a file or a directory and modify the corresponding
[DVC-file](/doc/user-guide/dvc-file-format) (see `dvc add`) to reflect the
change. If the file or directory has the same name as the corresponding
DVC-file, it also renames it.

## Synopsis

```usage
usage: dvc move [-h] [-q | -v] src dst

positional arguments:
  src            Source path to a data file or directory.
  dst            Destination path.
```

## Description

`dvc move` is useful when a `src` file or directory has previously been added to
the <abbr>project</abbr> with `dvc add`, creating a
[DVC-file](/doc/user-guide/dvc-file-format) (with `src` as a dependency).
`dvc move` behaves like `mv src dst`, moving `src` to the given `dst` path, but
it also renames and updates the corresponding DVC-file appropriately.

> Note that `src` may be a copy or a
> [link](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> to a file in cache. The cached file is not changed by this command.

If the destination path (`dst`) already exists and is a directory, the source
code file or directory (`src`) is moved unchanged into this folder along with
the corresponding DVC-file.

Let's imagine the following scenario:

```dvc
$ dvc add data.csv
```

The `dvc add` command would create a `data.csv.dvc` DVC-file with the following
content:

```yaml
md5: 3d1a3e5a5b662490e198d6a6ae84984b
outs:
  - cache: true
    md5: c8263e8422925b0872ee1fb7c953742a
    path: data.csv
```

If we move this using the regular `mv data.csv other.csv` command, DVC wouldn't
know that we changed the `path` of `data.csv` to `other.csv`, as the old
location is still registered in the corresponding DVC-file.

`dvc move` adjusts the content of the DVC-file to update `path`. This saves
users from performing several manual operations:

```dvc
$ dvc move data.csv other.csv
$ cat other.csv.dvc
```

Notice that `path` value has changed, as well as the DVC-file name.

And here is the updated content of the `other.csv.dvc`:

```yaml
md5: 3d1a3e5a5b662490e198d6a6ae84984b
outs:
  - cache: true
    md5: c8263e8422925b0872ee1fb7c953742a
    path: other.csv
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: change the file name

We first use `dvc add` to track file with DVC. Then, we change its name using
`dvc move`.

```dvc
$ dvc add data.csv
...
$ tree
.
├── data.csv
└── data.csv.dvc

$ dvc move data.csv other.csv
...
$ tree
.
├── other.csv
└── other.csv.dvc
```

## Example: change the location

We use `dvc add` to track a file with DVC, then we use `dvc move` to change its
location. If target path already exists and is a directory, data file is moved
with unchanged name into this folder. Note that the `data.csv.dvc`
[DVC-file](/doc/user-guide/dvc-file-format) is also moved.

```dvc
$ tree
.
├── data
│   └── foo
└── data2
    └── subdir

$  dvc add data/foo
...
$  tree
.
├── data
│   ├── foo
│   └── foo.dvc
└── data2
    └── subdir

$ dvc move data/foo data2/subdir/
...
$ tree
.
├── data
└── data2
    └── subdir
        ├── foo
        └── foo.dvc
```

## Example: change an imported directory name and location

Let's try the same with an entire directory imported from an external <abbr>DVC
repository</abbr> with `dvc import`. Note that, as in the previous cases, the
DVC-file is also moved.

```dvc
$ dvc import ../another-repo data
...
$ tree
.
├── data
│   ├── bar
│   └── foo
└── data.dvc

$ dvc move data data2/data3
...
$ tree
.
└── data2
    ├── data3
    │   ├── bar
    │   └── foo
    └── data3.dvc
```
