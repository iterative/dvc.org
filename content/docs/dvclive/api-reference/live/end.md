# Live.end()

Signals that the current experiment has ended.

```py
def end():
```

## Usage

`Live.end()` gets automatically called when exiting the context manager:

```py
from dvclive import Live

with Live() as live:
    pass
# live.end() has been called at this point
```

It is also called when the training ends for each of the supported
[ML Frameworks](/doc/dvclive/api-reference/ml-frameworks)

## Description

By default, `Live.end()` will call `Live.make_summary()` and
`Live.make_report()`.

If `save_dvc_exp=True` has been passed to `Live`, it will create a new DVC
<abbr>experiment</abbrs>, by calling `exp save` internally, and also writing a
`dvc.yaml` file configuring what DVC will show for logged plots, metrics, and
parameters.

```yaml
params:
  - params.yaml
metrics:
  - metrics.json
plots:
  - plots/metrics
```
