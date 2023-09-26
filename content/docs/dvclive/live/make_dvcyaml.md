# Live.make_dvcyaml()

Writes [DVC configuration](/doc/user-guide/project-structure/dvcyaml-files) for
metrics, plots, and parameters to
[`Live.dvc_file`](/doc/dvclive/live#properties).

```py
def make_dvcyaml()
```

## Usage

```py
from dvclive import Live

live = Live()
live.log_param("lr", 0.01)
live.log_metric("acc", 0.9)
live.log_sklearn_plot("confusion_matrix", [0, 0, 1, 1], [1, 0, 0, 1])
live.make_dvcyaml()
```

## Description

Creates `dvc.yaml`, which describes and configures metrics, plots, and
parameters. DVC tools use this file to show reports and experiments tables.

<admon type="info">

If `Live(dvcyaml=True)`, `Live.next_step()` and `Live.end()` will call
`Live.make_dvcyaml()` internally, so you don't need to call both.

</admon>

```yaml
params:
  - dvclive/params.yaml
metrics:
  - dvclive/metrics.json
plots:
  - dvclive/plots/metrics
  - dvclive/plots/sklearn/confusion_matrix.json:
      template: confusion
      x: actual
      y: predicted
      title: Confusion Matrix
      x_label: True Label
      y_label: Predicted Label
```
