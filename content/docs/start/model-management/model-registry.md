---
title: 'Get Started: Model registry'
description:
  'Set up a git-based model registry with DVC to track and manage models, their
  versions and lifecycle stages.'
---

# Get Started: Model Registry

Just as we use experiment tracking to manage model development, it is a good
idea to keep a model registry to manage the lifecycle of the models we get from
our experiments. Using DVC and Studio we will set up a model registry where we
can discover, share, deploy and audit all our models and which will serve as the
single source of truth for our model management.

To make use of our model registry, we will need some trained models first. To
speed things up, we will start from a git
[repository](https://github.com/iterative/example-get-started-model-management)
with a model training pipeline already set up and ready to use.

To see how you can track experiments and set up training pipelines with DVC,
have a look at our getting started guide for
[experiment management](/doc/start/experiments).

## DVC Model registry

- show where it is in Studio

## Adding models

We have three options how to add a model to the model registry. We can:

1. use DVCLive and add models using Python code
1. Use the Studio's graphical user interface to add models interactively
1. Manually edit `dvc.yaml` files to add information about model artifacts.

Each of these methods creates an entry in the `dvc.yaml` file (in the last
method this is done manually) which describes the model we are adding to the
model registry and lists its properties for DVC to show in Studio.

The DVCLive option also takes care of saving and versioning the model artifact
with DVC which is why we will be using that in this guide. To get more details
on how to use the other two options, have a look at the
[Model registry documentation](/doc/studio/user-guide/model-registry/add-a-model).

<toggle>

<tab title="DVCLive">

```python
from dvclive import Live

...
with Live() as live:
    live.log_artifact(
        path="models/model.pkl",
        type="model",
        name="pool-segmentation",
        desc="This is a Computer Vision (CV) model that's segmenting out swimming pools from satellite images.",
        labels=["cv", "segmentation", "satellite-images"],
    )
```

</tab>

<tab title="Studio">

![Adding models in Studio](/img/mr-add-model-placeholder.gif)

</tab>

<tab title="Manualy editing dvc.yaml">

```yaml
artifacts:
  pool-segmentation: # artifact ID (name)
    path: models/model.pkl
    type: model
    desc:
      "This is a Computer Vision (CV) model that's segmenting out swimming pools
      from satellite images."
    labels:
      - cv
      - segmentation
      - sattelite-images
```

</tab>

</toggle>

With DVCLive, we use the [`log_artifact`](/doc/dvclive/live/log_artifact) method
to save the model and add it to the model registry.

To see the model in registry, we need to fill in `path` and `type` parameters.
`path` is the path to our model and by setting `type` to `"model"` we let the
model registry in Studio know to pick up the artifact and show in the GUI.

The rest of the parameters are optional and descriptive. They add information
that will be visible in Studio like in the following example

![Newly added model in the Model Registry](/img/mr-newly-added-model.png)

## Versioning models

Once we have an artifact in the model registry, we can start registering model
versions. This can be done using the Studio UI as follows

![Registering model versions](/img/placeholder-cat.gif)

- TODO - for a model version we can see the experiment metadata and observe the
  associated experiment directly

## Assigning lifecycle stages

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua.

## Removing stage assignments

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex

## De-registering model versions

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex

## Deprecating models

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex

## Auditing model history
