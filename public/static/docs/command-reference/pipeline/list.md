# pipeline list

Show connected groups (pipelines) of [stage](/doc/command-reference/run) that
are independent of each other.

## Synopsis

```usage
usage: dvc pipeline list [-h] [-q | -v]
```

## Description

`dvc list` displays a list of all existing stages in the <abbr>project</abbr>,
grouped in their corresponding [pipeline](/doc/command-reference/pipeline), when
connected.

> Note that the stages in these lists are in ascending order, that is, from last
> to first.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

List available pipelines:

```dvc
$ dvc pipeline list
Dvcfile
======================================================================
raw.dvc
data.dvc
output.dvc
======================================================================
2 pipelines total
```
