# pipeline

A set of commands to manage [pipelines](/doc/tutorials/get-started/pipeline):
[show](/doc/command-reference/pipeline/show) and
[list](/doc/command-reference/pipeline/list).

## Synopsis

```usage
usage: dvc pipeline [-h] [-q | -v] {show,list} ...

positional arguments:
  COMMAND
    show         Show pipeline.
    list         List pipelines.
```

## Description

A data pipeline, in general, is a series of data processes (for example console
commands that take an input and produce an <abbr>output</abbr>). A pipeline may
produce intermediate data, and has a final result. Machine Learning (ML)
pipelines typically start a with large raw datasets, include intermediate
featurization and training stages, and produce a final model, as well as
accuracy [metrics](/doc/command-reference/metrics).

In DVC, pipeline stages and commands, their data I/O, interdependencies, and
results (intermediate or final) are specified with `dvc add` and `dvc run`,
among other commands. This allows DVC to restore one or more pipelines of stages
interconnected by their dependencies and outputs later. (See `dvc repro`.)

> DVC builds a dependency graph
> ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) to do this.

`dvc pipeline` commands help users display the existing project pipelines in
different ways.

If we reproduce a pipeline, the files and directories listed under `.dvcignore` may get deleted permanently. 
See [.dvcignore](docs/user-guide/.dvcignore).
## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
