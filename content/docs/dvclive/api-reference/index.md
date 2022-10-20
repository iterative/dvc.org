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
<tab title="Scalars">

```python
live.log("acc", 0.9)
```

See `Live.log()`.

</tab>
<tab title="Images">

```python
img = np.ones((500, 500, 3), np.uint8)
live.log_image("image.png", img)
```

See `Live.log_image()`.

</tab>
<tab title="Plots">

```python
y_true = [0, 0, 1, 1]
y_pred = [0.2, 0.5, 0.3, 0.8]
live.log_plot("roc", y_true, y_score)
```

See `Live.log_plot()`.

</tab>
</toggle>

### (Optionally) Update the step number

```python
live.next_step()
```

See `Live.next_step()` and `Live.set_step()` for details.

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
        live.log(metric_name, value)

    live.next_step()
```

## Outputs

After you run your training code, all the logged data will be stored in the
`dvclive` folder. Check the [DVCLive outputs](/doc/dvclive/outputs) page for
more details.
