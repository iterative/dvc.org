# dvclive.set_step()

Signals that the current step has ended and updates `step` with the given value.

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

DVCLive uses the `step` value to track the progress of each metric logged with
`dvclive.log()`. You can use `dvclive.set_step()` to set `step` to any value.

Each metric logged in between `dvclive.set_step()` calls will be associated to
the provided `step` value.

### DVC integration

When `dvclive` is used alongside `DVC`, each `dvclive.set_step()` call will have
additional effects.

By default, on each `dvclive.set_step()` call, `DVC` will prepare an
[HTML report](/doc/dvclive/user-guide/dvclive-with-dvc#html-report) with all the
_metrics logs_ logged in `path`.

When [checkpoints](/doc/user-guide/experiment-management/checkpoints) are
enabled in the <abbr>pipeline</abbr>, `DVC` will
[create a new checkpoint](/doc/dvclive/user-guide/dvclive-with-dvc#checkpoints)
on each `dvclive.set_step()` call.

## Example

Given the [Usage](#usage) code snippet above, the
[metrics logs](/doc/dvclive/get-started#metrics-logs) generated for `metric_1`
would be:

```dvc
$ cat dvclive/metric_1.tsv
timestamp	step	metric_1
1614129197192	0	0.9
1614129198031   10	0.9
1614129198848	20	0.9
```
