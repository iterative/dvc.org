# API Reference

This reference provides the details about the `dvclive` Python API module, which
can be imported regularly, for example:

```py
from dvclive import Live
```

<admon type="tip">

If you use one of the supported
[ML Frameworks](/doc/dvclive/api-reference/ml-frameworks), you can jump directly
to its corresponding page.

</admon>

## Basic Workflow

### Initialize DVCLive

```python
from dvclive import Live

live = Live()
```

Or use as a context manager:

```python
with Live() as live:
```

See [`Live()`](/doc/dvclive/api-reference/live) for details.

### Log data

<toggle>
<tab title="Parameters">

```python
live.log_param("num_classes", 10)
```

```python
params = {
    "num_classes": 10,
    "metrics": ["accuracy", "mae"],
    "optimizer": "adam"
}
live.log_params(params)
```

See `Live.log_param()` / `Live.log_params()`.

</tab>
<tab title="Metrics">

```python
live.log_metric("acc", 0.9)
```

See `Live.log_metric()`.

</tab>
<tab title="Images">

```python
img = np.ones((500, 500, 3), np.uint8)
live.log_image("image.png", img)
```

See `Live.log_image()`.

</tab>
<tab title="SKLearn Plots">

```python
y_true = [0, 0, 1, 1]
y_pred = [0.2, 0.5, 0.3, 0.8]
live.log_sklearn_plot("roc", y_true, y_score)
```

See `Live.log_sklearn_plot()`.

</tab>
</toggle>

### (Optionally) Update the step number

```python
live.next_step()
```

See `Live.next_step()`.

Under the hood, `Live.next_step()` calls `Live.make_summary()` and
`Live.make_report()`.

If you want to decouple the `step` update from the rest of the calls, you can
manually modify the `Live.step` property and call `Live.make_summary()` /
`Live.make_report()`.

## Putting it all together

Joining the above snippets, you can include DVCLive in your training code:

```python
# train.py

from dvclive import Live

live = Live()

live.log_param("epochs", NUM_EPOCHS)

for epoch in range(NUM_EPOCHS):
    train_model(...)
    metrics = evaluate_model(...)

    for metric_name, value in metrics.items():
        live.log_metric(metric_name, value)

    live.next_step()
```

## Outputs

After you run your training code, all the logged data will be stored in the
`dvclive` directory. Check the [DVCLive outputs](/doc/dvclive/how-it-works) page
for more details.
