---
title: 'Get Started: Experiment Tracking'
description:
  'Track changes to code, data, metrics, parameters and plots associated with
  each experiment, without bloating your Git repo.'
---

# Get Started: Experiment Tracking

Tools like [Jupyter Notebooks](https://jupyter.org/) are useful for rapid
prototyping, but it's hard to keep track of changes and reproduce experiments.
You can start using DVC to version your experiments without leaving your Jupyter
Notebook. Every <abbr>DVC experiment</abbr> will be versioned **without
cluttering your repo**, unlike saving each run to a separate directory or
creating a Git branch for each.

## Running

All you need to start is a <abbr>DVC repository</abbr> and the [DVCLive] Python
library installed:

```cli
$ pip install dvclive
```

In your Python code, you can start versioning your experiments in DVCLive's
`Live` API or framework-specific callbacks.

There are some examples below
([other frameworks available](/doc/dvclive/ml-frameworks)):

<toggle>

<tab title="Pytorch Lightning">

```python
from dvclive import Live
from dvclive.lightning import DVCLiveLogger

...
    trainer = Trainer(
        logger=DVCLiveLogger(log_model=True)
    )
    trainer.fit(model)
```

</tab>

<tab title="Hugging Face">

```python
from dvclive import Live
from dvclive.huggingface import DVCLiveCallback

...
with Live() as live:
    trainer.add_callback(
        DVCLiveCallback(live=live)
    )
    trainer.train()
    trainer.save_model("mymodel")
    live.log_artifact("mymodel", type="model")
```

</tab>

<tab title="Keras">

```python
from dvclive import Live
from dvclive.keras import DVCLiveCallback

...
with Live() as live:
    model.fit(
        train_dataset,
        validation_data=validation_dataset,
        callbacks=[
            DVCLiveCallback(live=live)
        ]
    )
    model.save("mymodel")
    live.log_artifact("mymodel", type="model")
```

</tab>

<tab title="General Python API">

```python
from dvclive import Live

with Live() as live:
    live.log_param("epochs", NUM_EPOCHS)

    for epoch in range(NUM_EPOCHS):
        train_model(...)
        metrics = evaluate_model(...)
        for metric_name, value in metrics.items():
            live.log_metric(metric_name, value)
        live.next_step()

    live.log_artifact("model.pkl", type="model")
```

</tab>

</toggle>

After this, each execution of the code will create a <abbr>DVC experiment</abbr>
containing the results and the changes needed to reproduce it.

[DVCLive] will automatically log some metrics, parameters and plots from the ML
Framework and any
[data tracked by DVC](/doc/start/data-management/data-versioning) but you can
also [log additional info](/doc/dvclive#log-data) to be included in the
experiment. `live.log_artifact("mymodel", type="model")` will
[track your model with DVC](/doc/dvclive/live/log_artifact) and enable managing
it with [DVC Studio Model Registry](/doc/studio/user-guide/model-registry).

<admon type="info">

Learn more about [how DVCLive works](/doc/dvclive/how-it-works)

</admon>

## Sharing

You can start tracking experiments on your local machine, but often you will
want to share results with others or persist them somewhere. Optionally follow
this section to share, or skip to the next section if you want to start locally.

If you have a Git remote (for example, GitHub) where you `git push`, you can set
DVC to automatically push code changes and metadata there in a Git commit like
this:

```cli
$ export DVC_EXP_AUTO_PUSH=true
$ export DVC_EXP_GIT_REMOTE=origin
```

<details id="sharing-details">

### 💡 Expand to see what these environment variables do

`DVC_EXP_AUTO_PUSH` forces DVC to upload all experiments to the Git remote at
the completion of the experiment using `dvc exp push`. DVC will also push all
artifacts and other <abbr>cached</abbr> data to the
[DVC remote](/doc/user-guide/data-management/remote-storage).

`DVC_EXP_GIT_REMOTE` specifies the name of the Git remote where the experiment
will be pushed (usually `origin`). Use `git remote -v` to see your available Git
remotes, and adjust the value above if you want to push somewhere other than
`origin`.

</details>

To see these pushed experiments, go to
[DVC Studio](https://studio.iterative.ai), configure your Git provider, and add
a project using the same Git remote from above. Then navigate to the settings
page, copy your
[DVC Studio token](/doc/studio/user-guide/account-and-billing#studio-access-token),
and
[configure your environment to use the token](/doc/studio/user-guide/experiments/live-metrics-and-plots#set-up-an-access-token):

```cli
$ export DVC_STUDIO_TOKEN=***
```

Once configured, DVC Studio will provide realtime updates for all running
experiments and show all completed experiments that were pushed.

<admon type="info">

Learn more about
[how experiment sharing works](/doc/user-guide/experiment-management/sharing-experiments).

</admon>

## Tracking

By following the steps above, you enable different options to monitor the
training progress:

<toggle>

<tab title="DVCLive Report">

By default, DVCLive will
[generate or update a report](/doc/dvclive/live/make_report) displaying all the
logged data.

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

<tab title="DVC Studio">

If you followed the instructions above in [Sharing](#sharing), you will see
updates in the DVC Studio web interface:

![DVC Studio Report](/img/dvclive-studio.gif)

</tab>

</toggle>

## Comparing

After you have run multiple experiments, you can compare the results:

<toggle>

<tab title="DVC CLI">

You can use `dvc exp show` and `dvc plots` to compare and visualize metrics,
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

<tab title="DVC Studio">

Once you have [shared] the results to [DVC Studio], you can
[compare experiments](/doc/studio/user-guide/experiments/visualize-and-compare)
against the entire repo history:

![DVC Studio view](/img/dvclive-studio.png)

</tab>

</toggle>

<admon type="info">

Learn more about
[Comparing Experiments](/doc/user-guide/experiment-management/comparing-experiments)

</admon>

[dvclive]: /doc/dvclive
[shared]: /doc/user-guide/experiment-management/sharing-experiments
[dvc studio]: https://studio.iterative.ai
