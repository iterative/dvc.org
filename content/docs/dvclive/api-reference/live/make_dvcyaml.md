# Live.make_dvcyaml()

Writes [DVC configuration](/doc/user-guide/project-structure/dvcyaml-files) for
metrics, plots, and parameters to
[`Live.dvc_file`](/doc/dvclive/api-reference/live#properties).

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

If `Live(dvcyaml=True)`, DVCLive will collect all the data logged in
`{Live.dir}` and save the DVC configuration for it in `{Live.dir}/dvc.yaml`.

```yaml
params:
  - params.yaml
metrics:
  - metrics.json
plots:
  - plots/metrics
  - plots/sklearn/confusion_matrix.json:
      template: confusion
      x: actual
      y: predicted
      title: Confusion Matrix
      x_label: True Label
      y_label: Predicted Label
```
