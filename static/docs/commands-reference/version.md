# version

This command shows the system/environment information along with the DVC version.

## Synopsis

```usage
    usage: dvc version [-h] [-q | -v]
```

## Description

Running the command `dvc version` outputs the
following information about the system/environment:

Type | Detail
---- | ------
`DVC version` | Version of DVC along with information about the project's Git repository
`Python version` | Version of the Python being used for the project in which DVC is initialized
`Platform` | Information about the operating system of the machine

## Options

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

## Example

Getting the DVC version and environment information:

```dvc
    $ dvc version
    
    DVC version: 0.40.0+45f94e
    Python version: 3.6.7
    Platform: Linux-4.15.0-47-generic-x86_64-with-Ubuntu-18.04-bionic
```
