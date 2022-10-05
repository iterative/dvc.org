# Get Started

DVCLive is a Python library for logging machine learning parameters, metrics and
other metadata in simple file formats, which is fully compatible with DVC.

<admon type="tip">

If you use one of the supported [ML Frameworks](/doc/dvclive/ml-frameworks), you
can jump directly to its corresponding page.

</admon>

## Workflow

### Initialize DVCLive

```python
from dvclive import Live

live = Live()
```

See [`Live()`](/doc/dvclive/api-reference/live) for details.

### (Optionally) Log parameters

<toggle>
<tab title="Single parameter">

```python
live.log_param("num_classes", 10)
```

See `Live.log_param()`.

</tab>
<tab title="Multiple parameters">

```python
params = {
    "num_classes": 10,
    "metrics": ["accuracy", "mae"],
    "optimizer": "adam"
}
live.log_params(params)
```

See `Live.log_params()`.

</tab>
</toggle>

### Log data

<toggle>
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

## Putting all together

Joining the above snippets, you can include DVCLive in your training code:

```python
# train.py

from dvclive import Live

live = Live()

live.log_param(NUM_EPOCHS)

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
$ tree
├── dvclive
│   ├── images
│   │   └── img.png
│   ├── params.yaml
│   ├── plots
│   │   └── roc.json
│   └── scalars
│       └── acc.tsv
└── dvclive.json
```

The contents of the `dvclive` folder and `dvclive.json` will vary depending on
the type of data you have logged and whether you have updated the step value or
not.

See `Live.log()`, `Live.log_param()`/`Live.log_params()`, `Live.log_image()` and
`Live.log_plot()` for more details.

### Metrics report

If and when `step` is updated, DVCLive generates or updates a report in
`dvclive/report.{format}` which will contain all the logged data.

![](/img/dvclive-html.gif)

The `format` can be HTML) or Markdown depending on the value of the `report`
argument passed to [`Live()`](/doc/dvclive/api-reference/live#parameters).

<admon type="info">

If you don't update the step number, the report won't be generated unless you
call `Live.make_report()` directly.

</admon>

## What next?

Learn how to use DVCLive alongside other tools:

- [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)
- [DVCLive with ML Frameworks](/docs/dvclive/ml-frameworks)
