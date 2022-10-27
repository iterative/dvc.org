# Live.log_metric()

```py
 def log_metric(name: str, val: float):
```

## Usage

```py
from dvclive import Live

live = Live()

live.log_metric("train/loss", 0.4)
live.log_metric("val/loss", 0.9)
```

## Description

On each `live.log_metric(name, val)` call DVCLive will create a _metrics
history_ file in `{Live.plots_dir}/metrics/{name}.tsv`:

```dvc
$ tree
├── dvclive
│   └── plots
│       └── metrics
│           ├── train
│           │   └── loss.tsv
│           └── val
│               └── loss.tsv
└── dvclive.json
```

```dvc
$ cat dvclive/plots/metrics/train/loss.tsv
timestamp      step  loss
1623671484747  0     0.4
```

<admon type="tip">

The metrics history can be visualized with `dvc plots`:

```
dvc plots diff dvclive/plots
```

</admon>

Each subsequent call to `live.log_metric(name, val)` will add a new row to
`{Live.plots_dir}/metrics/{name}.tsv`:

```python
live.next_step()
live.log_metric("train/loss", 0.2)
live.log_metric("val/loss", 0.4)
```

```dvc
$ cat dvclive/plots/metrics/train/loss.tsv
timestamp      step  loss
1623671484747  0     0.4
1623671484892  1     0.2
```

In addition, DVCLive will create or update a _metrics summary_ in
`{Live.summary_path}`. The `name` in the _metrics summary_ will contain the
latest `val` logged:

```dvc
$ cat dvclive/metrics.json
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

The _metrics summary_ is usable by `dvc metrics`:

```
dvc metrics diff dvclive/metrics.json
```

</admon>

## Parameters

- `name` - Name of the metric being logged.

- `val` - The value to be logged.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged within the same `step`.
