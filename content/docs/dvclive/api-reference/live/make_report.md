# Live.make_report()

Generates a report from the logged data.

```py
def make_report()
```

## Usage

```py
from dvclive import Live

live = Live()
live.log_sklearn_plot("confusion_matrix", [0, 0, 1, 1], [1, 0, 0, 1])
live.make_report()
```

## Description

On each call, DVCLive will collect all the data logged in `{Live.dir}`, generate
a report and save it in `{Live.dir}/report.{format}`.

The `format` can be HTML or Markdown depending on the value of the `report`
argument passed to [`Live()`](/doc/dvclive/api-reference/live#parameters).

![](/img/dvclive-html.gif)
