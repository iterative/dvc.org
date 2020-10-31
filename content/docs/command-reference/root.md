# root

Return the relative path to the root directory of the <abbr>DVC project</abbr>.

## Synopsis

```usage
usage: dvc root [-h] [-q | -v]
```

## Description

Returns the path to the root directory of the <abbr>DVC project</abbr>, relative
to the current working directory. `dvc root` is useful for referencing a file in
another directory when working in a subdirectory of the project.

Use this command to build fixed paths to dependencies, files, or stage
<abbr>outputs</abbr>. This is useful when creating shell scripts that generate
`dvc.yaml` files programmatically or with the `dvc run` helper.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Basic output

```dvc
$ dvc root
.
$ mkdir subdir
$ cd subdir
$ dvc root
..
```

## Example: Referencing fixed paths in other commands

When working in a subdirectory of a <abbr>DVC project</abbr>, simplify file
references by making all paths relative to the root directory.

```dvc
$ dvc root
../../../

$ dvc run -d $(dvc root)/data/file.cvs ... \
    python $(dvc root)/scripts/something.py
```

The same can be applied to non-DVC commands:

```dvc
$ dvc root
../..

$ tree $(dvc root)/data/
../../data/
├── data.xml
├── data.xml.dvc
...
```
