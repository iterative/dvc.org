# plots

A set of commands to visualize and compare data series or images from ML
projects: [show](/doc/command-reference/plots/show),
[diff](/doc/command-reference/plots/diff),
[modify](/doc/command-reference/plots/modify) and
[templates](/doc/command-reference/plots/templates).

## Synopsis

```usage
usage: dvc plots [-h] [-q | -v] {show,diff,modify,templates} ...

positional arguments:
  COMMAND
    show        Generate plots from target files or from `plots`
                definitions in `dvc.yaml`.
    diff        Show multiple versions of a plot by overlaying them
                in a single image.
    modify      Modify display properties of data-series plots
                defined in stages (has no effect on image plots).
    templates   Write built-in plots templates to a directory
                (.dvc/plots by default).
```

## Description

`dvc plots` subcommands configure and visualize data and images produced by
machine learning projects.

📖 See [Visualizing Plots](/doc/user-guide/visualizing-plots) for more info.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
