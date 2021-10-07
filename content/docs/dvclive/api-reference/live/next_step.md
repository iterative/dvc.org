# Live.next_step()

Signals that the current step has ended and increases `step` value by 1 (one).

```py
def next_step()
```

#### Usage:

```py
from dvclive import Live

live = Live()

for step in range(3):
    live.log("metric", 0.9)
    live.next_step()
```

## Description

DVCLive uses the `step` value to track the progress of each metric logged with
`Live.log()`. You can use `Live.next_step()` to increase the `step` by 1 (one).

Each metric logged in between `Live.next_step()` (or `Live.set_step()`) calls
will be associated to the updated `step` value.

### DVC integration

When `dvclive` is used alongside `DVC`, each `Live.next_step()` call will have
additional effects.

By default, on each `Live.next_step()` call, `DVC` will prepare an
[HTML report](/doc/dvclive/dvclive-with-dvc#html-report) with all the _metrics
logs_ logged in `path`.

In addition, when
[checkpoints](/doc/user-guide/experiment-management/checkpoints) are enabled in
the <abbr>pipeline</abbr>, `DVC` will
[create a new checkpoint](/doc/dvclive/dvclive-with-dvc#checkpoints) on each
`Live.next_step()` call.
