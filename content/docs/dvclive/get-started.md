# Get Started

DVCLive is a simple Python library for logging data in a format usable by DVC.

> If you use one of the supported [ML Frameworks](/doc/dvclive/ml-frameworks),
> you can jump directly to it's corresponding page.

## Workflow

### Initialize DVCLive

```python
from dvclive import Live

live = Live()
```

See [`Live()`](/doc/dvclive/api-reference/live) for details.

### Log data

```python
live.log("acc", 0.9)
```

See `Live.log()` for details.

### (Optionally) Update the step number

```python
live.next_step()
```

See `Live.next_step()` and `Live.set_step()` for details.

## Putting all together

Joining the above snippets, you can include DVCLive in your training code:

```python
# train.py

from dvclive import Live

live = Live()

for epoch in range(NUM_EPOCHS):
    train_model(...)
    metrics = evaluate_model(...)

    for metric_name, value in metrics.items():
        live.log(metric_name, value)

    live.next_step()
```

## Outputs

After you run your training code, you should see the following content in the
project:

```dvc
$ ls
dvclive        train.py
dvclive.json
```

### Summary

When [`summary`](/doc/dvclive/api-reference/live/#parameters) is enabled (True
by default), DVCLive generates a summary with the latest metrics:

```dvc
$ cat dvclive.json
{
  "step": 2,
  "{metric_name}": 0.8907166719436646,
}
```

> If you don't update the step number, the `step` entry won't be present in the
> summary.

### Linear plots

In addition, for each `{metric_name}`, DVCLive produces a linear plot under
`dvclive/{metric_name}.tsv`:

```dvc
$ cat dvclive/{metric_name}.tsv
timestamp	step	{metric_name}
1614129197192	0	0.7612833380699158
1614129198031	1	0.8736833333969116
1614129198848	2	0.8907166719436646
```

> If you don't update the step number, the Metrics Logs won't be generated.

## What next?

There are other ways to use DVCLive:

- [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)
- [DVCLive with _ML Frameworks_](/docs/dvclive/ml-frameworks)
