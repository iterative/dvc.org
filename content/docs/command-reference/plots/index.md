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
    templates   List built-in plots templates or show JSON
                specification for one.
```

## Description

You can visualize and compare JSON, YAML 1.2, CSV, TSV data files or JPEG, GIF,
PNG images found in your project. Typically these are artifacts of an [ML
pipeline] or performance logs produced by [DVCLive].

Plots have to be defined either at the stage level, or at the pipeline level in
`dvc.yaml`.

[ml pipeline]: /doc/start/data-management/data-pipelines
[dvclive]: /doc/dvclive/dvclive-with-dvc

<admon icon="book">

See [Visualizing Plots] and [Top-level plot definitions] for more details

[visualizing plots]: /doc/user-guide/visualizing-plots
[top-level plot definitions]:
  /doc/user-guide/project-structure/dvcyaml-files#top-level-plot-definitions

</admon>

`dvc plots` subcommands help you customize and generate these plots.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
