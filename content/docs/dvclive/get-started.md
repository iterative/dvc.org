# Get Started

DVCLive is a Python library for logging machine learning metrics and other
metadata in simple file formats, which is fully compatible with DVC.

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

- Scalar

```python
live.log("acc", 0.9)
```

See `Live.log()`.

- Image

```python
img = np.ones((500, 500, 3), np.uint8)
live.log_image("image.png", img)
```

See `Live.log_image()`.

- Plot

```python
live.log_plot("roc", y_true, y_score)
```

See `Live.log_plot()`.

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

The contents of `dvclive` folder and `dvclive.json` would vary depending on the
type of data you have logged. See `Live.log()`, `Live.log_image()` and
`Live.log_plot()` for more details.

## What next?

Learn how to use DVCLive alongside other tools:

- [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)
- [DVCLive with ML Frameworks](/docs/dvclive/ml-frameworks)
