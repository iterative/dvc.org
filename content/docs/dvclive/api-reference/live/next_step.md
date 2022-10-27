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
    live.log("metric", 0.9)
    live.next_step()
```

## Description

DVCLive uses `step` to track the progress of the data logged with
`Live.log_metric()` and/or `Live.log_image()`.

You can use `Live.next_step()` to increase the `step` by 1 (one).

Each metric logged in between `Live.next_step()` (or `Live.set_step()`) calls
will be associated to the updated `step` value.
