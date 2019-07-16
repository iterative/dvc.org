# move

Renames a file or a directory and modifies the corresponding
[DVC-file](/doc/user-guide/dvc-file-format) (see `dvc add`) to reflect the
change. If the file or directory has the same name as the corresponding
DVC-file, it would also rename the DVC-file.

## Synopsis

```usage
usage: dvc move [-h] [-q | -v] src dst

positional arguments:
  src            Source path to a data file or directory.
  dst            Destination path.
```

## Description

`dvc move` is useful when a `src` file or directory has previously been added to
DVC with `dvc add`, creating a [DVC-file](/doc/user-guide/dvc-file-format) (with
`src` as a dependency). `dvc move` behaves like `mv src dst`, moving `src` to
the given `dst` path, but it also renames and updates the corresponding DVC-file
appropriately.

> Note that `src` may be a copy or a
> [link](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> to a file in cache. The cached file is not changed by this command.

If the destination path (`dst`) already exists and is a directory, the source
file or directory (`src`) is moved unchanged into this folder along with the
corresponding DVC-file.

Let's imagine the following scenario:

```dvc
$ dvc add data.csv
```

The `dvc add` command would create a `data.csv.dvc` DVC-file with the following
content:

```yaml
md5: df33f383592e7a399e106ba1cb487a8c
wdir: .
outs:
  - md5: 2114961a6518cc6f91275897e6ff3f80
    path: data.csv
```

If we move this using the regular `mv data.csv other.csv` the DVC-file would not
know that we changed the `path` of `data.csv` to `other.csv`.

`dvc move` adjusts the content of the DVC-file to update `path`. So that saves
some manual and programming steps.

To illustrate, notice that `path` value has changed, as well as the DVC-file
name:

```dvc
$ dvc move data.csv other.csv
$ cat other.csv.dvc
```

And here is the updated content of the `other.csv.dvc`:

```yaml
md5: df33f383592e7a399e106ba1cb487a8c
wdir: .
outs:
  - md5: 2114961a6518cc6f91275897e6ff3f80
    path: other.csv
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Here we use `dvc add`to put a file under DVC control. Then we change the name of
it using `dvc move`.

```dvc
$ dvc add data.csv
$ tree
.
├── data.csv
└── data.csv.dvc


$ dvc move data.csv other.csv
$ tree
.
├── other.csv
└── other.csv.dvc
```

Here we use `dvc add` to put a file under DVC control. Then we use `dvc move` to
change its location. Note that the `data.csv.dvc` DVC-file is also moved. If
target path already exists and is a directory, data file is moved with unchanged
name into this folder.

```dvc
$ tree
.
├── data
│   └── foo
└── data2
    └── subdir

$  dvc add data/foo
$  tree
.
├── data
│   ├── foo
│   └── foo.dvc
└── data2
    └── subdir

$ dvc move data/foo data2/subdir/
$ tree
.
├── data
└── data2
    └── subdir
        ├── foo
        └── foo.dvc
```

In this example we use `dvc add` to put a directory under DVC control. Then we
use `dvc move` to move the whole directory. As in other cases, DVC-file is also
moved.

```dvc
$ tree
.
├── data
│   ├── bar
│   └── foo
└── data2

$ dvc add data
$ tree
.
├── data
│   ├── bar
│   └── foo
├── data2
└── data.dvc

$ dvc move data data2/data3
$ tree
.
└── data2
    ├── data3
    │   ├── bar
    │   └── foo
    └── data3.dvc
```
