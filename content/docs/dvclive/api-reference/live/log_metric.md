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

```
└── dvclive
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

```ts
timestamp      step  loss
1623671484747  0     0.4
1623671484892  1     0.2
```

In addition, DVCLive will store the latest value logged in `Live.summary`, so it
can be serialized with calls to `live.make_summary()` or `live.next_step()`.

## Parameters

- `name` - Name of the metric being logged.

- `val` - The value to be logged.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged within the same `step`.
