# Live.next_step()

Signals that the current iteration has ended and increases `step` value by 1
(one).

```py
def next_step()
```

## Usage

```py
from dvclive import Live

live = Live()

for step in range(3):
    live.log_metric("metric", 0.9)
    live.next_step()
```

## Description

DVCLive uses `step` to track the history of the metrics logged with
`Live.log_metric()`.

You can use `Live.next_step()` to increase the `step` by 1 (one).

In addition to increasing the `step` number, it will call `Live.make_report()`,
`Live.make_dvcyaml()`, and `Live.make_summary()` by default.

### Manual step updates

If you want custom `step` intervals or don't want to call `Live.make_summary()`
/ `Live.make_report()`, you can manually modify the `Live.step` property:

```py
from dvclive import Live

live = Live()

for custom_step in [0, 15, 20]:
    live.step = custom_step
    live.log_metric("metric_1", 0.9)
    live.log_metric("metric_2", 0.7)
    live.make_summary()
# Create report only at the end instead of at each iteration
live.make_report()
```
