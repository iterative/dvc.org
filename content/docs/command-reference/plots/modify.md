# plots modify

Modify display properties of data-series [plots](/doc/command-reference/plots)
defined in <abbr>stages</abbr>.

> ⚠️ Note that this command can modify only data-series plots. It has no effect
> on image-type plots or any [top-level plot] definitions.

[top-level plot]: /doc/command-reference/plots#top-level-plots

## Synopsis

```usage
usage: dvc plots modify [-h] [-q | -v] [-t <name_or_path>] [-x <field>]
                        [-y <field>] [--no-header] [--title <text>]
                        [--x-label <text>] [--y-label <text>]
                        [--unset [<property> [<property> ...]]]
                        target

positional arguments:
  target                Plots file to set properties for
                        (defined at the stage level)
```

## Description

It might be not convenient for users or automation systems to specify all the
_display properties_ (such as `y-label`, `template`, `title`, etc.) each time
plots are generated with `dvc plots show` or `dvc plots diff`. This command sets
(or unsets) default display properties for a specific plots file.

The path to the plots file `target` is required. It must be listed in a
`dvc.yaml` file (see the `--plots` option of `dvc stage add`).
`dvc plots modify` adds the display properties to `dvc.yaml`.

Property names are passed as [options](#options) to this command (prefixed with
`--`). These are based on the [Vega-Lite](https://vega.github.io/vega-lite/)
specification.

Note that a secondary use of this command is to convert output or simple
`dvc metrics` file into a plots file (see an
[example](#example-convert-any-output-into-a-plot)).

## Options

- `-t <name_or_path>, --template <name_or_path>` - set a default
  [plot template](/doc/command-reference/plots#plot-templates).

- `-x <field>` - set a default field or column name (or number) from which the X
  axis data comes from.

- `-y <field>` - set a default field or column name (or number) from which the Y
  axis data comes from.

- `--x-label <text>` - set a default title for the X axis.

- `--y-label <text>` - set a default title for the Y axis.

- `--title <text>` - set a default plot title.

- `--unset [<property> [<property> ...]]` - unset one or more display
  properties. Use the property name(s) without `--` in the argument sent to this
  option.

- `--no-header` - lets DVC know that the `target` CSV or TSV does not have a
  header. A 0-based numeric index can be used to identify each column instead of
  names.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

The initial plot was showing the last column of CSV file by default which is
_loss_ metrics while _accuracy_ is expected as Y axis:

```
epoch,accuracy,loss
0,0.9403833150863647,0.2019129991531372
1,0.9733833074569702,0.08973673731088638
2,0.9815833568572998,0.06529958546161652
3,0.9861999750137329,0.04984375461935997
4,0.9882333278656006,0.041892342269420624
```

```cli
$ dvc plots show logs.csv
file:///Users/usr/src/myclassifier/logs.html
```

![](/img/plots_mod_loss.svg)

Changing the y-axis to _accuracy_:

```cli
$ dvc plots modify logs.csv -y accuracy
$ dvc plots show logs.csv
file:///Users/usr/src/myclassifier/logs.html
```

![](/img/plots_mod_acc.svg)

Note, a new field _y_ was added to `dvc.yaml` file for the plot. Please do not
forget to commit the change in Git if the modification needs to be preserved.

```yaml
plots:
  - logs.csv:
      cache: false
      y: accuracy
```

Changing the plot `title` and `x-label`:

```cli
$ dvc plots modify logs.csv --title Accuracy -x epoch --x-label Epoch
$ dvc plots show logs.csv
file:///Users/usr/src/myclassifier/logs.html
```

![](/img/plots_mod_acc_titles.svg)

Two new fields were added to `dvc.yaml`: `x-label` and `title`:

```yaml
plots:
  - plots.csv:
      cache: false
      y: accuracy
      x_label: epoch
      title: Accuracy
```

## Example: Template change

Something like `dvc stage add --plots file.csv ...` assigns the default
template, which needs to be changed in many cases. This command can do so:

```cli
$ dvc plots modify classes.csv --template confusion
```

## Example: Convert any output into a plot

Let's take an example `evaluate` stage which has `logs.csv` as an output. We can
use `dvc plots modify` to convert the `logs.csv` output file into a plots file,
and then confirm the changes that happened in `dvc.yaml`:

```cli
$ dvc plots modify logs.csv
```

```git
 evaluate:
   cmd: python src/evaluate.py
     deps:
     - src/evaluate.py
-    outs:
-    - logs.csv
     plots:
     - scores.json
+    - logs.csv
```
