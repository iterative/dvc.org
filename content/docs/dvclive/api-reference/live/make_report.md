# Live.make_report()

Generates an HTML Report from the logged data.

```py
def make_report()
```

#### Usage:

```py
from dvclive import Live

live = Live()
live.log_plot("confusion_matrix", [0, 0, 1, 1], [1, 0, 0, 1])
live.make_report()
```

## Description

On each call, DVCLive will collect all the data logged in `{dir}`, generate an
HTML report and save it in `{dir}/report.html`.

![](/img/dvclive-html.gif)

<admon type="info">

This function gets automatically called on each `step` update, unless
`report=None` was passed to `Live()`

</admon>
