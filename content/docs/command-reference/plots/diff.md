# plots diff

Show multiple versions of [plot metrics](/doc/command-reference/plots) by
plotting them in a single image.

## Synopsis

```usage
usage: dvc plots diff [-h] [-q | -v] [-t <path>]
                      [--targets [<path> [<path> ...]]] [-o <path>]
                      [-x <field>] [-y <field>] [--no-csv-header]
                      [--show-json] [--title <text>] [--xlab <text>]
                      [--ylab <text>] [revisions [revisions ...]]

positional arguments:
  revisions             Git commits to plot from/to
```

## Description

This command visualize difference between metrics among experiments in the
repository history. Requires that Git is being used to version the metrics
files.

The metrics file needs to be specified through `--targets` option. Also, a plot
can be customized with
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
the case of DVC-tracked `targets`, the `revisions` are used to find the
corresponding [DVC-files](/doc/user-guide/dvc-file-format).

## Options

- `--targets [TARGETS]` (**required**) - metrics file to visualize.

- `-t <path>, --template <path>` -
  [plot template](/doc/command-reference/plots#plot-templates) to be injected
  with data. The default template is `.dvc/plots/default.json`. See more details
  in `dvc plots`.

- `-o <path>, --out <path>` - name of the generated file. By default, the output
  file name is equal to the input filename with additional `.html` suffix or
  `.json` suffix for `--show-json` mode.

- `-x <field>` - field name for X axis. An auto-generated `index` field is used
  by default.

- `-y <field>` - field name for Y axis. The last column or field found in the
  `targets` is used by default.

- `--xlab <text>` - X axis title. The X field name is the default title.

- `--ylab <text>` - Y axis title. The Y field name is the default title.

- `--title <text>` - plot title.

- `--show-json` - show output in JSON format.

- `--no-csv-header` - lets DVC know that CSV or TSV `targets` do not have a
  header.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To visualize the difference between uncommitted changes of a metrics file and
the last commit:

```dvc
$ dvc plots diff --targets logs.csv
file:///Users/dmitry/src/plots/logs.html
```

![](/img/plots_auc.svg)

The difference between two versions (commit hashes, tags, or branches can be
provided):

```dvc
$ dvc plots diff --targets logs.csv HEAD 0135527
file:///Users/usr/src/plots/logs.csv.html
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
$ dvc plots diff -t confusion -x predicted --targets classes.csv
file:///Users/usr/src/test/plot_old/classes.csv.html
```

![](/img/plots_diff_confusion.svg)
