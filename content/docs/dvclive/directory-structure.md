# Directory structure

DVCLive will store the logged data under the directory (`dir`) passed to
[`Live()`](/doc/dvclive/live). If not provided, `dvclive` will be used by
default.

The contents of the directory will depend on the methods used:

| Method                                                  | Writes to                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`Live.log_artifact()`](/doc/dvclive/live/log_artifact) | `{path}.dvc`<br>_or_<br>`dvclive/artifacts/{path}`<br>`dvclive/artifacts/{path}.dvc` |
| `Live.log_metric()`                                     | `dvclive/plots/metrics`                                                              |
| `Live.log_image()`                                      | `dvclive/plots/images`                                                               |
| `Live.log_param()`                                      | `dvclive/params.yaml`                                                                |
| `Live.log_plot()`                                       | `dvclive/plots/custom`                                                               |
| `Live.log_sklearn_plot()`                               | `dvclive/plots/sklearn`                                                              |
| `Live.make_dvcyaml()`                                   | `dvclive/dvc.yaml`                                                                   |
| `Live.make_report()`                                    | `dvclive/report.{md/html}`                                                           |
| `Live.make_summary()`                                   | `dvclive/metrics.json`                                                               |
| `Live.next_step()`                                      | `dvclive/dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}`           |
| `Live.end()`                                            | `dvclive/dvc.yaml`<br>`dvclive/metrics.json`<br>`dvclive/report.{md/html}`           |

## Example

To illustrate with an example, given the following code:

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
        Path("model.pt").write_text(str(random.random()))
        live.next_step()

    live.log_artifact("model.pt", type="model", name="mymodel")
    live.log_sklearn_plot("confusion_matrix", [0, 0, 1, 1], [0, 1, 0, 1])
    live.log_metric("summary_metric", 1.0, plot=False)
# live.end() has been called at this point
```

The resulting structure will be:

```
dvclive
├── dvc.yaml
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
model.pt
model.pt.dvc
```
