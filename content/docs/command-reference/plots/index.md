# plots

A set of commands to visualize and compare <abbr>plot metrics</abbr> in
structured files (JSON, YAML, CSV, or TSV):
[show](/doc/command-reference/plots/show),
[diff](/doc/command-reference/plots/diff), and
[modify](/doc/command-reference/plots/modify).

## Synopsis

```usage
usage: dvc plots [-h] [-q | -v] {show,diff,modify} ...

positional arguments:
  COMMAND
    show         Generate plot from a metrics file.
    diff         Plot differences in metrics between commits.
    modify       Modify plot properties associated with a target file.
```

## Description

...

### Supported file formats

DVC generates plots as HTML files that can be open with a web browser. These
HTML files use [Vega-Lite](https://vega.github.io/vega-lite/). Vega is a
declarative grammar for defining plots using JSON. The plots can also be saved
as SVG or PNG image filed from the browser.

Plot metrics can be organized as data series in JSON, YAML 1.2, CSV, or TSV
files. DVC expects to see an array (or multiple arrays) of objects (usually
_float numbers_) in the file.

In tabular file formats such as CSV and TSV, each column is an array.
`dvc plots` subcommands can produce plots for a specified column or a set of
them. For example, `epoch`, `AUC`, and `loss` are the column names below:

```
epoch, AUC, loss
34, 0.91935, 0.0317345
35, 0.91913, 0.0317829
36, 0.92256, 0.0304632
37, 0.92302, 0.0299015
```

In hierarchical file formats (JSON or YAML), an array of consistent objects is
expected: every object should have the same structure.

`dvc plots` subcommands can produce plots for a specified field or a set of
them, from the array's objects. For example, `val_loss` is one of the field
names in the `train` array below:

```
{
  "train": [
    {"val_accuracy": 0.9665, "val_loss": 0.10757},
    {"val_accuracy": 0.9764, "val_loss": 0.07324},
    {"val_accuracy": 0.8770, "val_loss": 0.08136},
    {"val_accuracy": 0.8740, "val_loss": 0.09026},
    {"val_accuracy": 0.8795, "val_loss": 0.07640},
    {"val_accuracy": 0.8803, "val_loss": 0.07608},
    {"val_accuracy": 0.8987, "val_loss": 0.08455}
  ]
}
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Plot templates

Users have the ability to change the way plots are displayed by modifying the
[Vega specification](https://vega.github.io/vega/docs/specification/), thus
generating plots in the style that best fits the their needs. This keeps
<abbr>DVC projects</abbr> programming language agnostic, as it's independent
from user display configuration and visualization code.

Built-in _plot templates_ are stored in the `.dvc/plots/` directory. The default
one is called `default.json`. It can be changed with the `--template` (`-t`)
option of `dvc plots show` and `dvc plots diff`. For templates in the
`.dvc/plots/` directory, the path and the json extension are not required: you
can specify only the base name e.g. `--template scatter`.

DVC has the following built-in plot templates:

- `default` - linear plot
- `scatter` - scatter plot
- `smooth` - linear plot with LOESS smoothing, see
  [example](/doc/command-reference/plots#example-smooth-plot)
- `confusion` - confusion matrix, see
  [example](/doc/command-reference/plots#example-confusion-matrix)

### Custom templates

Plot template files are
[Vega specification](https://vega.github.io/vega/docs/specification/) files that
use predefined DVC anchors as placeholders for DVC to inject the plot values.
You can create a custom template from scratch, or modify an existing one from
`.dvc/plots/`.

💡 Note that custom templates can be safely added to the template directory.

All metrics files given to `dvc plots show` and `dvc plots diff` as input are
combined together into a single data array for injection into a template file.
There are two important fields that DVC adds to the plot data:

- `index` - self-incrementing, zero-based counter for the data rows/values. In
  many cases it corresponds to a machine learning training epoch or step number.

- `rev` - Git commit hash, tag, or branch of the metrics file. This helps
  distinguish between different versions when using the `dvc plots diff`
  command.

Note that in the case of CSV/TSV metrics files, column names from the table
header (first row) are equivalent to field names.

### DVC template anchors

- `<DVC_METRIC_DATA>` (**required**) - the plot data from any kind of metrics
  files is converted to a single JSON array internally, and injected instead of
  this anchor. Two additional fields will be added: `index` and `rev` (explained
  above).

- `<DVC_METRIC_TITLE>` (optional) - a title for the plot, that can be defined
  with the `--title` option of the `dvc plot` subcommands.

- `<DVC_METRIC_X>` (optional) - field name of the data for the X axis. It can be
  defined with the `-x` option of the `dvc plot` subcommands. The auto-generated
  `index` field (explained above) is the default.

- `<DVC_METRIC_Y>` (optional) - field name of the data for the Y axis. It can be
  defined with the `-y` option of the `dvc plot` subcommands. The default is the
  last one found in the metrics file: the last column for CSV/TSV, or the last
  field for JSON/YAML.

- `<DVC_METRIC_X_TITLE>` (optional) - field name to display as the X axis label

- `<DVC_METRIC_Y_TITLE>` (optional) - field name to display as the X axis label
