# plot diff

Show multiple versions of
[continuous metrics](/doc/command-reference/plot#continous-metrics) by plotting
them in a single image.

## Synopsis

```usage
usage: dvc plot diff [-h] [-q | -v] [-t [TEMPLATE]] [-d [DATAFILE]] [-f FILE]
                     [-s SELECT] [-x X] [-y Y] [--stdout] [--no-csv-header]
                     [--no-html] [--title TITLE] [--xlab XLAB] [--ylab YLAB]

positional arguments:
  revisions             Git revisions to plot from
```

## Description

This command visualize difference between continuous metrics among experiments
in the repository history. Requires that Git is being used to version the
metrics files.

The metrics file needs to be specified through `-d`/`--datafile` option. Also, a
plot can be customized by [Vega](https://vega.github.io/) templates through
option `--template`. To learn more about the file formats and templates please
see `dvc plot`.

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

- `-d [DATAFILE], --datafile [DATAFILE]` - Continuous metrics file to visualize.

- `-t [TEMPLATE], --template [TEMPLATE]` - File to be injected with data. The
  default temlpate is `.dvc/plot/default.json`. See more details in `dvc plot`.

- `-f FILE, --file FILE` - Name of the generated file. By default, the output
  file name is equal to the input filename with additional `.html` suffix or
  `.json` suffix for `--no-html` mode.

- `--no-html` - Do not wrap output vega plot json with HTML.

- `-s SELECT, --select SELECT` - Select which fileds or jsonpath to put into
  plot. All the fields will be included by default with DVC generated `index`
  field - see `dvc plot`.

- `-x X` - Field name for x axis. `index` is the default field for X.

- `-y Y` - Field name for y axis. The dafult field is the last field found in
  the input file: the last column in CSV file or the last field in the JSON
  array object (the first object).

- `--xlab XLAB` - X axis title. The X column name is the default title.

- `--ylab YLAB` - Y axis title. The Y column name is the default title.

- `--title TITLE` - Plot title.

- `-o, --stdout` - Print plot content to stdout.

- `--no-csv-header` - Provided CSV or TSV datafile does not have a header.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

The difference between a not commited version of the file and the last commited
one:

```dvc
$ dvc plot diff -d logs.csv
file:///Users/dmitry/src/plot/logs.csv.html
```

A new file `logs.csv.html` was generated. User can open it in a web browser.

![](/img/plot_diff_workspace.svg)

The difference between two specified commits (multiple commits, tag or branches
can be specified):

```dvc
$ dvc plot diff -d logs.csv HEAD 11c0bf1
file:///Users/dmitry/src/plot/logs.csv.html
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
$ dvc plot diff -d classes.csv -t confusion
file:///Users/dmitry/src/test/plot_old/classes.csv.html
```

![](/img/plot_diff_confusion.svg)
