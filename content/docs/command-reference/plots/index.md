# plots

A set of commands to visualize and compare data series or images from ML
projects: [show](/doc/command-reference/plots/show),
[diff](/doc/command-reference/plots/diff), and
[templates](/doc/command-reference/plots/templates).

## Synopsis

```usage
usage: dvc plots [-h] [-q | -v] {show,diff,templates} ...

positional arguments:
  COMMAND
    show        Generate plots from target files or from `plots`
                definitions in `dvc.yaml`.
    diff        Show multiple versions of a plot by overlaying them
                in a single image.
    templates   List built-in plots templates or show JSON
                specification for one.
```

## Description

You can visualize and compare JSON, YAML 1.2, CSV, TSV data files or JPEG, GIF,
PNG, or SVG images found in your project. Typically these are artifacts of an
[ML pipeline] or performance logs produced by [DVCLive].

[ml pipeline]: /doc/start/data-management/data-pipelines
[dvclive]: /doc/dvclive

<admon icon="book">

See [Visualizing Plots] and the [plots schema] for more details

[visualizing plots]: /doc/user-guide/experiment-management/visualizing-plots
[plots schema]: /doc/user-guide/project-structure/dvcyaml-files#plots

</admon>

`dvc plots` subcommands help you customize and generate these plots.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
