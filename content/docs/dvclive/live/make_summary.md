# Live.make_summary()

Serializes a summary of the logged metrics (`Live.summary`) to
[`Live.metrics_file`](/dvclive/live#properties).

```py
def make_summary()
```

## Usage

```py
from dvclive import Live

live = Live()
live.summary["foo"] = 1.0
live.make_summary()
```

## Description

The `Live.summary` object will contain the latest value of each metric logged
with `Live.log_metric()`. It can be also modified manually, as in the snippet
above.

<admon type="info">

`Live.next_step()` and `Live.end()` will call `Live.make_summary()` internally,
so you don't need to call both.

</admon>

The summary is usable by `dvc metrics`:

```cli
$ dvc metrics diff dvclive/metrics.json
```
