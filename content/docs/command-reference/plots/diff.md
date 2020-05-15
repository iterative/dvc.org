# plots diff

Show multiple versions of [continuous metrics](/doc/command-reference/plots) by
plotting them in a single image.

## Synopsis

```usage
usage: dvc plots diff [-h] [-q | -v] [-t [TEMPLATE]] [-d [DATAFILE]] [-f FILE]
                     [-s SELECT] [-x X] [-y Y] [--stdout] [--no-csv-header]
                     [--no-html] [--title TITLE] [--xlab XLAB] [--ylab YLAB]
                     [revisions [revisions ...]]

positional arguments:
  revisions             Git commits to plot from
```

## Description

This command visualize difference between metrics among experiments in the
repository history. Requires that Git is being used to version the metrics
files.

The metrics file needs to be specified through `-d`/`--datafile` option. Also, a
plot can be customized with
[plot templates](/doc/command-reference/plots#plot-templates) using the
`--template` option. To learn more about the file formats and templates please
see `dvc plots`.

`revisions` are Git commit hashes, tag, or branch names. If none are specified,
`dvc plots diff` compares metrics currently present in the
<abbr>workspace</abbr> (uncommitted changes) with the latest committed version.
A single specified revision results in plotting the difference in metrics
between the workspace and that version.

In contrast to commands such as `git diff`, `dvc metrics diff` and
`dvc params diff`, **any number of `revisions` can be provided**, and the
resulting plot shows all of them in a single output.

This command can work with metric files that are committed to a repository
history, data files controlled by DVC, or any other file in the workspace. In
the case of DVC-tracked `datafile`, the `revisions` are used to find the
corresponding [DVC-files](/doc/user-guide/dvc-file-format).

## Options

- `-d [DATAFILE], --datafile [DATAFILE]` - Metrics file to visualize.

- `-t [TEMPLATE], --template [TEMPLATE]` - File to be injected with data. The
  default template is `.dvc/plot/default.json`. See
  [Plot templates](/doc/command-reference/plots#plot-templates).

- `-f FILE, --file FILE` - Name of the generated file. By default, the output
  file name is equal to the input filename with additional `.html` suffix or
  `.json` suffix for `--no-html` mode.

- `--no-html` - Do not wrap output Vega specification (JSON) with HTML.

- `-x X` - Field name for X axis. An auto-generated `index` field is used by
  default.

- `-y Y` - Field name for Y axis. The last column or field found in the
  `datafile` is used by default.

- `-s SELECT, --select SELECT` - Select which fields or JSONPath to store in the
  plot file [metadata](https://vega.github.io/vega/docs/data/). The
  auto-generated, zero-based `index` column is always included.

- `--xlab XLAB` - X axis title. The X field name is the default title.

- `--ylab YLAB` - Y axis title. The Y field name is the default title.

- `--title TITLE` - Plot title.

- `-o, --stdout` - Print plot content to stdout.

- `--no-csv-header` - Provided CSV or TSV datafile does not have a header.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To visualize the difference between uncommitted changes of a metrics file and
the last commit:

```dvc
$ dvc plots diff -d logs.csv
file:///Users/usr/src/plot/logs.csv.html
```

![](/img/plots_diff_workspace.svg)

The difference between two versions (commit hashes, tags, or branches can be
provided):

```dvc
$ dvc plots diff -d logs.csv HEAD 0135527
file:///Users/usr/src/plot/logs.csv.html
```

![](/img/plots_diff.svg)

## Example: Confusion matrix

We'll use tabular metrics file `classes.csv` for this example:

```csv
predicted,actual
cat,cat
cat,cat
cat,cat
dog,cat
dinosaur,cat
dinosaur,cat
bird,cat
dog,turtle
cat,turtle
...
```

A predefined confusion matrix
[template](/doc/command-reference/plots#plot-templates) (in
`.dvc/plots/confusion.json`) shows how metric differences can be faceted by
separate plots:

```dvc
$ dvc plots diff -t confusion -x predicted -d classes.csv
file:///Users/usr/src/test/plot_old/classes.csv.html
```

![](/img/plots_diff_confusion.svg)
