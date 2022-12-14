# How it Works

DVCLive will store the logged data under the directory (`dir`) passed to
[`Live()`](/doc/dvclive/api-reference/live). If not provided, `dvclive` will be
used by default.

The contents of the directory will depend on the methods used:

| Method                                                                    | Writes to                  |
| ------------------------------------------------------------------------- | -------------------------- |
| [live.log_metric](/doc/dvclive/api-reference/live/log_metric)             | `dvclive/plots/metrics`    |
| [live.log_image](/doc/dvclive/api-reference/live/log_image)               | `dvclive/plots/images`     |
| [live.log_param](/doc/dvclive/api-reference/live/log_param)               | `dvclive/params.yaml`      |
| [live.log_sklearn_plot](/doc/dvclive/api-reference/live/log_sklearn_plot) | `dvclive/plots/sklearn`    |
| [live.make_report](/doc/dvclive/api-reference/live/make_report)           | `dvclive/report.{md/html}` |
| [live.make_summary](/doc/dvclive/api-reference/live/make_summary)         | `dvclive/metrics.json`     |
| [make_dvcyaml](/doc/dvclive/api-reference/live/end)                       | `dvclive/dvc.yaml`         |

<admon type="tip">

`live.next_step()` takes care of calling `live.make_report()`,
`live.make_summary`, and `make_dvcyaml` (if `save_dvc_exp=True`), in addition to
increasing the `step` number.

</admon>

## Example

To illustrate with an example, given the following script:

```python
import random

from dvclive import Live
from PIL import Image

EPOCHS = 2

with Live(save_dvc_exp=True) as live:
    live.log_param("epochs", EPOCHS)

    for i in range(EPOCHS):
        live.log_metric("metric", i + random.random())
        live.log_metric("nested/metric", i + random.random())
        live.log_image("img.png", Image.new("RGB", (50, 50), (i, i, i)))
        live.next_step()

    live.log_sklearn_plot("confusion_matrix", [0, 0, 1, 1], [0, 1, 0, 1])
    live.summary["additional_metric"] = 1.0
```

The resulting structure will be:

```
dvclive
├── metrics.json
├── params.yaml
├── plots
│   ├── images
│   │   └── img.png
│   ├── metrics
│   │   ├── metric.tsv
│   │   └── nested
│   │       └── metric.tsv
│   └── sklearn
│       └── confusion_matrix.json
└── report.html
```
