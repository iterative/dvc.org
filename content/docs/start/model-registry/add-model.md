---
title: 'Get Started: Add a model'
description: 'Start tracking model artifacts with DVC.'
---

# Get Started: Add a model

Just as we use experiment tracking to manage model development, it is a good
idea to keep a <abbr>model registry</abbr> to manage the lifecycle of the models
we get from our experiments. With DVC, we can start tracking models using our
Git repository, which will serve as the single source of truth for our model
registry and enable us to trigger automated CICD workflows. DVC Studio will then
provide a model registry on top of the Git repositories to manage all our
models.

## Log a model artifact

All you need to start is a <abbr>DVC repository</abbr> and the
[DVCLive](/doc/dvclive) Python library installed:

```cli
$ pip install dvclive
```

Use the [`log_artifact`](/doc/dvclive/live/log_artifact) method to
<abbr>cache</abbr> the model with DVC and add it to the model registry (this
snippet is from the
[training script](https://github.com/iterative/example-get-started-experiments/blob/main/src/train.py)
in our example repository):

<admon type="info">

You can
[fork our example repository](https://github.com/iterative/example-get-started-experiments/fork)
and follow the
[installation steps](https://github.com/iterative/example-get-started-experiments#installation)
to set it up locally.

</admon>

```python
from dvclive import Live


with Live() as live:

...

    live.log_artifact(
        str("models/model.pkl"),
        type="model",
        name="pool-segmentation",
        desc="This is a Computer Vision (CV) model that's segmenting out swimming pools from satellite images.",
        labels=["cv", "segmentation", "satellite-images", params.train.arch],
    )
```

<details id="push-click-to-see-how-artifacts-are-registered">

#### 💡 Expand to see how it works under the hood and other ways to add models

When we call the `log_artifact()` method, DVC takes all the information we
provide in the call and edits the `dvc.yaml` file which will now contain the
following lines:

```yaml
artifacts:
  pool-segmentation:
    path: models/model.pkl
    type: model
    desc:
      This is a Computer Vision (CV) model that's segmenting out swimming pools
      from satellite images.
    labels:
      - cv
      - segmentation
      - satellite-images
```

If you don't want to add the model from a Python script, you can manually edit
`dvc.yaml` files to add information about model artifacts.

</details>

## From model to registry

If you are building your own repository, you will need to:

1. Run the script
2. Commit it and the resulting `dvc.yaml` file to Git
3. Push the result to your Git remote (e.g., GitHub)

If you are
[following](/doc/start/model-registry/manage-models#follow-along-instructions)
our example repository then this has already been done and we can continue to
the next section to find out how to set up a <abbr>model registry</abbr> for all
your models.
