# Hugging Face Accelerate

DVCLive allows you to add experiment tracking capabilities to your
[Hugging Face Accelerate](https://huggingface.co/docs/accelerate) projects.

## Usage

If you have `dvclive` installed, the DVCLive [`Tracker`] will be used for
tracking experiments and logging metrics, parameters, and plots for
`accelerate>=0.25.0`. Unlike with Hugging Face Transformers [callback], you must
specify what to log. The following snippet shows a full example:

```python
from accelerate import Accelerator

# optional, `log_with` defaults to "all"
accelerator = Accelerator(log_with="dvclive")

# log hyperparameters
hps = {"num_iterations": 5, "learning_rate": 1e-2}
accelerator.init_trackers("my_project", config=hps)

# log metrics
accelerator.log({"train_loss": 1.12, "valid_loss": 0.8})

# log model
accelerator.save_state("checkpoint_dir")
if accelerator.is_main_process:
    live = accelerator.get_tracker("dvclive", unwrap=True)
    live.log_artifact("checkpoint_dir")

# end logging
accelerator.end_training()
```

## Initialize

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

## Log parameters

To log hyperparameters, add them using `config` like:

```python
hps = {"num_iterations": 5, "learning_rate": 1e-2}
accelerator.init_trackers("my_project", config=hps)
```

## Log metrics

To log metrics:

```python
accelerator.log({"train_loss": 1.12, "valid_loss": 0.8})
```

Optionally pass the step (if not passed, it will be auto-incremented):

```python
accelerator.log({"train_loss": 1.12, "valid_loss": 0.8}, step=1)
```

## Additional logging

To log models, other artifacts, or images, retrieve the `Live` instance from the
tracker:

```python
accelerator.save_state("checkpoint_dir")
if accelerator.is_main_process:
    live = accelerator.get_tracker("dvclive", unwrap=True)
    live.log_artifact("checkpoint_dir")
```

`accelerator.is_main_process` ensures it is only called on the main process.
This is handled automatically by the Accelerate [`Tracker`] in the other methods
above, but in this example we are directly calling [`Live`] instead.

`unwrap=True` returns the [`Live`] instance instead of the [`Tracker`], so that
you can call any [`Live`] methods.

## End

Finally, end the experiment to trigger `Live.end()`:

```python
accelerator.end_training()
```

[callback]: /dvcliveml-frameworks/huggingface
[`Live`]: /dvclivelive
[`Tracker`]: https://huggingface.co/docs/accelerate/usage_guides/tracking
