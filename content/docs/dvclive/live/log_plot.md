# Live.log_plot()

```py
def log_plot(
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
from dvclive import Live

datapoints = [
    {"name": "petal_width", "importance": 0.4},
    {"name": "petal_length", "importance": 0.33},
    {"name": "sepal_width", "importance": 0.24},
    {"name": "sepal_length", "importance": 0.03}
]

with Live() as live:
    live.log_plot(
        "iris_feature_importance",
        datapoints,
        x="importance",
        y="name",
        template="bar_horizontal",
        title="Iris Dataset: Feature Importance",
        y_label="Feature Name",
        x_label="Feature Importance"
    )
```

## Description

The method will dump the provided `datapoints` to
`{Live.dir}/plots/custom/{name}.json` and store the provided properties to be
included in the `plots` section written by `Live.make_dvcyaml()`.

The example snippet would produce the following `dvc.yaml`:

```yaml
plots:
  - dvclive/plots/custom/iris_feature_importance.json:
      template: bar_horizontal
      x: importance
      y: name
      title: 'Iris Dataset: Feature Importance'
      x_label: Feature Importance
      y_label: Feature Name
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
  to use. Defaults to `linear`.

- `title` - Title to be displayed. Defaults to
  `{Live.dir}/plots/custom/{name}.json`.

- `x_label` - Label for the `x` axis. Defaults to the name passed as `x`.

- `y_label` - Label for the `y` axis. Defaults to the name passed as `y`.

## Example: Plot from Pandas DataFrame

You can get the `datapoints` in the expected format from a
[Pandas](https://pandas.pydata.org/docs/index.html) DataFrame:

```py
import pandas as pd
from dvclive import Live
from sklearn.datasets import load_iris

iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)

datapoints = df.to_dict("records")

with Live() as live:
    live.log_plot(
        "sepal",
        datapoints,
        x="sepal length (cm)",
        y="sepal width (cm)",
        template="scatter",
        title="Sepal width vs Sepal length")
```

![dvc plots show](/img/dvclive-log_plot-dataframe.png)
