# Live.next_step()

Signals that the current step has ended and increases `step` value by 1 (one).

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

Each metric logged in between `Live.next_step()` (or `Live.set_step()`) calls
will be associated with the updated `step` value.
