# Get Started

DVCLive is a Python library for logging machine learning metrics and other
metadata in simple file formats, which is fully compatible with DVC.

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
│   ├── plots
│   │   └── roc.json
│   └── scalars
│       └── acc.tsv
└── dvclive.json
```

The contents of the `dvclive` folder and `dvclive.json` will vary depending on
the type of data you have logged and whether you have updated the step value or
not.

See `Live.log()`, `Live.log_image()` and `Live.log_plot()` for more details.

## What next?

Learn how to use DVCLive alongside other tools:

- [DVCLive with DVC](/docs/dvclive/dvclive-with-dvc)
- [DVCLive with ML Frameworks](/docs/dvclive/ml-frameworks)
