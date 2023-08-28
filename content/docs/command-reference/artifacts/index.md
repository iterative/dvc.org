# artifacts

Commands for working with DVC
[artifacts](/doc/user-guide/project-structure/dvcyaml-files#artifacts) and the
DVC [model registry](/doc/use-cases/model-registry).

## Synopsis

```usage
usage: dvc artifacts [-h] [-q | -v] {get} ...

positional arguments:
  COMMAND
    get          Download an artifact from a DVC project.
```

## Description

`dvc artifacts` subcommands provide a command line client for working with model
registry artifacts.

<admon icon="book">

See [Model Registry](/doc/use-cases/model-registry) for more info.

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
