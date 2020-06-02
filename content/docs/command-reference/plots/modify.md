# plots modify

Modify [plot metrics](/doc/command-reference/plots) by specifying and saving
plotting options.

## Synopsis

```usage
usage: dvc plots modify [-h] [-q | -v] [-t [TEMPLATE]] [-x X] [-y Y]
                        [--no-csv-header] [--title TITLE] [--xlab XLAB]
                        [--ylab YLAB] [--unset [UNSET [UNSET ...]]]

positional arguments:
  target                Plot file to set props to.
```

## Description

It might be not convinient for users as well as automation systems to specify
all the visualization parameters (such as `y-axis`, `template`, `title` and
others) each time when plots are generated. The `dvc plots modify` command sets
(and unsets) default visualization options for plot files. The options affect
all the visualization commands: `dvc plots show` and `dvc plots diff`.

Target plot file needs to be a plot output (see `dvc run`) of one of the DVC
pipeline stages and it needs to be stored in `dvc.yaml file`. The plot
modification command adds the options to `dvc.yaml file`.

## Options

- `-t [TEMPLATE], --template [TEMPLATE]` - set a
  [plot template](/doc/command-reference/plots#plot-templates).

- `-x X` - set name of the X axis of the plot from the plot file.

- `-y Y` - set name of the Y axis of the plot from the plot file.

- `--no-csv-header` - lets DVC know that CSV or TSV `targets` do not have a
  header.

- `--title TITLE` - plot title for visualization.

- `--xlab XLAB` - title of X axis.

- `--ylab YLAB` - title of Y axis.

- `--unset [UNSET [UNSET ...]]` - unset an option or option list.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

The initial plot was showing the last column of CSV file by default which is
_loss_ metrics while _accuracy_ is expected as Y axis:

```CSV
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

Changing the plot _title_ and _y title_:

```dvc
$ dvc plots modify --title Accuracy --xlab epoch logs.csv
$ dvc plots show logs.csv
file:///Users/dmitry/src/myclassifier/logs.html
```

![](/img/plots_mod_acc_titles.svg)

Two new fields were added to `dvc.yaml` - _xlab_ and _title_:

```yaml
plots:
  - plots.csv:
      cache: false
      y: accuracy
      xlab: epoch
      title: Accuracy
```

## Example: Template change

_dvc run --plots file.csv ..._ command assigne the default template that needs
to be changed in many cases. A simple command changes the template:

```dvc
$ dvc plots modify --template confusion classes.csv
```
