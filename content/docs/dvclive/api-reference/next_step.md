# dvclive.next_step()

Signals that the current step has ended and saves _summary metrics_ to a
`.json`.

```py
def next_step() -> None:
```

#### Usage:

```py
import dvclive

for step in range(3):
    dvclive.log("metric", step * step)
    dvclive.nex_step()
```

## Description

Each call to `dvclive.next_step` will generate a _summary_ of the metrics
previously logged with `dvclive.log` and increase the `_step` count. The
_summary metrics_ will be saved to `{path}.json`, being `path` the one defined
in [dvclive.init](/doc/dvclive/api-reference/init).

The resulting summary of the above code block would be:

```json
{
  "step": 2,
  "metric": 4
}
```

💡 If you use `dvclive` alingside `DVC`, `dvclive.next_step()` will create a
[checkpoint](/doc/user-guide/experiment-management/checkpoints).

## Exceptions

- `dvclive.error.InitializationError` - If `dvclive` has not been properly
  initialized (i.e. by calling [dvclive.init](/doc/dvclive/api-reference/init)
  or [dvclive.log](/doc/dvclive/api-reference/log)).
