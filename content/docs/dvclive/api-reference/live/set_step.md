# dvclive.set_step()

Signals that the current step has ended and sets `step` to the given value.

```py
def set_step(step: int):
```

## Usage

```py
from dvclive import Live

live = Live()

for step in [0, 10, 20]:
    live.set_step(step)
    live.log_metric("metric_1", 0.9)
    live.log_metric("metric_2", 0.7)
```

## Description

DVCLive uses `step` to track the progress of the data logged with
`Live.log_metric()` and/or `Live.log_image()`.

You can use `Live.set_step()` to set `step` to any value.

Each metric logged in between `Live.set_step()` (or `Live.next_step()`) calls
will be associated to the provided `step` value.

## Example

Given the [Usage](#usage) code snippet above, the
[metrics history](/doc/dvclive/api-reference/live/log_metric#description)
generated for `metric_1` would be:

```dvc
$ cat dvclive/metric_1.tsv
timestamp	step	metric_1
1614129197192	0	0.9
1614129198031   10	0.9
1614129198848	20	0.9
```
