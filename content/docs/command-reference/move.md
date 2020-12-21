# move

Rename a file or directory tracked with a `.dvc` file, and modify the `.dvc`
file to reflect the change. The `.dvc` file is renamed if the file or directory
has the same base name (typical).

## Synopsis

```usage
usage: dvc move [-h] [-q | -v] src dst

positional arguments:
  src            Source path to a data file or directory.
  dst            Destination path.
```

## Description

`dvc move` is useful when a `src` file or directory has previously been added to
the <abbr>project</abbr> with `dvc add` or `dvc import`, creating a `.dvc` file
(with `src` as an output).

⚠️ `dvc move` doesn't support renaming stage <abbr>outputs</abbr> (see
`dvc.yaml`), they have to be [renamed manually](#renaming-stage-outputs).

> Note that `src` itself may be either a
> [link](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> or a copy to the corresponding data in the cache. The <abbr>cached</abbr> file
> is not changed by this command.

`dvc move` behaves like `mv src dst`, moving `src` to the given `dst` path, but
it also renames and updates the corresponding `.dvc` file appropriately. If the
destination path is a directory and already exists, the source file or directory
is moved into this folder along with the corresponding `.dvc` file.

Let's imagine the following scenario:

```dvc
$ dvc add data.csv
```

This creates a `data.csv.dvc` file with the following content:

```yaml
outs:
  - md5: c8263e8422925b0872ee1fb7c953742a
    path: data.csv
```

If we move the data file regularly, with something like `mv data.csv other.csv`,
DVC wouldn't know that we changed the `path` of `data.csv` to `other.csv`, as
the old location is still found in the corresponding `.dvc` file. `dvc move`
updates that `path`, saves users from manual editing it:

```dvc
$ dvc move data.csv other.csv
$ cat other.csv.dvc
```

```yaml
outs:
  - md5: c8263e8422925b0872ee1fb7c953742a
    path: other.csv
```

Notice the `.dvc` file name was changed to `other.csv.dvc`.

### Renaming stage outputs

`dvc move` does not cover this case, but it can be done manually. For example,
let's rename stage <abbr>output</abbr> from `keras.h5` to `model.h5` in this
`dvc.yaml`:

```yaml
stages:
  train:
    ...
    outs:
    - keras.h5
```

First, change the output name in the `train` stage of `dvc.yaml` and update
`/keras.h5` to `/model.h5` in `.gitignore` file. Then, we rename the existing
model file:

```dvc
$ mv keras.h5 model.h5
```

> Note that, often the output of a stage is a dependency in another stage,
> creating a
> [dependency graph](/doc/command-reference/run#dependencies-and-outputs). In
> this case, you may want to also update the `path` in the `deps` field of
> `dvc.yaml`.

Finally, we run `dvc commit` with the `-f` option to force save the changes to
<abbr>cache</abbr>:

```dvc
$ dvc commit -f
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Change the file name

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

## Example: Change a file location

We use `dvc add` to track a file with DVC, then we use `dvc move` to change its
location. If the target path is a directory and already exists, the data file is
moved with unchanged name into this folder. Note that the corresponding `.dvc`
file, `data.csv.dvc` is also moved.

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

## Example: Move a directory

Let's try the same with an entire directory imported from an external <abbr>DVC
repository</abbr> with `dvc import`. Note that, as in the previous cases, the
`.dvc` file is also moved.

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
