# Live.get_step()

Returns the current `step` value.

```py
def get_step() -> int:
```

## Usage

```py
from dvclive import Live

live = Live()

while live.get_step() < 3:
    live.log_metric("metric", 0.9)
    live.next_step()
```

## Description

DVCLive uses `step` to track the history of the metrics logged with
`Live.log_metric()`.

The current `step` value can be retrieved with `Live.get_step()`.

To update the `step` value, you can use `Live.next_step()` or `Live.set_step()`.
