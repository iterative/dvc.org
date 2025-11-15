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

<admon type="info">

`Live.next_step()` and `Live.end()` will call `Live.make_report()` internally,
so you don't need to call both.

</admon>

On each call, DVCLive will collect all the data logged in `{Live.dir}`, generate
a report and save it in `{Live.dir}/report.{format}`.

The `format` can be HTML or Markdown depending on the value of the
[`report`](/dvclivelive#parameters) argument passed to `Live()`.

<toggle>

<tab title="report='html'">

![HTML report](/img/dvclive-html.gif)

</tab>

<tab title="report='md'">

![MarkDown report](/img/dvclive-cml.gif)

</tab>

<tab title="report='notebook'">

![Notebook report](/img/dvclive-notebook.gif)

</tab>

</toggle>
