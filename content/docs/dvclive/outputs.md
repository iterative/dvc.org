# Output Folder Structure

DVCLive will store the logged data under the folder (`path`) passed to
[`Live()`](/doc/dvclive/api-reference/live). If not provided, `dvclive` will be
used by default.

The resulting structure of the folder depends on the methods used for logging
data:

| Method                                                          | Writes to                          |
| --------------------------------------------------------------- | ---------------------------------- |
| [live.log](/doc/dvclive/api-reference/live/log)                 | `dvclive/scalars` & `dvclive.json` |
| [live.log_image](/doc/dvclive/api-reference/live/log_image)     | `dvclive/images`                   |
| [live.log_param](/doc/dvclive/api-reference/live/log_param)     | `dvclive/params.yaml`              |
| [live.log_plot](/doc/dvclive/api-reference/live/log_plot)       | `dvclive/plots`                    |
| [live.make_report](/doc/dvclive/api-reference/live/make_report) | `dvclive/report.{md/html}`         |

## Example

To illustrate with an example, given the following script:

```python
import random

from dvclive import Live
from PIL import Image
from PIL import ImageDraw

live = Live()

live.log_param("param", random.random())

for i in range(2):
    live.log("metric", i + random.random())
    live.log("nested/metric", i + random.random())

    img = Image.new("RGB", (50, 50), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), f"{i  + random.random():.1f}", (0,0,0))
    live.log_image("img.png", img)

    live.next_step()  # calls live.make_report()

live.set_step(None)
live.log_plot("confusion_matrix", [0, 0, 1, 1], [0, 1, 0, 1])
```

The resulting structure will be:

```
dvclive.json
dvclive
├── params.yaml
├── plots
│   └── confusion_matrix.json
├── images
│   ├── 0
│   │   └── img.png
│   └── 1
│       └── img.png
├── scalars
│       ├── nested
│       │   └── metric.tsv
│       └── metric.tsv
└── report.html
```

## Report

If and when `step` is updated, DVCLive generates or updates a report in
`dvclive/report.{format}` which will contain the logged data.

![](/img/dvclive-html.gif)

The `format` can be HTML or Markdown depending on the value of the `report`
argument passed to [`Live()`](/doc/dvclive/api-reference/live#parameters).

<admon type="info">

Reports are generated if you update the step number or call `Live.make_report()`
directly.

</admon>
