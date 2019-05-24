# pipeline

A set of commands to manage pipelines: [show](#show) - visualize or
[list](#list) - list existing pipelines.

## Synopsis

```usage
usage: dvc pipeline [-h] [-q | -v] {show,list} ...

positional arguments:
  {show,list}    Use dvc pipeline CMD --help for command-specific help.
    show         Show pipeline.
    list         List pipelines.
```

## Description

Manage pipeline.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
