---
title: Introducing DVC Studio
date: 2021-06-02
description: |
  We are excited to release DVC Studio, the online UI for DVC and CML. Use DVC Studio for ML versioning, visualization, teamwork and no-code automation on top of DVC and Git. Read all about the exciting features and watch videos to get started quickly.
descriptionLong: |
  With DVC Studio, you can use Git and DVC to track your ML code, models and data, all together. Experiment tracking, visualization and collaboration can be done through a visual UI. Even running new iterations becomes a matter of clicking a few buttons. Find all the exciting details in this blog post.
picture: 2021-06-02/dvc-studio-release.png
author: tapa_dipti_sitaula
commentsUrl: https://discuss.dvc.org/t/dvc-may-2021-heartbeat/
tags:
  - Release
  - DVC Studio
  - DVC
  - CML
  - MLOps
  - DataOps
  - CI/CD
---

We are excited to release DVC Studio - the online UI for DVC and CML.

DVC and CML have been widely used by ML engineers, data scientists and
researchers to simplify their Machine Learning processes. With 8000 GitHub stars
and 200+ open source contributors, they have gained popularity as tools that
take advantage of the existing engineering toolset that you're already familiar
with (Git, CI/CD, etc.) to provide you the best practices for organizing your
data and ML projects and collaborating effectively. DVC Studio, an extension on
top of DVC and CML, adds even more capabilities to your MLOps toolset.

DVC Studio is a big new step for our team. Many of you have rightly pointed out
the [need for a visual UI](https://github.com/iterative/dvc/issues/1074) for
DVC. Your needs,
[ ideas and suggestions](https://github.com/iterative/dvc/discussions/5941) are
our priority. And so, we are thrilled that our new product will make your ML
journeys even more smooth.

## How does DVC Studio work?

DVC Studio is a web application that you can
[access online](https://studio.iterative.ai/) or even host on-prem. It works
with the data, metrics and hyperparameters that you add to your ML project
repositories.

Use the Git platform of your choice - GitHub, GitLab or Bitbucket - to version
your code, data and models all within your Git repositories. By using DVC, you
can be sure not to bloat your repos with large volumes of data or huge models.
These large assets reside in cloud or other remote storage locations. You will
simply track their version info in Git.

DVC Studio uses the Git history and automatically identifies datasets, metrics
and hyperparameters in your ML experiments. It then creates an interactive
representation of all the experiments in the project. Each experiment,
represented by a commit in your Git history, is presented along with its data,
metrics and parameters. This is your playground for visualizing, comparing and
even running experiments.

![](/uploads/images/2021-02-18/dvc-studio-view.png)

## Visualize. Collaborate. Track.

DVC, along with Git, performs your ML bookkeeping automatically, for easy and
efficient knowledge sharing and collaboration. DVC Studio enables you to access
this functionality from a single, simple UI. Connect to your ML repositories to
import your complete experiment history. Get quick access to important metrics
across multiple projects. Dive deep and explore all the datasets, metrics and
parameters of your experiments. Visualize and compare models the way that best
fits your needs, whether it is through precision-recall curves, scores
comparison, or trend charts showing how your model is evolving over time.

This makes it easy to see exactly how your model’s performance changed when you
increased the number of layers in your neural net, added some more samples to
your training dataset, or increased the number of epochs to run the training
for.

This video shows you how you can visualize your experiments using DVC Studio.

https://www.youtube.com/watch?v=hKf4twg832g

You will get the dashboard and all the visuals automatically if your metrics and
plots are stored in Git through DVC. But if you do not use DVC, you can still
add custom files with your metrics and parameters and DVC Studio will
efficiently generate tables and plots for your custom input.

DVC Studio also provides visual UI to create and manage teams, manage roles, and
share your experiment tables.

## Use Git for ML metrics tracking. Nothing fancy. Nothing difficult.

The table and visuals in DVC Studio aren’t magic - they are simply a
representation of the data in JSON or CSV files in your Git repositories. What
makes DVC Studio special is this connection to the Git ecosystem.

Most ML engineers already use Git for code versioning. `dvc init`, `dvc add`,
`dvc push` - these simple Git-like DVC commands are all you need to convert your
Git repos into DVC repos - a single source of truth for not just your code but
also your data, model and metrics.

Even this sounds like a lot? Well, you can start by simply visualizing metrics
you add in custom json or csv files - DVC Studio works with these custom files
as well.

https://www.youtube.com/watch?v=5xM5az78Lrg

## Use your regular CI/CD setup. And your choice of cloud.

Another beauty of DVC Studio is that it works with your regular CI/CD processes
and your existing clouds. For invoking your experiment runs, your regular CI/CD
setup, such as GitHub actions, is used. And [CML](https://cml.dev/) orchestrates
resources in your cloud (GCP, AWS or Azure) or Kubernetes. Because this is
cloud-agnostic, you are not tied to a particular cloud provider, and this helps
you avoid vendor lock-in.

## Automate your ML process. No-code.

Mature ML teams reuse their code over and over again while tuning data and
parameters. DVC-Studio automates this in the visual user interface. Running an
experiment on Studio is as simple as it can get - simply modify the ML model
hyperparameters and dataset version from a UI and save the changes with a
comment. The modifications and the message will be automatically converted to a
proper Git commit with the source code changes and the commit message. Your team
members can see the changes through Git or GitHub/GitLab, and track the author
and timestamp of the change. Now you can track the provenance of your model
changes through Git.

If your project is integrated with the CI/CD process, the model training process
will be automatically triggered. Once the experiment completes, all its inputs
and outputs are available in Studio, ready for visualizing and comparing. This
visual modification helps your team to iterate faster and avoid mistakes with
manual code changes.

By this automation we open a completely new scenario - No code Machine Learning.
With this approach, the managers, and DevOps folks who are not experts in
creating ML models, can also be part of the ML model training process. They can
re-train your model on a new version of the dataset or try other changes to your
model.

The following video shows this in action.

https://www.youtube.com/watch?v=nXJXR-zBvHQ

## Create magic!

So, don’t reinvent the wheel. Use Git. Through a simple UI. Use your existing
CI/CD setup. Use your existing cloud. Get the most out of them. And create magic
:) Okay, the tables and visuals in DVC Studio aren’t magic, but they sure are
magical. Right?

## Get started now

Get started at [https://studio.iterative.ai/](https://studio.iterative.ai/)
Simply connect with your GitHub, Gitlab or Bitbucket account. No additional
sign-ups are required.

For more information on how to use DVC Studio, please check out the
[docs](https://dvc.org/doc/studio).

DVC Studio is completely free for individuals and small teams. Let us know if
you would like to set up DVC Studio
for[ 5+ member teams](https://form.typeform.com/to/nydf3Oys?typeform-medium=embed-snippet)
or for
[enterprises](https://form.typeform.com/to/bd9lTEt9?typeform-medium=embed-snippet),
and we will get back to you soon.

We would love to get your feedback. Reach out to us with your questions,
concerns or requests on [Discord](https://discord.com/invite/dvwXA2N). Head to
the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas. You can also
raise an issue on [GitHub](https://github.com/iterative/studio-support').

We are super excited to have you use DVC Studio. We’re confident that it’ll make
your Machine Learning journeys so much easier. We can’t wait to hear how it
goes.
