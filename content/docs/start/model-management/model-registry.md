---
title: 'Get Started: Model registry'
description:
  'Set up a Git-based model registry with DVC to track and manage models, their
  versions and lifecycle stages.'
---

# Get Started: Model Registry

Just as we use experiment tracking to manage model development, it is a good
idea to keep a <abbr>model registry</abbr> to manage the lifecycle of the models
we get from our experiments. Using DVC and [DVC Studio](/doc/studio) we will set
up a model registry where we can discover, share, deploy and audit all our
models and which will serve as the single source of truth for our model
management.

<admon type="tip">

Behind the scenes, DVC Studio uses a command line tool called [GTO](/doc/gto)
for most model registry actions.

With GTO you can also set up the model registry locally without DVC Studio. You
can see how this is done in the expandable "Under the hood" sections in this
chapter.

</admon>

<details id="follow-along-instructions">

#### 💡 Expand to see how to set things up to follow along with the guide

You can
[fork our example repository](https://github.com/iterative/example-get-started-experiments/fork)
and follow the
[installation steps](https://github.com/iterative/example-get-started-experiments#installation)
to set it up locally.

To then perform the model registry actions in this guide, follow
[these steps](/doc/studio/user-guide/experiments/create-a-project#connect-to-a-git-repository-and-add-a-project)
to sign in to DVC Studio, connect it to your Git account and add your forked
repository as a DVC Studio project.

</details>

## Adding models

Let's now train a model and add it to the model registry. We will be using
[DVCLive](/doc/dvclive) and add a model using Python code. This will also
automatically save the model to DVC.

We use the [`log_artifact`](/doc/dvclive/live/log_artifact) method to
<abbr>cache</abbr> the model with DVC and add it to the the model registry. Open
the training script `src/train.py` in our example repository and have a look at
the following code under the `with Live(...)` context:

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
in DVC Studio as a model type artifact (other artifact types can be also shown in the registry, but are hidden by default). The rest of the parameters are
descriptive and optional and will also show up in DVC Studio.

<details id="push-click-to-see-how-artifacts-are-registered">

#### 💡 Expand to see how adding models to the registry works under the hood

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

When you push the resulting file to your Git remote it is parsed by DVC Studio
and it then shows all model artifacts from your `dvc.yaml` files in the model
registry.

</details>

Now we just need to run the Python script which includes this code to cache and
register the model. If you are
[following](/doc/start/model-management/model-registry#follow-along-instructions)
our example repository then this has already been done and we can continue to
the next section.

If you are building your own repository, you will need to run the script and
push the result to your Git remote (e.g., GitHub) yourself.

<details id="push-click-to-see-other-ways-to-add-models">

#### 💡 Expand to see other ways to add models

The other two options are to use the DVC Studio's graphical user interface to
add models interactively or to manually edit `dvc.yaml` files to add information
about model artifacts. To get more details on the ways to add models have a look
at the
[Model registry documentation](/doc/studio/user-guide/model-registry/add-a-model).

</details>

## DVC Model registry overview

In this guide, we will be using [DVC Studio](https://studio.iterative.ai) to
manage our model registry. DVC Studio enables you to see models across all
projects, manage their lifecycle, and download them with only a token. You can
find out more about it [here](/doc/studio).

From the Models tab in DVC Studio we will have an overview of all models, latest
model versions as well stages each of the model versions is assigned to. We can
get more details for each model by clicking on the model name.

You can check out our
[example model](https://studio.iterative.ai/team/Iterative/models/b3P4bcYIrGYdzyjqzsf9Xw==/pool-segmentation/v1.0.0)
in DVC Studio to see what it will look like once we finish all the steps in this
guide.

Now that we have added a model, you should see something like the following
picture in DVC Studio if you go to the Models tab and then select the
`pool-segmentation` model.

![Newly added model in the Model Registry](/img/mr-newly-added-model.png)

You can also see the
[state of the project at this point](https://github.com/iterative/example-get-started-experiments/releases/tag/2-dvc-pipeline)
captured in our example repository.

<details id="under-the-hood-model-registry">

#### 💡 Expand to see how the model registry works under the hood

When you register model versions, assign or remove stages or deprecate models,
GTO assigns [particularly formatted](/doc/gto/user-guide#git-tags-format) Git
[tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) to selected commits
and these are then parsed by the model registry to keep track of the model
lifecycle history.

This means that all the metadata used by the model registry is actually stored
in your Git repository!

It also allows you to use GTO directly instead of the DVC Studio UI to manage
your model lifecycle. That can be useful for example if you want to trigger
certain model registry actions programmatically. You can learn more about the
details of GTO in its [documentation](/doc/gto).

If you don't have a DVC Studio account at all, you will have to manage a model
registry separately for each Git repository however.

</details>

## Versioning models

Now that we have our first model in the model registry, we can start registering
model versions for the model. We do it by choosing a specific commit in our
model development history and attaching a version to it to make it easier to
keep track of it. You can now do that directly in the DVC Studio UI as follows.

<video width="99%" height="540" autoplay loop muted>
    <source src="/img/mr-register-model-version.webm" type="video/webm">
</video>

Since we saved our model to DVC and added it to the model registry in the latest
commit, we can just keep the commit which was selected by DVC Studio
automatically. We will also keep the suggested version number v1.0.0.

For more details and other ways of registering model versions you can have a
look at the corresponding
[documentation](/doc/studio/user-guide/model-registry/register-version).

Once we register our first model version, DVC Studio will also automatically
connect it to experiment tracking and all metrics which are tracked there will
also show up in the model registry for each model version.

<details>

#### 💡 Expand to see how registering models works under the hood

Registering the model version as we just did using DVC Studio is equivalent to
the following GTO command

```
gto register pool-segmentation [ref] --version v1.0.0
```

Here, `[ref]` is the Git reference/hash we selected from the menu in DVC Studio.

For more details you can have a look at the
[gto register command reference](/doc/gto/command-reference/register).

</details>

## Assigning lifecycle stages

We have a first version for our model and now it is a good time to assign a
model lifecycle stage to it. You can create any number of lifecycle stages with
any names you wish but in this example we will only create two stages called
"dev" and "prod".

Stages are created whenever a model version is assigned to them. You can now
assign the model version 1.0.0 to the "dev" stage as follows.

<video width="99%" height="540" autoplay loop muted>
    <source src="/img/mr-assign-model-stage.webm" type="video/webm">
</video>

When we assign the model to a stage, it can automatically trigger actions in our
CICD workflows, like deploying the model to a new environment (we will explore
how this is done in the
[Using and Deploying models](/doc/start/model-management/model-cicd) chapter).

<details id="under-the-hood-assigning-model-stages">

#### 💡 Expand to see how assigning model stages works under the hood

Assigning the "dev" stage to the model as we just did using DVC Studio is
equivalent to the following GTO command.

```
gto assign pool-segmentation --version v1.0.0 --stage dev
```

For more details you can have a look at the
[gto assign command reference](/doc/gto/command-reference/assign).

</details>

## Changing (and removing) stage assignments

Let's say that we've decided to promote our model version 1.0.0 to production
and denote that it is no longer in the "dev" stage. First, assign the model
version to the "prod" stage just like we did with the "dev" stage in the
previous section.

Now, to remove the "dev" stage from our model version 1.0.0 and assign it only
to "prod", follow these steps:

<video width="99%" height="540" autoplay loop muted>
    <source src="/img/mr-remove-model-stage.webm" type="video/webm">
</video>

It is also possible to de-register model versions or deprecate and remove models
from the registry entirely. To see how, have a look at the
[documentation](/doc/studio/user-guide/model-registry/remove-a-model-or-its-details).

The detailed view of our model in the registry should now match what we see
[in our example](https://studio.iterative.ai/team/Iterative/models/b3P4bcYIrGYdzyjqzsf9Xw==/pool-segmentation/v1.0.0).

<details id="under-the-hood-removing-stages">

#### 💡 Expand to see how removing model stages works under the hood

Whenever we un-assign stages, de-register model versions and deprecate models,
DVC Studio uses the GTO library under the hood. It is also possible to use GTO
manually to perform these actions. To see how, have a look at the
[gto deprecate command reference](/doc/gto/command-reference/deprecate).

</details>

## Auditing model history

Every action we performed in our model registry leaves a trace so that the model
history can be audited. If you now look at the model details page of our model,
you should see something like this:

![Model history](/img/mr-model-history.png)

As we noted
[above](/doc/start/model-management/model-registry#under-the-hood-model-registry),
DVC uses special Git tags to keep track of model registry actions, so all of
this history is actually stored directly in your Git repository. DVC Studio can
parse these tags and show them to us in a user-friendly way.

If you look at the
[tags in our example repository](https://github.com/iterative/example-get-started-experiments/tags),
you can see that all the model registry actions that we performed are captured
by such tags.
