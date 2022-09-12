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

You can visualize and compare JSON, YAML 1.2, CSV, TSV data files or JPEG, GIF,
PNG images found in your project. Typically these are artifacts of an [ML
pipeline] or performance logs produced by [DVCLive].

`dvc plots` subcommands help you customize and generate these plots.

📖 See [Visualizing Plots] as well as the top-level plots definition
[specification] for more details.

[ml pipeline]: /doc/start/data-management/pipelines
[dvclive]: /doc/dvclive/dvclive-with-dvc
[visualizing plots]: /doc/user-guide/visualizing-plots
[specification]:
  /doc/user-guide/project-structure/dvcyaml-files#top-level-plot-definitions

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
