# plot templates

Dump plot templates.

Sometimes users need to customize the way project data is visualized. This
command allows dumping templates used by DVC, so that the users don't have to
build their own templates from zero.

## Synopsis

```usage
usage: dvc plots templates [-h] [-q | -v] [-o <path>]
       [{simple,linear,confusion,confusion_normalized,scatter,smooth}]

positional arguments:
 TEMPLATE
                        Template to write. Writes all templates by default.
```

## Description

Users have the ability to change the way data-series plots are displayed by
modifying the [Vega-Lite specification](https://vega.github.io/vega-lite/), thus
generating plots in the style that best fits their needs. This keeps <abbr>DVC
projects</abbr> programming language agnostic, as it's independent from user
display configuration and visualization code.

To make creation of custom plots easier, DVC provides the `templates` command that
can dump one or all templates used by DVC.

`templates` command dumps the templates to `.dvc/plots` by default.

Note that templates can only be used with
[data-series plots](/doc/command-reference/plots#description).

### DVC template anchors

Plot templates are [Vega-Lite](https://vega.github.io/vega-lite/) JSON
specifications. They use predefined DVC anchors as placeholders for DVC to
inject the plot values.

- `<DVC_METRIC_DATA>` (**required**) - the plot data from any type of metrics
  files is converted to a single JSON array, and injected instead of this
  anchor. Two additional fields will be added: `step` and `rev` (explained
  above).

- `<DVC_METRIC_TITLE>` (optional) - a title for the plot, that can be defined
  with the `--title` option of the `dvc plots` subcommands.

- `<DVC_METRIC_X>` (optional) - field name of the data for the X axis. It can be
  defined with the `-x` option of the `dvc plots` subcommands. The auto-generated
  `step` field (explained above) is the default.

- `<DVC_METRIC_Y>` (optional) - field name of the data for the Y axis. It can be
  defined with the `-y` option of the `dvc plot` subcommands. It defaults to the
  last header of the metrics file: the last column for CSV/TSV, or the last
  field for JSON/YAML.

- `<DVC_METRIC_X_LABEL>` (optional) - field name to display as the X axis label

- `<DVC_METRIC_Y_LABEL>` (optional) - field name to display as the Y axis label

## Options

- `-o <path>`, `--out <path>` - Directory to save templates to.

## Example: Modifying simple template

We will modify the `simple` template to show bars instead of lines. Lets take
sample `data.csv` file:

```
x,y
0,0.1
1,0.4
2,0.9
3,1.6
```

And try to visualize it:

```dvc
$ dvc plots show data.csv -x x -y y --template simple
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_templates_show_unmodified.svg)

Let's dump the simple template and rename it:

```dvc
$ dvc plots templates simple -o .
Templates have been written into '.'.

$ mv simple.json custom_template.json
```

Now, lets modify the `custom_template.json` so that we will use bar plot instead
of linear:

```cli
$ cat custom_template.json
```

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "values": "<DVC_METRIC_DATA>"
  },
  "title": "<DVC_METRIC_TITLE>",
  "width": 300,
  "height": 300,
  "mark": {
    "type": "bar" // <<<  there used to be "line" here
  },
  "encoding": {
    "x": {
      "field": "<DVC_METRIC_X>",
      "type": "quantitative",
      "title": "<DVC_METRIC_X_LABEL>"
    },
    "y": {
      "field": "<DVC_METRIC_Y>",
      "type": "quantitative",
      "title": "<DVC_METRIC_Y_LABEL>",
      "scale": {
        "zero": false
      }
    },
    "color": {
      "field": "rev",
      "type": "nominal"
    }
  }
}
```

Create visualization with custom template:

```dvc
$ dvc plots show data.csv -x x -y y --template custom_template.json
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_templates_show_modified.svg)
