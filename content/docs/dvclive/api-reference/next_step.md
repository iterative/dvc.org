# dvclive.next_step()

Signals that the current step has ended and increases `step` value by 1 (one).

```py
def next_step()
```

#### Usage:

```py
from dvclive import DVCLive

dvclive = DVCLive()

for step in range(3):
    dvclive.log("metric", 0.9)
    dvclive.next_step()
```

## Description

Each call to `dvclive.next_step()` will behave depending on whether `DVC` is
available or not.

### DVC integration

When `dvclive` is used alongside `DVC`, each `dvclive.next_step()` call will
have additional effects.

By default, on each `dvclive.next_step()` call, `DVC` will prepare an
[HTML report](/doc/dvclive/user-guide/dvclive-with-dvc#html-report) with all the
_metrics logs_ logged in `path`.

When [checkpoints](/doc/user-guide/experiment-management/checkpoints) are
enabled in the <abbr>pipeline</abbr>, `DVC` will
[create a new checkpoint](/doc/dvclive/user-guide/dvclive-with-dvc#checkpoints)
on each `dvclive.next_step()` call.
