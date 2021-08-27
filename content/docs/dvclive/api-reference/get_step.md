# dvclive.get_step()

Returns the current `step` value.

```py
def get_step()
```

#### Usage:

```py
import dvclive

while dvclive.get_step() < 3:
    dvclive.log("metric", 0.9)
    dvclive.next_step()
```

## Description

DVCLive uses a internal property called `step` that it's associated to each
metric logged with [`dvclive.log()`].

Each call to [`dvclive.next_step()`] increases the `step` count.

[`dvclive.log()`]: /doc/dvclive/api-reference/log
[`dvclive.next_step()`]: /doc/dvclive/api-reference/next_step
