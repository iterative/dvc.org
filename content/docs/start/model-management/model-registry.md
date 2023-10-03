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

To see how you can track experiments and set up training pipelines with DVC and
DVCLive, have a look at our getting started guide for
[experiment management](/doc/start/experiments).

## DVC Model registry overview

In DVC Studio we can access the model registry by clicking on Models in the top
menu. This will show you a dashboard with all models from all projects you have
access to. You can check out our
[public model registry example](https://studio.iterative.ai/team/Iterative/models).

From the dashboard you will have an overview of all models, latest model
versions as well stages each of the model versions is assigned to. You can also
see which git repository for each model and get more details for it by clicking
on the model name.

Here you will see some extra information about a particular model - a
description of the model, any labels that were assigned and particularly the
history of all model registry actions on that selected model. For each model
version you can also have a look at its metrics tracked by the experiment
tracked.

## Adding models

Let's now train a model and add it to the model registry.

We have three options how to add a model to the model registry. In this guide,
we will be using DVCLive and add a model using Python code. This will also
automatically save the model to DVC.

We use the [`log_artifact`](/doc/dvclive/live/log_artifact) method to save the
model and add it to the model registry. Open the training notebook
`notebooks/TrainSegModel.ipynb` in our example repository and in the last cell
of the notebook add the method call inside the `with Live(...)` statement as
follows.

```python
with Live(...) as live:

...

    live.log_artifact(
        path="models/model.pkl",
        type="model",
        name="pool-segmentation",
        desc="This is a Computer Vision (CV) model that's segmenting out swimming pools from satellite images.",
        labels=["cv", "segmentation", "satellite-images"],
    )
```

Here the `path` parameter tells DVC that our model is to be found under
`"models/model.pkl"`, the `type` parameter is `"model"` and so it will show up
in the Studio registry (other artifact types will not) and the rest of the
parameters are descriptive and optional and will also show up in the model
registry.

If we now run the code and commit the result to git (and push it to our git
remote), the new model will show up in the model registry in Studio. You should
see something like the following picture.

![Newly added model in the Model Registry](/img/mr-newly-added-model.png)

<details id="push-click-to-see-other-ways-to-add-models">

#### 💡 Expand to see other ways to add models

The other two options are to use the Studio's graphical user interface to add
models interactively or to manually edit `dvc.yaml` files to add information
about model artifacts. To get more details on the ways to add models have a look
at the
[Model registry documentation](/doc/studio/user-guide/model-registry/add-a-model).

</details>

## TODO Versioning models

Now that we have our first model in the model registry, we can start registering
model versions for the model. This really amounts to choosing specific commit in
our model development history and attaching a version to it to keep an easier
track of it. We will do that directly in the Studio UI as follows

![Registering model versions](/img/placeholder-cat.gif)

Once we register our first model version, the model registry will also
automatically connect with the experiment tracking and all metrics which are
tracked for our model version will also show up in the model registry. We can
even explore the experiment directly by clicking on the "Open in Project" button
on the model detail page.

- TODO - for a model version we can view the experiment metadata and observe the
  associated experiment directly

## TODO Assigning lifecycle stages

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua.

## TODO Removing stage assignments

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex

## TODO De-registering model versions

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex

## TODO Deprecating models

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex

## TODO Auditing model history
