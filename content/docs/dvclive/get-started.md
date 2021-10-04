# Get Started

DVCLive is a simple Python library whose interface consists of three main
methods.

## Steps

To get it up and running you just need to follow these steps:

### 1. Initialize DVCLive

```python
import dvclive

dvclive.init()
```

See `dvclive.init()` for details.

### 2. Log metrics

```python
dvclive.log(metric_name, value)
```

See `dvclive.log()` for details.

### 3. Increase the step number

```python
dvclive.next_step()
```

See `dvclive.next_step()` for details.

## Putting all together

Using the above steps, you can easily include DVCLive in your training code:

```python
# train.py

import dvclive

dvclive.init()

for epoch in range(NUM_EPOCHS):
    train_model(...)
    metrics = evaluate_model(...)

    for metric_name, value in metrics.items():
        dvclive.log(metric_name, value)

    dvclive.next_step()
```

## Outputs

After you run your training code, you should see the following content in the
project:

```dvc
$ ls
dvclive        train.py
dvclive.json
```

### Metrics Logs

For each `{metric_name}`, DVCLive produces metrics _logs_ under
`dvclive/{metric_name}.tsv`:

```dvc
$ cat dvclive/{metric_name}.tsv
timestamp	step	{metric_name}
1614129197192	0	0.7612833380699158
1614129198031	1	0.8736833333969116
1614129198848	2	0.8907166719436646
```

### Metrics Summary

In addition, when [`summary`](/doc/dvclive/api-reference/init#parameters) is
enabled (True by default), DVCLive generates a metrics _summary_ with the latest
metrics:

```dvc
$ cat dvclive.json
{
  "step": 2,
  "{metric_name}": 0.8907166719436646
}
```

## What next?

There are other ways to use DVCLive:

- [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)
- [DVCLive with _ML Frameworks_](/docs/dvclive/ml-frameworks)
