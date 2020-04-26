# plot diff

Show difference in
[continuous metrics](/doc/command-reference/plot#continous-metrics) by plotting
on a single [plot](/doc/command-reference/plot) different versions of metrics
from the <abbr>DVC repository</abbr> or workspace.

## Synopsis

```usage
usage: dvc plot diff [-h] [-q | -v] [-t [TEMPLATE]] [-d [DATAFILE]]
                     [-r RESULT] [--no-html] [-f FIELDS] [-o]
                     [--no-csv-header]
                     [revisions [revisions ...]]

positional arguments:
  revisions             Git revisions to plot from
```

## Description

This command visualize difference between continuous metrics among experiments
in the repository history. Requires that Git is being used to version the
metrics files.

The metrics file needs to be specified through `--datafile` option. Also, a plot
can be customized by [Vega](https://vega.github.io/) templates through option
`--template`. To learn more about the file formats and templates please see
`dvc plot`.

Run without any revision specified, this command compares metrics currently
presented in the workspace (uncommitted changes) with the latest committed
version. A single specified revision shows the difference between the revision
and the version in the workspace.

In contrast to many commands such as `git diff`, `dvc metrics diff` and
`dvc prams diff` the plot difference shows all the revisions in a single ouput
and does not limited by two versions. A user can specify as many revisions as
needed.

The files with metrics can be files commited in Git as well as data files under
DVC control. In the case of data files, the file revision is corresponded to Git
revision of [DVC-files](/doc/user-guide/dvc-file-format) that has this file as
an output.

## Options

- `-t [TEMPLATE], --template [TEMPLATE]` - File to be injected with data.

- `-d [DATAFILE], --datafile [DATAFILE]` - Data to be visualized.

- `-r RESULT, --result RESULT` - Name of the generated file.

- `--no-html` - Do not wrap vega plot json with HTML.

- `-f FIELDS, --fields FIELDS` - Choose which fileds or jsonpath to put into
  plot.

- `--no-csv-header` - Provided CSV or TSV datafile does not have a header.

- `-o, --stdout` - Print plot content to stdout.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

The difference between a not commited version of the file and the last commited
one:

```dvc
$ dvc plot diff -d logs.csv
file:///Users/dmitry/src/plot/logs.html
```

![](/img/plot_diff_workspace.svg)

The difference betweeb two specified commits:

```dvc
$ dvc plot diff -d logs.csv HEAD 11c0bf1
file:///Users/dmitry/src/plot/logs.html
```

![](/img/plot_diff.svg)

The predefined confusion matrix template shows how continuous metrics difference
can be faceted by separate plots:

```csv
actual,predicted
cat,cat
cat,cat
cat,cat
cat,dog
cat,dinosaur
cat,dinosaur
cat,bird
turtle,dog
turtle,cat
...
```

```dvc
$ dvc plot diff -d classes.csv -t confusion_matrix
file:///Users/dmitry/src/test/plot_old/classes.html
```

![](/img/plot_diff_confusion.svg)
