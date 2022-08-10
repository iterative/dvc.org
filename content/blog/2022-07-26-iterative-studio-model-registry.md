---
title: Git-backed Machine Learning Model Registry to bring order to chaos
date: 2022-07-26
description: >
  🚀 As Machine Learning projects and teams grow, keeping track of all the
  models and their production status gets increasingly complex. Iterative
  Studio's Git-backed Model Registry solves this.
descriptionLong: >
  Use your Git repositories to build a model registry with model versioning,
  lineage, and lifecycle management. With Iterative Studio, have the who, what,
  why, where and when questions of your team's model production at your
  fingertips. Read to find out how.
picture: 2022-07-26/model-management-chaos.png
pictureComment:
  Without the right tools, model management can easily turn chaotic
author: tapa_dipti_sitaula
commentsUrl: https://discuss.dvc.org/t/iterative-studio-model-registry/1267
tags:
  - Model Registry
  - MLOps
  - Git
  - MLEM
  - GTO
  - Iterative Studio
  - Release
---

Machine learning tasks are iterative by nature. Over time, you build several
versions of your ML models, which could be in different stages of
production-readiness. A version may be running in production, another version
that seems to perform better may be in staging, and a couple more versions could
be in active development by you and your teammates - using updated
hyperparameters, datasets, or algorithms.

How do you keep track of all your models, their versions, and deployment
statuses? How do you get answers to questions like these easily:

- Which model version is currently in production?
- When was the last time this model was updated?

If you are like some of the data scientists we know, you may have a Google sheet
or a Notion page with the list of all your models, their changes, deployment
history, and so on. But this is highly error-prone and will probably get
out-of-date very quickly. Or maybe you upload all your models to a cloud bucket
and “attach” text reports to them. Not very maintainable or searchable either.
We’ve even seen people use sticky notes, or better yet, rely on their memory 😀.

Some of the more organized folks use Model Registries - tools created
specifically to organize models into a central, searchable repository. While
this is definitely better than using random files or sticky notes, one major
problem persists: the data science and machine learning team members work
completely isolated from the software development and DevOps team members. This
makes collaboration far more time consuming than it should be.

![Teams can work in disconnected silos](/uploads/images/2022-07-26/disconnected-silos.png)

Some even implement in-house systems, and maybe you are also planning to do so.
But these can get expensive to develop and maintain.

**We built the Iterative Studio Model Registry to solve these problems.**

Iterative Studio Model Registry enables ML teams to collaborate on models by
providing model organization, discovery, versioning, lineage (tracing the origin
of the model), and the ability to manage deployment statuses such as,
development, staging, and production across multiple projects.

## Utilize your existing Git infrastructure

Iterative Studio Model Registry is built on top of Git, which means:

- You can reuse your existing Git infrastructure to manage ML models together
  with code, data, experiment pipelines, and deployment statuses.
- You can use GitOps for model deployment, and trigger model deployment from
  Iterative Studio, which you can also use to run your ML experiments.
- DS/ML folks and Software/DevOps folks can work together more easily, because
  they utilize the same tools and infrastructure.

## Open MLOps

A core philosophy at Iterative is open MLOps - we build tools that work with
your infrastructure. Our toolstack is modular, so you can build your model
registry on top of your existing cloud and DevOps infrastructure.

Under the hood, Iterative Studio Model Registry uses Iterative’s open-source
Git-based tools [GTO] and [MLEM].

- [GTO] enables [semantic versioning][semver] and stage transitions of artifacts
  using metadata files and Git tags.
- [MLEM] saves ML models and extracts model metadata including framework,
  methods, input / output data schema, and requirements.

![Iterative toolstack is modular](/uploads/images/2022-07-26/modular-toolstack.png)

## UI of your choice

Iterative Model Studio Registry meets you where you are, through your favorite
interface. Whether you like APIs, prefer a web interface, or work best in the
command line; whatever your role or preference, we've got you covered so your
team can be most efficient.

## Models can reside anywhere

Save your model files wherever works best for you, whether it’s in S3, GCP, or
any other of your remote (or local) storages. Then, add them to the model
registry in a non-intrusive, no-code fashion **without modifying your ML
training code**. This saves you hours of valuable time.

## Collaborate across multiple projects

A central dashboard of all your models facilitates transparency and discovery
across every project by your whole team.

![Models are organized in a central dashboard](/uploads/images/2022-07-26/models-dashboard.png)

And on the model details page, you’ll find that information about the model is
automatically detected and its history tracked.

![All models have separate model detail pages](/uploads/images/2022-07-26/model-details-page.png)

## Create model versions and stages from any Git commit

For registering versions, select the commit and provide the version number. To
assign stages, select the version and provide the stage name. It is as simple as
that.

## Git remains the single source of truth for all your ML projects

Here’s a brief explanation of how the model, version and stage information is
stored in Git:

- The following entry in `artifacts.yaml` indicates that your `image-synthesis`
  model is stored in an `S3` bucket.

```yaml
image-classifier-model:
  description:
    This model is used to classify images of different objects submitted by
    users. This version of the model has an accuracy of 95%.
  labels:
    - Random Forest
    - image classification
    - sklearn
  path: .mlem/model/image-classifier-model
  type: model
```

In the following example, the Git tag `image-classifier-model@v2.0.0` indicates
that you created version `2.0.0` of your `image-classifier-model` from the Git
commit `6c0fc85`.

The Git tag `image-classifier-model#production#3` indicates that you assigned
the `production` stage to version `2.0.0` of your model.

![Git tags represent model version and stage](/uploads/images/2022-07-26/git-tags.png)

## A single platform for all your MLOps needs

Since its inception, Iterative Studio has brought together [Git], [DVC], and
[CML] for seamless data and model management, experiment tracking, visualization
and automation. Now, by harnessing the power of [MLEM] and [GTO] in its Model
Registry, it makes your machine learning processes even more robust.

## Conclusion

With the Iterative Studio Model Registry, your ML model (dis)organization is not
in chaos anymore. Collaborating on your ML projects becomes faster and your ML
team members’ lives become much easier.

Start using [Iterative Studio Model Registry] today. And answer all the who,
what, why, where and when questions of your team's model production directly
from the information in your Git repository.

Refer to the [documentation and tutorials][docs] to get started. To request
support or share feedback, you can [email me] or create a support ticket on
[GitHub][github support repo].

https://www.youtube.com/watch?v=DYeVI-QrHGI

[iterative studio model registry]: https://studio.iterative.ai/
[git]: https://git-scm.com/
[dvc]: https://dvc.org/
[cml]: https://cml.dev
[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
[semver]: https://semver.org/
[docs]: https://dvc.org/doc/studio/user-guide/model-registry
[email me]: mailto:tapa@iterative.ai
[github support repo]: https://github.com/iterative/studio-support
