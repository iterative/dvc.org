# plots modify

Modify display properties of [plot metrics](/doc/command-reference/plots) files.

## Synopsis

```usage
usage: dvc plots modify [-h] [-q | -v] [-t <path>] [-x X] [-y Y]
                        [--no-csv-header] [--title <text>] [--x-label <text>]
                        [--y-label <text>] [--unset [<prop> [<prop> ...]]]
                        target

positional arguments:
  target                Metric file to set props to
```

## Description

It might be not convenient for users or automation systems to specify all the
_display properties_ (such as `y-label`, `template`, `title`, etc.) each time
plots are generated with `dvc plot show` or `dvc plot diff`. This command sets
(or unsets) default display props for specific plot files.

The available display properties are expressed as the [options](#options) of
this command (prefixed with `--`).

> Display props are based on the
> [Vega specification](https://vega.github.io/vega/docs/specification/)

The `target` metrics file should be an <abbd>output</abbr> of one of the
[DVC pipeline](/doc/command-reference/pipeline) stages (see the `--plots` option
of `dvc run`), listed in a
[`dvc.yaml`](/doc/user-guide/dvc-files-and-directories) file. `dvc plots modify`
adds the options to `dvc.yaml`.

## Options

- `-t <path>, --template <path>` - set a default
  [plot template](/doc/command-reference/plots#plot-templates).

- `-x <field>` - set a default field name from which the X axis data comes from.

- `-y <field>` - set a default field name from which the Y axis data comes from.

- `--x-label <text>` - set a default title for the X axis.

- `--y-label <text>` - set a default title for the Y axis.

- `--title <text>` - set a default plot title.

- `--unset [<prop> [<prop> ...]]` - unset one or more display properties. Use
  the prop name(s) without `--` in the argument sent to this option.

- `--no-csv-header` - lets DVC know that CSV or TSV `targets` do not have a
  header.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

The initial plot was showing the last column of CSV file by default which is
_loss_ metrics while _accuracy_ is expected as Y axis:

```csv
epoch,accuracy,loss
0,0.9403833150863647,0.2019129991531372
1,0.9733833074569702,0.08973673731088638
2,0.9815833568572998,0.06529958546161652
3,0.9861999750137329,0.04984375461935997
4,0.9882333278656006,0.041892342269420624
```

```dvc
$ dvc plots show logs.csv
file:///Users/dmitry/src/myclassifier/logs.html
```

![](/img/plots_mod_loss.svg)

Changing the y-axis to _accuracy_:

```dvc
$ dvc plots modify -y accuracy logs.csv
$ dvc plots show logs.csv
file:///Users/dmitry/src/myclassifier/logs.html
```

![](/img/plots_mod_acc.svg)

Note, a new field _y_ was added to `dvc.yaml` file for the plot. Please do not
forget to commit the change in Git if the modification needs to be preserved.

```yaml
- logs.csv:
    cache: false
    y: accuracy
```

Changing the plot `title` and `x-label`:

```dvc
$ dvc plots modify --title Accuracy --x-label epoch logs.csv
$ dvc plots show logs.csv
file:///Users/dmitry/src/myclassifier/logs.html
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

_dvc run --plots file.csv ..._ command assign the default template that needs to
be changed in many cases. A simple command changes the template:

```dvc
$ dvc plots modify --template confusion classes.csv
```
