# Live.log_metric()

```py
def log_metric(
    name: str,
    val: Union[int, float, str],
    timestamp: bool = False,
    plot: Optional[bool] = True
):
```

## Usage

```py
from dvclive import Live

with Live() as live:
    live.log_metric("train/loss", 0.4)
    live.log_metric("val/loss", 0.9)
```

## Description

On each `Live.log_metric(name, val)` call DVCLive will create a _metrics
history_ file in `{Live.plots_dir}/metrics/{name}.tsv`:

```
dvclive
├── metrics.json
└── plots
    └── metrics
        ├── train
        │   └── loss.tsv
        └── val
            └── loss.tsv
```

```cli
$ cat dvclive/plots/metrics/train/loss.tsv
timestamp      step  loss
1623671484747  0     0.4
```

<admon type="tip">

The metrics history can be visualized with `dvc plots`:

```
$ dvc plots diff dvclive/plots
```

</admon>

Each subsequent call to `Live.log_metric(name, val)` will add a new row to
`{Live.plots_dir}/metrics/{name}.tsv`:

```python
live.next_step()
live.log_metric("train/loss", 0.2, timestamp=True)
live.log_metric("val/loss", 0.4, timestamp=True)
```

```ts
timestamp      step  loss
1623671484747  0     0.4
1623671484892  1     0.2
```

In addition, DVCLive will store the latest value logged in `Live.summary`, so it
can be serialized with calls to `Live.make_summary()`, `Live.next_step()` or
when exiting the `with` block:

```json
{
  "step": 1,
  "train": {
    "loss": 0.2
  },
  "val": {
    "loss": 0.4
  }
}
```

<admon type="tip">

The metrics summary can be visualized with `dvc metrics`:

```cli
$ dvc metrics diff dvclive/metrics.json
```

</admon>

## Parameters

- `name` - name of the metric being logged.

- `val` - the value to be logged.

- `timestamp` - whether to automatically log timestamp in the _metrics history_
  file.

- `plot` - whether to add the metric value to the _metrics history_ file for
  plotting. If `False`, the metric will only be saved to the metrics summary.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.
