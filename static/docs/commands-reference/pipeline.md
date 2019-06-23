# pipeline

A set of commands to manage [pipelines](/doc/get-started/pipeline):
[show](/doc/commands-reference/pipeline-show) - visualize or
[list](/doc/commands-reference/pipeline-list) - list existing pipelines.

## Synopsis

```usage
usage: dvc pipeline [-h] [-q | -v] {show,list} ...

positional arguments:
  COMMAND
    show         Show pipeline.
    list         List pipelines.
```

## Description

A data pipeline, in general, is a chain of commands that process data files. It
produces intermediate data and a final result. Machine Learning (ML) pipelines
typically start a with large raw datasets, include featurization and training
intermediate stages, and produce a final model, as well as certain metrics.

In DVC, pipeline stage files and commands, their data I/O, interdependencies,
and results (intermediate or final) are defined with `dvc add` and `dvc run`,
among other commands. This allows us to form one or more pipelines of stages
connected by their dependencies and outputs.

`dvc pipeline` commands help users display the existing project pipelines in
different ways.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
