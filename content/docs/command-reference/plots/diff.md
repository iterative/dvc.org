# plots diff

Show multiple versions of [plot metrics](/doc/command-reference/plots) by
plotting them in a single image.

## Synopsis

```usage
usage: dvc plots diff [-h] [-q | -v] [-t <path>]
                      [--targets [<path> [<path> ...]]] [-o <path>]
                      [-x <field>] [-y <field>] [--no-csv-header]
                      [--show-vega] [--title <text>]
                      [--x-label <text>] [--y-label <text>]
                      [revisions [revisions ...]]

positional arguments:
  revisions             Git commits to plot from/to
```

## Description

This command is a way to visualize the difference between metrics among
experiments in the <abbr>repository</abbr> history. Requires that the target
metric files are versioned with Git. These should specified with the `--targets`
(`-t`) option.

The required metric file `targets` should be <abbd>outputs</abbr> of one of the
[DVC pipeline](/doc/command-reference/pipeline) stages (see the `--plots` option
of `dvc run`), listed in a
[`dvc.yaml`](/doc/user-guide/dvc-files-and-directories) file.

`revisions` are Git commit hashes, tag, or branch names. If none are specified,
`dvc plots diff` compares targets currently present in the
<abbr>workspace</abbr> (uncommitted changes) with their latest committed
versions (required). A single specified revision results in plotting the
difference between the workspace and that version.

In contrast to commands such as `git diff`, `dvc metrics diff`, and
`dvc params diff`, **any number of revisions can be provided**, and the
resulting plot shows all of them in a single output.

The plot style can be customized with
[plot templates](/doc/command-reference/plots#plot-templates), using the
`--template` option. To learn more about metric file formats and templates
please see `dvc plots`.

## Options

- `--targets [TARGETS]` (**required**) - metrics file to visualize.

- `-t <path>, --template <path>` -
  [plot template](/doc/command-reference/plots#plot-templates) to be injected
  with data. The default template is `.dvc/plots/default.json`. See more details
  in `dvc plots`.

- `-o <path>, --out <path>` - name of the generated file. By default, the output
  file name is equal to the input filename with a `.html` file extension (or
  `.json` when using `--show-vega`).

- `-x <field>` - field name from which the X axis data comes from. An
  auto-generated `index` field is used by default. See
  [Custom templates](/doc/command-reference/plots#custom-templates) for more
  information on this `index` field.

- `-y <field>` - field name from which the Y axis data comes from. The last
  column or field found in the `targets` is used by default.

- `--x-label <text>` - X axis label. The X field name is the default.

- `--y-label <text>` - Y axis label. The Y field name is the default.

- `--title <text>` - plot title.

- `--show-vega` - produce a
  [Vega specification](https://vega.github.io/vega/docs/specification/) file
  instead of HTML. See `dvc plots` for more info.

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
$ dvc plots diff --targets logs.csv --x-label x
file:///Users/dmitry/src/plots/logs.html
```

![](/img/plots_auc.svg)

> Note that we renamed the X axis label with option `--x-label x`.

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

The predefined confusion matrix
[template](/doc/command-reference/plots#plot-templates) (in
`.dvc/plots/confusion.json`) shows how metric differences can be faceted by
separate plots. It can be enabled with `-t` (`--template`):

```dvc
$ dvc plots diff -t confusion --targets classes.csv -x predicted
file:///Users/usr/src/test/plot_old/classes.csv.html
```

![](/img/plots_diff_confusion.svg)
