---
title: 'Get Started: Model registry'
description:
  'Set up a git-based model registry with DVC to track and manage models, their
  versions and lifecycle stages.'
---

# Get Started: Model Registry

Just as we use experiment tracking to manage model development, it is a good
idea to keep a model registry to manage the lifecycle of the models we get from
our experiments. Using DVC and DVC [Studio](/doc/studio) we will set up a model
registry where we can discover, share, deploy and audit all our models and which
will serve as the single source of truth for our model management.

To make use of our model registry, we will need some trained models first. To
speed things up, we will start from a git
[repository](https://github.com/iterative/example-get-started-model-management)
with a model training pipeline already set up and ready to use.

To see how you can track experiments and set up training pipelines with DVC and
DVCLive, have a look at our getting started guide for
[experiment management](/doc/start/experiments).

## Adding models

Let's now train a model and add it to the model registry. We will be using
[DVCLive](/doc/dvclive) and add a model using Python code. This will also
automatically save the model to DVC.

We use the [`log_artifact`](/doc/dvclive/live/log_artifact) method to save the
model and add it to the model registry. Open the training script `src/train.py`
in our example repository and you will see the following code under the
`with Live(...)` context:

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

The training script runs as a part of a dvc pipeline
[we prepared](/doc/start/experiments/experiment-pipelines) in the Experiment
Management guide, so now we just call `dvc exp run` to run the experiment.

We now commit the result to git (and push it to our git remote) and the new
model will show up in the model registry in Studio. We will also push the
resulting artifact to our DVC Remote by calling `dvc push`.

<details id="push-click-to-see-how-artifacts-are-registered">

#### 💡 Expand to see how adding models to the registry works under the hood

When we call the `log_artifact()` method, DVC takes all the information we
provided in the call and edits the `dvc.yaml` file which will now contain the
following lines

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

When you push the resulting file to your git remote it is parsed by Studio and
it then shows all model artifacts from your `dvc.yaml` files in the model
registry.

</details>

You should see something like the following picture in the Studio Model
Registry.

![Newly added model in the Model Registry](/img/mr-newly-added-model.png)

To get acquainted with how DVC stores and shares data, see our
[Get Started guide on Data Versioning](/doc/start/data-management/data-versioning).

<details id="push-click-to-see-other-ways-to-add-models">

#### 💡 Expand to see other ways to add models

The other two options are to use the Studio's graphical user interface to add
models interactively or to manually edit `dvc.yaml` files to add information
about model artifacts. To get more details on the ways to add models have a look
at the
[Model registry documentation](/doc/studio/user-guide/model-registry/add-a-model).

</details>

## DVC Model registry overview

In DVC Studio we can access the model registry by clicking on Models in the top
bar menu. This will show us a dashboard with all models from all projects we
have access to.

From the dashboard we will have an overview of all models, latest model versions
as well stages each of the model versions is assigned to. We can get more
details for each model by clicking on the model name.

<admon type="tip" id="GTO-tip">

The DVC Model registry uses the [GTO library](/doc/gto) to manage model versions
and model lifecycle stages by particularly formatted git tags.

<<<<<<< Updated upstream To see how it all works and how you can use GTO
directly without the Studio UI, you can explore the "under the hood" expandable
content in this guide! ======= To see how it all works and how you can use GTO
directly without the Studio fUI, you can explore the "under the hood" expandable
content in this guide!

> > > > > > > Stashed changes

</admon>

<details id="under-the-hood-model-registry">

#### 💡 Expand to see how the model registry works under the hood

When you register model versions, assign or remove stages or deprecate models,
GTO assign [particularly formatted](/doc/gto/user-guide#git-tags-format) git
[tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) to selected commits
and these are then parsed by the model registry to keep track of the model
lifecycle history.

This means that all the metadata used by the model registry is actually stored
in your git repo!

It also allows you to use GTO directly instead of the Studio UI to manage your
model lifecycle. That can be useful for example if you want to trigger certain
model registry actions programmatically. You can learn more about the details of
GTO in its [documentation](/docs/gto).

We recommend most users to interact with the model registry using the Studio GUI
as it is easier to use and also has some exclusive features such as the ability
to view models from multiple git repositories in one place.

</details>

## Versioning models

Now that we have our first model in the model registry, we can start registering
model versions for the model. We do it by choosing a specific commit in our
model development history and attaching a version to it to keep an easier track
of it. We will do that directly in the Studio UI as follows

![Registering model versions](/img/mr-register-model-version.gif)

Since we just saved our model to dvc and added it to the model registry in the
previous commit, we can just keep the commit which was selected automatically.
We will also keep the suggested version number. For more details and other ways
of registering model versions you can have a look at the corresponding
[documentation](/doc/studio/user-guide/model-registry/register-version).

Once we register our first model version, the model registry will also
automatically connect it to experiment tracking and all metrics which are
tracked for each model version will also show up in the model registry. We can
even explore the experiment directly by clicking on the "Open in Project" button
on the model detail page.

<details>

#### 💡 Expand to see how registering models works under the hood

Registering the model version as we just did using DVC Studio is equivalent to
the following GTO command

```
gto register pool-segmentation [ref] --version v1.0.0
```

Here, `[ref]` is the git reference/hash we selected from the menu in Studio.

For more details you can have a look at the
[gto register command reference](doc/gto/command-reference/register).

</details>

## Assigning lifecycle stages

We have a first version for our model and now it is a good time to assign a
model lifecycle stage to it. You can create any number of lifecycle stages with
any names you wish but in this example we will only create two stages called
"dev" and "test".

Stages are created whenever a model version is assigned to them. We will now
assign our model to the "dev" stage as follows.

![Assigning model stages](/img/mr-assign-model-stage.gif)

<details id="under-the-hood-assigning-model-stages">

#### 💡 Expand to see how assigning model stages works under the hood

Assigning the "dev" stage to the model as we just did using DVC Studio is
equivalent to the following GTO command

```
gto assign pool-segmentation --version v1.0.0 --stage dev
```

For more details you can have a look at the
[gto assign command reference](doc/gto/command-reference/assign).

</details>

## Changing (and removing) stage assignments

Let's say that we've decided to promote our model version 1.0.0 to the next
stage. When we assing the model to the "test" stage, it will be automatically
tested for its size (we will explore how this is done in the [Using and
Deploying models] chapter (doc/start/model-management/model-cicd)).

We will assign it to the "test" stage just like we did with the "dev" stage in
the previous section but we also want our team to know that this model is no
longer in the "dev" stage.

To do that, we can remove the "dev" stage from the model version 1.0.0 like
this:

![Removing model stages](/img/mr-remove-model-stage.gif)

It is also possible to de-register model versions or deprecate and remove models
from the registry entirely. We will not do that in this guide, but
[here](user-guide/model-registry/remove-a-model-or-its-details) you can have a
look at how to do that.

<details id="under-the-hood-removing-stages">

#### 💡 Expand to see how removing model stages works under the hood

Un-assigning the "dev" stage from the model as we just did using DVC Studio is
equivalent to the following GTO command

```
gto deprecate pool-segmentation v1.0.0 dev
```

For more details you can have a look at the
[gto deprecate command reference](doc/gto/command-reference/deprecate).

</details>

## Auditing model history

Every action we performed in our model registry leaves a trace so that the model
history can be audited. If we now look at the model details page of our model,
we should see something like this:

![Model history](/img/mr-model-history.png)

As we noted [above](/docs/start/model-management/model-registry#GTO-tip), DVC
uses special git tags to keep track of model registry actions, so all of this
history is actually stored directly in your git repository. DVC Studio can parse
these tags and show them to us in a user-friendly way.
