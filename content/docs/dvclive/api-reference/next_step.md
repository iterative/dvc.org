# dvclive.next_step()

Signals that the current step has ended and increases `step` value by 1 (one).

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

Each call to `dvclive.next_step()` will behave depending on the parameters
selected in `dvclive.init()` and whether `DVC` is available or not.

If `summary` is True, on each `dvclive.next_step()` call, DVCLive will generate
a summary of the values previously logged with `dvclive.log()`, and increase the
[`step`](/doc/dvclive/api-reference/get_step) count.

The _metrics summary_ will be saved to `{path}.json`. Here's an example:

```json
{
  "step": 2,
  "metric": 0.9
}
```

> 💡 These JSON files can be visualized with `dvc metrics`.

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

## Exceptions

- `dvclive.error.InitializationError` - If `dvclive` has not been properly
  initialized (i.e. by calling `dvclive.init()` or `dvclive.log()`).
