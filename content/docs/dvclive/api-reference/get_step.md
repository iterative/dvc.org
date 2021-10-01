# dvclive.get_step()

Returns the current `step` value.

```py
def get_step() -> int:
```

#### Usage:

```py
from dvclive import DVCLive

dvclive = DVCLive()

while dvclive.get_step() < 3:
    dvclive.log("metric", 0.9)
    dvclive.next_step()
```

## Description

DVCLive uses the `step` to track the progress of each metric logged with
`dvclive.log()`.

Each call to `dvclive.next_step()` increases the `step` count.
