# DVCLive Documentation

<admon type="info">

DVCLive 3.0 is now available. Go to the [release notes] to see what changed.

</admon>

This documentation provides the details about the `dvclive` Python API module,
which can be imported regularly, for example:

```py
from dvclive import Live
```

<admon type="tip">

If you use one of the supported [ML Frameworks](/doc/dvclive/ml-frameworks), you
can jump directly to its corresponding page.

</admon>

## Basic Workflow

### Initialize DVCLive

```python
with Live() as live:
```

See [`Live()`](/doc/dvclive/live) for details.

### Log data

<toggle>
<tab title="Artifacts">

```python
live.log_artifact("model.pt", type="model", name="gpt")
```

See `Live.log_artifact()`.

</tab>
<tab title="Images">

```python
img = np.ones((500, 500, 3), np.uint8)
live.log_image("image.png", img)
```

See `Live.log_image()`.

</tab>
<tab title="Metrics">

```python
live.log_metric("acc", 0.9)
```

See `Live.log_metric()`. </tab> <tab title="Parameters">

</tab>
<tab title="Parameters">
```python
live.log_param("num_classes", 10)

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
<tab title="Plots">

```python
datapoints = [
    {"name": "petal_width", "importance": 0.4},
    {"name": "petal_length", "importance": 0.33},
    {"name": "sepal_width", "importance": 0.24},
    {"name": "sepal_length", "importance": 0.03}
]
live.log_plot(
    "iris", datapoints, x="importance", y="name",
    template="bar_horizontal", title="Iris Feature Importance"
)
```

See `Live.log_plot()`.

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

Under the hood, `Live.next_step()` calls `Live.make_summary()`,
`Live.make_dvcyaml()`, and `Live.make_report()`.

When access is enabled, updates will be sent to DVC Studio.

If you want to decouple the `step` update from the rest of the calls, you can
manually modify the `Live.step` property and call `Live.make_summary()` /
`Live.make_dvcyaml()` / `Live.make_report()`.

## Putting it all together

Joining the above snippets, you can include DVCLive in your training code:

```python
# train.py

from dvclive import Live

with Live() as live:

    live.log_param("epochs", NUM_EPOCHS)

    for epoch in range(NUM_EPOCHS):
        train_model(...)
        metrics = evaluate_model(...)

        for metric_name, value in metrics.items():
            live.log_metric(metric_name, value)

        live.next_step()

    live.log_artifact(path, type="model", name=name)
```

## Outputs

After you run your training code, all the logged data will be stored in the
`dvclive` directory. Check the [DVCLive outputs](/doc/dvclive/how-it-works) page
for more details.

## Run with DVC

Experimenting in Python interactively (like in notebooks) is great for
exploration, but eventually you may need a more structured way to run
reproducible experiments. By configuring DVC [pipelines], you can [run
experiments] with `dvc exp run`. This will track the inputs and outputs of code,
and enable more advanced workflows like multi-step pipelines and queueing
multiple experiments or even an entire grid search. See examples of how to [add
DVCLive to a pipeline] or [add a pipeline to DVCLive code], or get more
information about how to [setup a pipeline] to work with DVCLive.

[release notes]: https://github.com/iterative/dvclive/releases/tag/3.0.0
[run experiments]: /doc/user-guide/experiment-management/running-experiments
[pipelines]: /doc/user-guide/pipelines
[add DVCLive to a pipeline]: /doc/start/data-management/metrics-parameters-plots
[add a pipeline to DVCLive code]: /doc/start/experiments/experiment-pipelines
[setup a pipeline]: /doc/dvclive/how-it-works#setup-to-run-with-dvc
