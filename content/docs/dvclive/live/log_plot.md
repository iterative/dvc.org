# Live.log_plot()

```py
def log_plot(
    self,
    name: str,
    datapoints: List[Dict],
    x: str,
    y: str,
    template: Optional[str] = None,
    title: Optional[str] = None,
    x_label: Optional[str] = None,
    y_label: Optional[str] = None,
):
```

## Usage

```py
datapoints = [{"foo": 1, "bar": 2}, {"foo": 3, "bar": 4}]

with Live() as live:
    live.log_plot(
        "foo_default", datapoints, x="foo", y="bar", title="Default Linear Plot")

    live.log_plot(
        "foo_scatter",
        datapoints,
        x="foo",
        y="bar",
        template="scatter",
        title="Plot using Scatter template",
        y_label="CUSTOM LABEL: BAR",
        x_label="CUSTOM LABEL: FOO"
    )
```

## Description

The method will dump the provided `datapoints` to
`{Live.dir}/plots/custom/{name}.json` and store the provided properties to be
included in the `plots` section written by `Live.make_dvcyaml()`.

The example snippet would produce the following `dvc.yaml` in
`{Live.dir}/{Live.dvc_file}`:

```yaml
plots:
  - plots/custom/foo_default.json:
      x: foo
      y: bar
      title: Default Linear Plot
  - plots/custom/foo_scatter.json:
      template: scatter
      x: foo
      y: bar
      title: Plot using Scatter template
      x_label: 'CUSTOM LABEL: FOO'
      y_label: 'CUSTOM LABEL: BAR'
```

Which can be rendered by `dvc plots`:

![dvc plots show](/img/dvclive-log_plot.png)

## Parameters

- `name` - Name of the output file.

- `datapoints` - List of dictionaries containing the data for the plot.

- `x` - Name of the key (present in the dictionaries) to use as the `x` axis.

- `y` - Name of the key (present in the dictionaries) to use the `y` axis.

- `template` - Name of the
  [DVC plots template](/doc/user-guide/experiment-management/visualizing-plots#plot-templates-data-series-only)
  to use.

- `tile` - Title to be displayed.

- `x_label` - Label for the `x` axis.

- `y_label` - Label for the `y` axis.
