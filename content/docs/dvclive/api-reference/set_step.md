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
```

## Description

DVCLive uses the `step` to track the progress of each metric logged with
`dvclive.log()`. You can use `dvclive.set_step()` to increase the `step` count
by any number.

Each metric logged in between `dvclive.set_step()` calls will be associated to
the provided `step` value.

## Example

Given the [Usage](#usage) code snippet above, the
[metrics logs](/doc/dvclive/get-started#metrics-logs) generated for `metric_1`
would be:

```dvc
cat dvclive/metric_1.tsv
timestamp	step	metric_1
1614129197192	0	0.9
1614129198031   10	0.9
1614129198848	20	0.9
```
