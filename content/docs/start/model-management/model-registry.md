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

## Versioning models

Now that we have our first model in the model registry, we can start registering
model versions for the model. We do it by choosing a specific commit in our
model development history and attaching a version to it to keep an easier track
of it. We will do that directly in the Studio UI as follows

![Registering model versions](/img/mr-register-model-version.gif)

Since we just saved our model to dvc and added it to the model registry in the
previous commit, we can just keep the commit which was selected automatically.
We will also keep the suggested version number. For more details and other way
of registering model versions you can have a look at the corresponding
[documentation](/doc/studio/user-guide/model-registry/register-version).

Once we register our first model version, the model registry will also
automatically connect with the experiment tracking and all metrics which are
tracked for each model version will also show up in the model registry. We can
even explore the experiment directly by clicking on the "Open in Project" button
on the model detail page.

## Assigning lifecycle stages

We have a first version for our model and now it is a good time to assign a
model lifecycle stage to it. You can create any number of lifecycle stages with
any names you wish but in this example we will only create two stages called
"dev" and "staging".

Stages are created whenever a model version is assigned to them. We will now
assign our model to the "dev" stage as follows.

![Assigning model stages](/img/mr-assign-model-stage.gif)

## Removing stage assignments

Let's say that we've tested our model a bit and decided to promote its version
1.0.0. to the next stage. In the "staging" stage the model will be ready for
deployment to production but not deployed yet (we will explore model deployment
in the next chapter).

We will assign it to the "staging" stage but we also want our team to know that
this model is no longer in the "dev" stage.

To do that, we can remove the "dev" stage from the model version 1.0.0. like
this:

![Removing model stages](/img/mr-remove-model-stage.gif)

## De-registering model versions and deprecating models

Sometimes we find that a particular model version becomes obsolete. This can
happen in a production environment with a lot of data drift or simply because
we've developed a strictly better model and have no need to keep the older
version. Similarly, sometimes this happens to an entire model perhaps because
its intended use-case is no longer needed.

In these situations we can remove model versions or the entire models from the
model registry. We will not actually do that just yet, since we first want to
download and deploy our model in the next chapter.

TODO: This is a bit clumsy, people who use the guide should not have to go back
and forth between chapters...Maybe deprecation should be moved to a short third
chapter and only mentioned here? Auditing could them also be moved there.

If you don't want to continue with model deployment or if you have already done
that you can deprecating a model version now. All we need to do is to click on
the **Deregister model version** button in the model details stage and confirm
it in a pop-up window.

![De-registering model versions](/img/mr-deregister-model-version.png)

To remove the model entirely, we can click on the three dots next to the model
name and then select **Deprecate model**. Here, we need to confirm it by typing
in the model name to avoid removing models by mistake.

If we remove the model entirely, we will also lose the ability to view its
history. Even in that case are ways to bring it back but they are out of scope
of this guide.

## Auditing model history

Every action we performe in our model registry leaves a trace so that the model
history can be audited. If we now look at the model details page of our model,
we should see something like this:

![Model history](/img/mr-model-history.png)

Under the hood DVC uses special git tags to keep track of model registry
actions, so all of this history is actually stored directly in your git
repository. DVC Studio can parse these tags and show them to us in a
user-friendly way.
