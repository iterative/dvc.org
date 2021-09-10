# dvclive.set_step()

Updates the `step` value.

```py
def set_step(step: int):
```

#### Usage:

```py
import dvclive

for step in [0, 10, 20]:
    dvclive.set_step(step)
    dvclive.log("metric_1", 0.9)
    dvclive.log("metric_2", 0.7)
    dvclive.next_step()
```

## Description

DVCLive uses the `step` to track the progress of each metric logged with
`dvclive.log()`. You can alter the default `step` range (`[0, N]`) by using
`dvclive.set_step(X)`.

Each metric logged in between `dvclive.set_step(step)` calls will be associated
to the provided `step` value.
