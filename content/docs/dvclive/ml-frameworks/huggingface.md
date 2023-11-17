# Hugging Face

## Transformers

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face Transformers](https://huggingface.co/docs/transformers) projects.

### Usage

<p align='center'>
  <a href="https://colab.research.google.com/github/iterative/dvclive/blob/main/examples/DVCLive-HuggingFace.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" />
  </a>
</p>

If you have `dvclive` installed, the [`DVCLiveCallback`] will be used for
tracking experiments and logging [metrics], [parameters], and [plots]
automatically for `transformers>=4.36.0`.

To log the model, set `HF_DVCLIVE_LOG_MODEL=true` in your environment.

```python
os.environ["HF_DVCLIVE_LOG_MODEL"] = "true"

from transformers import TrainingArguments, Trainer

# optional, `report_to` defaults to "all"
args = TrainingArguments(..., report_to="dvclive")
trainer = Trainer(..., args=args)
```

To customize tracking, include the [`DVCLiveCallback`] in the callbacks list
passed to your
[`Trainer`](https://huggingface.co/transformers/main_classes/trainer.html),
along with a [`Live`] instance including additonal arguments:

```python
from dvclive import Live
from transformers.integrations import DVCLiveCallback

...

trainer = Trainer(...)
trainer.add_callback(DVCLiveCallback(Live(dir="custom_dir")))
trainer.train()
```

For `transformers<4.36.0`, import the callback from `dvclive` instead of
`transformers`:

```python
from dvclive.huggingface import DVCLiveCallback

...

trainer = Trainer(...)
trainer.add_callback(DVCLiveCallback())
trainer.train()
```

<admon type="warn">

`dvclive.huggingface.DVCLiveCallback` will be deprecated in DVCLive 4.0 in favor
of `transformers.integrations.DVCLiveCallback`.

</admon>

### Examples

#### Log model checkpoints

Use `HF_DVCLIVE_LOG_MODEL=true` or `log_model=True` to save the checkpoints (it
will use `Live.log_artifact()` internally to save those).

If true, DVCLive will save a copy of the last checkpoint to the
`dvclive/artifacts` directory and annotate it with name `last` or `best` (if
[args.load_best_model_at_end](https://huggingface.co/docs/transformers/main_classes/trainer#transformers.TrainingArguments.load_best_model_at_end)).

This is useful to be consumed in the <abbr>model registry</abbr> or automation
scenarios.

- Save the `last` checkpoint at the end of training:

```python
os.environ["HF_DVCLIVE_LOG_MODEL"] = "true"

from transformers import TrainingArguments, Trainer

args = TrainingArguments(..., report_to="dvclive")
trainer = Trainer(..., args=args)
```

- Save the `best` checkpoint at the end of training:

```python
os.environ["HF_DVCLIVE_LOG_MODEL"] = "true"

from transformers import TrainingArguments, Trainer

args = TrainingArguments(..., report_to="dvclive")
trainer = Trainer(..., args=args)
trainer.args.load_best_model_at_end = True
```

- Save updates to the checkpoints directory whenever a new checkpoint is saved:

```python
os.environ["HF_DVCLIVE_LOG_MODEL"] = "all"

from transformers import TrainingArguments, Trainer

args = TrainingArguments(..., report_to="dvclive")
trainer = Trainer(..., args=args)
```

#### Passing additional DVCLive arguments

Use `live` to pass an existing [`Live`] instance.

```python
from dvclive import Live
from transformers.integrations import DVCLiveCallback

with Live("custom_dir") as live:
    trainer = Trainer(...)
    trainer.add_callback(DVCLiveCallback(live=live))

    # Log additional metrics after training
    live.log_metric("summary_metric", 1.0, plot=False)
```

### Output format

Each metric will be logged to:

```py
{Live.plots_dir}/metrics/{split}/{metric}.tsv
```

Where:

- `{Live.plots_dir}` is defined in [`Live`].
- `{split}` can be either `train` or `eval`.
- `{metric}` is the name provided by the framework.

## Accelerate

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face Accelerate](https://huggingface.co/docs/accelerate) projects.

### Usage

If you have `dvclive` installed, the DVCLiveCallback [`Tracker`] will be used
for tracking experiments and logging [metrics], [parameters], and [plots]
automatically for `accelerate>=0.25.0`.

```python
from accelerate import Accelerator

# optional, `log_with` defaults to "all"
accelerator = Accelerator(log_with="dvclive")
accelerator.init_trackers(project_name="my_project")
```

To customize tracking, include arguments to be passed to the [`Live`] instance
using `init_kwargs` like:

```python
accelerator.init_trackers(
    project_name="my_project",
    init_kwargs={"dvclive": {"dir": "my_directory"}}
)
```

To log hyperparameters, add them using `config` like:

```python
hps = {"num_iterations": 5, "learning_rate": 1e-2}
accelerator.init_trackers("my_project", config=hps)
```

Log any data and optionally specify the step:

```python
accelerator.log({"train_loss": 1.12, "valid_loss": 0.8}, step=1)
```

For custom logging outside of `accelerate`, retrieve the `Live` instance from
the tracker:

```python
live = accelerator.get_tracker("dvclive")
live.log_artifact(...)
```

Finally, end the experiment to trigger `Live.end()`:

```python
accelerator.end_training()
```

[`DVCLiveCallback`]:
  https://huggingface.co/transformers/main_classes/callback.html#transformers.integrations.DVCLiveCallback
[metrics]: (/doc/command-reference/metrics)
[parameters]: (/doc/command-reference/metrics)
[plots]: (/doc/command-reference/metrics)
[model]: (/doc/user-guide/project-structure/dvcyaml-files#artifacts)
[`Live`]: /doc/dvclive/live
[`Tracker`]: https://huggingface.co/docs/accelerate/usage_guides/tracking
