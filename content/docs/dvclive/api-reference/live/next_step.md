# Live.next_step()

Signals that the current step has ended and increases step value by 1 (one).

```py
def next_step()
```

### Usage

```py
from dvclive import Live

live = Live()

for step in range(3):
    live.log("metric", 0.9)
    live.next_step()
```

## Description

DVCLive uses `step` to track the progress of the data logged with `Live.log()`
and/or `Live.log_image()`.

You can use `Live.next_step()` to increase the `step` by 1 (one).

Each metric logged in between `Live.next_step()` (or `Live.set_step()`) calls
will be associated to the updated `step` value.

<admon type="info">

Each `Live.next_step()` will call `Live.make_report()` internally by default
(unless `report` is passed to `Live()` with a value other than `"html"`).

</admon>

### DVC integration

When `dvclive` is used alongside `DVC`, each `Live.next_step()` call will have
additional effects.

When [checkpoints](/doc/user-guide/experiment-management/checkpoints) are
enabled in the <abbr>pipeline</abbr>, DVC will
[create a new checkpoint](/doc/dvclive/dvclive-with-dvc#checkpoints) on each
`Live.next_step()` call.
