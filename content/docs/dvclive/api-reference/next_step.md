# dvclive.next_step()

Signals that the current step has ended. Check the
[init parameters](/doc/dvclive/api-reference/init#parameters) for configuring
the behavior.

```py
def next_step()
```

#### Usage:

```py
import dvclive

for step in range(3):
    dvclive.log("metric", 0.9)
    dvclive.next_step()
```

## Description

Each call to `dvclive.next_step` will behave depending on the selected
[init parameters](/doc/dvclive/api-reference/init#parameters) and whether `DVC`
is available or not.

If `summary` is True, on each `dvclive.next_step()` call, `dvclive` will
generate a _summary_ of the metrics previously logged with `dvclive.log` and
increase the `_step` count.

The _metrics summary_ (usable by `dvc metrics`) will be saved to `{path}.json`,
being `path` the one defined in [dvclive.init](/doc/dvclive/api-reference/init).

The resulting _summary_ of the above code block would be:

```json
{
  "step": 2,
  "metric": 0.9
}
```

### DVC Integration

When `dvclive` is used alongside `DVC`, each `dvclive.next_step` call will have
additional features.

By default, on each `dvclive.next_step` call, `DVC` will create a new
[checkpoint](/doc/user-guide/experiment-management/checkpoints).

In addition, if `html` is True, on each `dvclive.next_step` call, `DVC` will
prepare an HTML report with all the _metrics logs_ logged in `path`.

## Exceptions

- `dvclive.error.InitializationError` - If `dvclive` has not been properly
  initialized (i.e. by calling [dvclive.init](/doc/dvclive/api-reference/init)
  or [dvclive.log](/doc/dvclive/api-reference/log)).
