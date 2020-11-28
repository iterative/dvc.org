# plots diff

Show multiple versions of [plot metrics](/doc/command-reference/plots) by
overlaying them in a single plot. This allows to compare them easily.

## Synopsis

```usage
usage: dvc plots diff [-h] [-q | -v] [--targets [<path> [<path> ...]]]
                      [-t <name_or_path>] [-x <field>] [-y <field>]
                      [--no-header] [--title <text>]
                      [--x-label <text>] [--y-label <text>] [-o <path>]
                      [--show-vega]
                      [revisions [revisions ...]]

positional arguments:
  revisions             Git commits to find metrics to compare
```

## Description

This command is a way to visualize the "difference" between
[certain metrics](/doc/command-reference/plots#supported-file-formats) among
versions of the <abbr>repository</abbr>, by overlaying them in a single plot.

> Note that unlike `dvc metrics diff`, this command does not calculate numeric
> differences between metrics file values.

`revisions` are Git commit hashes, tag, or branch names. If none are specified,
`dvc plots diff` compares plots currently present in the <abbr>workspace</abbr>
(uncommitted changes) with their latest commit (required). A single specified
revision results in comparing the workspace and that version.

💡 Note that any number of `revisions` can be provided (the resulting plot shows
all of them in a single image).

All plots defined in `dvc.yaml` are used by default, but specific plots files
can be specified with the `--targets` option (note that targets don't
necessarily have to be defined in `dvc.yaml`).

The plot style can be customized with
[plot templates](/doc/command-reference/plots#plot-templates), using the
`--template` option. To learn more about metrics file formats and templates
please see `dvc plots`.

> Note that the default behavior of this command can be modified per metrics
> file with `dvc plots modify`.

Another way to display plots is the `dvc plots show` command, which just lists
all the current plots, without comparisons.

## Options

- `--targets <path>` - specific metrics files to visualize. When specifying
  arguments for `--targets` before `revisions`, you should use `--` after this
  option's arguments, e.g.:

  ```dvc
  $ dvc plots diff --targets t1.json t2.csv -- HEAD v1 v2
  ```

  Alternatively, you can also run the above statement as:

  ```dvc
  $ dvc plots diff HEAD v1 v2 --targets t1.json t2.csv
  ```

- `-o <path>, --out <path>` - name of the generated file. By default, the output
  file name is equal to the input filename with a `.html` file extension (or
  `.json` when using `--show-vega`).

- `-t <name_or_path>, --template <name_or_path>` -
  [plot template](/doc/command-reference/plots#plot-templates) to be injected
  with data. The default template is `.dvc/plots/default.json`. See more details
  in `dvc plots`.

- `-x <field>` - field name from which the X axis data comes from. An
  auto-generated `index` field is used by default. See
  [Custom templates](/doc/command-reference/plots#custom-templates) for more
  information on this `index` field. Column names or numbers are expected for
  tabular metrics files.

- `-y <field>` - field name from which the Y axis data comes from. The last
  field found in the `--targets` is used by default. Column names or numbers are
  expected for tabular metrics files.

- `--x-label <text>` - X axis label. The X field name is the default.

- `--y-label <text>` - Y axis label. The Y field name is the default.

- `--title <text>` - plot title.

- `--show-vega` - produce a
  [Vega specification](https://vega.github.io/vega/docs/specification/) file
  instead of HTML. See `dvc plots` for more info.

- `--no-header` - lets DVC know that CSV or TSV `--targets` do not have a
  header. A 0-based numeric index can be used to identify each column instead of
  names.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To compare uncommitted changes of a metrics file and its last committed version:

```dvc
$ dvc plots diff --targets logs.csv --x-label x
file:///Users/usr/src/plots/logs.html
```

![](/img/plots_auc.svg)

> Note that we renamed the X axis label with option `--x-label x`.

Compare two specific versions (commit hashes, tags, or branches):

```dvc
$ dvc plots diff HEAD 0135527 --targets logs.csv
file:///Users/usr/src/plots/logs.csv.html
```

![](/img/plots_diff.svg)

## Example: Confusion matrix

We'll use tabular metrics file `classes.csv` for this example:

```
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
`.dvc/plots/confusion.json`) shows how metrics comparisons can be faceted by
separate plots. It can be enabled with `-t` (`--template`):

```dvc
$ dvc plots diff -t confusion --targets classes.csv -x predicted
file:///Users/usr/src/test/plot_old/classes.csv.html
```

![](/img/plots_diff_confusion.svg)
