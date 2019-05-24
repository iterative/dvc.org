# move

Renames a file or a directory and modifies the corresponding DVC file (see
`dvc add`) to reflect the change. If the file or directory has the same name as
the corresponding DVC file, it would also rename the DVC file.

## Synopsis

```usage
usage: dvc move [-h] [-q] [-v] src dst

positional arguments:
    src                   Source path to a data file or directory.
    dst                   Destination path.

```

## Description

`dvc move` moves the file named by the `src` operand to the destination path
named by the `dst` operand. It also renames and updates the corresponding DVC
file. In general it behaves the same way as `mv src dst`, but takes care of a
DVC file.

If destination path already exists and is a directory, source file or directory
is moved unchanged into this folder along with the corresponding DVC file.

Let's imagine the following scenario:

```dvc
$ dvc add data.csv
```

The `dvc add` command would create a `data.csv.dvc` DVC file with the following
content:

```yaml
md5: 3d1a3e5a5b662490e198d6a6ae84984b
outs:
  - cache: true
    md5: c8263e8422925b0872ee1fb7c953742a
    path: data.csv
```

If we move this using the regular `mv data.csv other.csv` the DVC file would not
know that we changed the `path` of `data.csv` to `other.csv`.

`dvc move` adjusts the content of the DVC file to update `path`. So that saves
some manual and programming steps.

To illustrate, notice that `path` value has changed, as well as the DVC file
name:

```dvc
$ dvc move data.csv other.csv
$ cat data.csv.dvc
```

And here is the updated content of the `data.csv.dvc`:

```yaml
md5: 3d1a3e5a5b662490e198d6a6ae84984b
outs:
  - cache: true
    md5: c8263e8422925b0872ee1fb7c953742a
    path: other.csv
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

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
change its location. Note that the data stage file is also moved. If target path
already exists and is a directory, data file is moved with unchanged name into
this folder.

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
use `dvc move` to move the whole directory. As in other cases, DVC file is also
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
