---
title: 'Get Started: Experiment Versioning'
description:
  'Get started with versioning experiments with DVC. Track the changes to the
  code, data, metrics, parameters and plots associated with each experiment,
  without bloating your Git repo.'
---

# Get Started: Experiment Versioning

The early stages of a Machine Learning (ML) project are usually exploratory and
demand fast iterations. Many ML practitioners chose to use tools that require
little setup and enable rapid prototyping, like those based on
[Jupyter Notebooks](https://jupyter.org/).

Although these tools are extremely useful, keeping track of the changes you made
across experiments quickly becomes cumbersome and reproducing an experiment can
be a challenge.

You can start using DVC to version your experiments without leaving your Jupyter
Notebook. There are no logins, servers, databases, or UI to spin up. Every
<abbr>DVC experiment</abbr> will be versioned **without cluttering your repo**,
unlike saving each run to a separate directory or creating a Git branch for
each.

## Enable Versioning

All you need to start is a <abbr>DVC repository</abbr> and the [DVCLive] Python
library installed:

```cli
$ pip install dvclive
```

In your Python code, you can start versioning your experiments in DVCLive's
`Live` API or framework-specific callbacks with `save_dvc_exp=True`.

There are some examples below
([other frameworks available](/doc/dvclive/api-reference/ml-frameworks)):

<toggle>

<tab title="Pytorch Lightning">

```python
from dvclive.lightning import DVCLiveLogger

...

trainer = Trainer(logger=DVCLiveLogger(save_dvc_exp=True))
trainer.fit(model)
```

</tab>

<tab title="Hugging Face">

```python
from dvclive.huggingface import DVCLiveCallback

...

trainer.add_callback(DVCLiveCallback(save_dvc_exp=True))
trainer.train()
```

</tab>

<tab title="Keras">

```python
from dvclive.keras import DVCLiveCallback

...

model.fit(
  train_dataset, validation_data=validation_dataset,
  callbacks=[DVCLiveCallback(save_dvc_exp=True)])
```

</tab>

<tab title="General Python API">

```python
from dvclive import Live

with Live(save_dvc_exp=True) as live:
    live.log_param("epochs", NUM_EPOCHS)

    for epoch in range(NUM_EPOCHS):
        train_model(...)
        metrics = evaluate_model(...)
        for metric_name, value in metrics.items():
            live.log_metric(metric_name, value)
        live.next_step()
```

</tab>

</toggle>

After this, each execution of the code will create a <abbr>DVC experiment</abbr>
containing the results and the changes needed to reproduce it.

[DVCLive] will automatically log some metrics, parameters and plots from the ML
Framework but you can also manually
[log additional info](/doc/dvclive/api-reference#log-data) to be included in the
experiment.

If you have [data tracked by DVC](/doc/start/data-management/data-versioning),
it will be automatically included in the experiment.

Once you have added [DVCLive] to your code, you can track the changes with git:

```cli
git add notebooks/TrainSegModel.ipynb
git commit -m "Add Notebook using DVCLive"
```

## Monitor the execution

By following the steps above, you enable different options to monitor the
training progress:

<toggle>

<tab title="DVCLive Report">

By default, DVCLive will
[generate or update a report](/doc/dvclive/api-reference/live/make_report)
displaying all the logged data.

If you pass `report="notebook"` to DVCLive, the report will be displayed and
updated inside the output of the cell:

![Notebook report](/img/dvclive-notebook.gif)

</tab>

<tab title="VSCode Extension">

The
[DVC Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
will also display all the data logged by DVCLive:

![VS Code Report](/img/dvclive-vscode-monitoring.gif)

</tab>

<tab title="Studio">

If you want to share live updates with others or monitor while away from your
machine, follow the instructions in
[Studio Live Experiments](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots)
to display updates in the Studio web interface:

![Studio Report](/img/dvclive-studio.gif)

</tab>

</toggle>

## Compare results

After you have run multiple experiments, you can compare the results:

<toggle>

<tab title="DVC CLI">

We can use `dvc exp show` and `dvc plots` to compare and visualize metrics,
parameters and plots across experiments.

```cli
$ dvc exp show
─────────────────────────────────────────────────────────────────────────────────────
Experiment                 Created    train.loss   eval.loss   dice_multi   base_lr
─────────────────────────────────────────────────────────────────────────────────────
workspace                  -            0.024942    0.013983        0.922   0.001
master                     05:26 PM      0.78426    0.054157      0.49599   0.1
├── 950c3b5 [bifid-says]   05:33 PM     0.024942    0.013983        0.922   0.001
├── 06090d7 [potty-sash]   05:31 PM     0.026193    0.015237      0.91494   0.01
└── d1ad0a9 [soupy-leak]   05:28 PM     0.075223    0.034786      0.49596   0.1
─────────────────────────────────────────────────────────────────────────────────────
```

```cli
$ dvc plots diff $(dvc exp list --name-only)
```

![plots diff](/img/dvclive_exp_tracking_plots_diff.svg)

</tab>

<tab title="VSCode Extension">

Inside the
[DVC Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc),
you can compare and visualize results using the
[`Experiments`](https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/experiments-table.md)
and
[`Plots`](https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md)
views.

![VS Code Comparison](/img/dvclive-vscode-compare.png)

</tab>

<tab title="Studio">

Once you have pushed the results to [Iterative Studio](/doc/studio), you can
[compare experiments](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare)
against the entire repo history:

![Studio view](/img/dvclive-studio.png)

</tab>

</toggle>

[dvclive]: /doc/dvclive
