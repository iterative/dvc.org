# update

Update <abbr>data artifacts</abbr> imported from other DVC repositories.

## Synopsis

```usage
usage: dvc update [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        DVC-files to update.
```

## Description

After creating import stages with `dvc import`, the external data source can
change. `dvc update` can be used to bring the imported <abbr>data
artifact</abbr> up to date. This is currently the only method to do so.

To indicate which import stage(s) to update, specify the corresponding
DVC-file(s) `targets` as command argument(s).

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
