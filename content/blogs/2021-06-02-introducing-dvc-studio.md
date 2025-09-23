---
title: Introducing DVC Studio
date: 2021-06-02
description: >
  🚀 We are excited to release DVC Studio, the online UI for DVC and CML. Use
  DVC Studio for ML versioning, visualization, teamwork and no-code automation
  on top of DVC and Git. Read all about the exciting features and watch videos
  to get started quickly.
descriptionLong: >
  With DVC Studio, you can use Git and [DVC](https://dvc.org) to track your
  code, ML models, metrics, hyperparameters, and data, all together.

  Experiment tracking, visualization and collaboration can be done through a
  visual UI. Even running new iterations becomes a matter of clicking a few
  buttons. Find all the exciting details in this blog post.
picture: 2021-06-02/dvc-studio-release.png
author: tapa_dipti_sitaula
commentsUrl: https://discuss.dvc.org/t/introducing-dvc-studio/774
tags:
  - Release
  - DataChain Studio
  - DVC
  - CML
  - MLOps
  - DataOps
  - CI/CD
---

We are excited to release DVC Studio - the online UI for DVC and CML.

[DVC](https://dvc.org) and [CML](https://cml.dev) have been widely used by ML
engineers, data scientists and researchers to simplify their Machine Learning
processes. With 8000 GitHub 🌟 and 200+ open source contributors, they have
gained popularity as tools that take advantage of the existing engineering
toolset that you're already familiar with (Git, CI/CD, etc.) to provide you the
best practices for organizing your data and ML projects and collaborating
effectively. DVC Studio, an extension on top of DVC and CML, adds even more
capabilities to your MLOps toolset.

DVC Studio is a big new step for our team. Many of you have rightly pointed out
the [need for a visual UI](https://github.com/iterative/dvc/issues/1074) for
DVC. Your needs,
[ideas and suggestions](https://github.com/iterative/dvc/discussions/5941) are
our priority. And so, we are thrilled that our new product will make your ML
journeys even more smooth.

## How does DVC Studio work?

DVC Studio is a web application that you can access online or even host on-prem.
It works with the data, metrics and hyperparameters that you add to your ML
project repositories.

![](../uploads/images/2021-06-02/dvc-studio-view.png)_Each experiment,
represented by a commit in your Git history, is presented along with its data,
metrics and hyperparameters. This is your playground for visualizing, comparing
and even running experiments._

With DVC Studio we rely on you saving information into your Git repository.
Connect DVC Studio with GitHub, GitLab or Bitbucket to read repositories and to
run new experiments (using regular CI/CD capabilities - we'll talk about this in
a moment).

DVC Studio analyzes Git history and extracts information about your ML
experiments - datasets being used, metrics and hyperparameters. By using DVC,
you can be sure not to bloat your repositories with large volumes of data or
huge models. These large assets reside in cloud or other remote storage
locations (and we don't require you giving us access to it!).

## Visualize. Collaborate. Track.

This video shows you how you can visualize your experiments using DVC Studio.

https://www.youtube.com/watch?v=hKf4twg832g

DVC, along with Git, performs your ML bookkeeping automatically. Using a simple
UI, you can import your experiment history from Git. You can get quick access to
important metrics across multiple projects, or dive deep and explore individual
experiments. You can visualize and compare models the way that best fits your
needs, whether it is through precision-recall curves, scores comparison, or
trend charts showing how your model is evolving over time.

This makes it easy to see exactly how your model’s performance changed when you
increased the number of layers in your neural net, added some more samples to
your training dataset, or increased the number of epochs to run the training
for.

![](../uploads/images/2021-06-02/trends-chart.png)_With DVC Studio, you can
visualize your model evolution. This Trends chart, for instance, shows how the
average precision increased over the course or your experiments._

You will get the dashboard and all the visuals automatically if your metrics and
plots are stored in Git through DVC. But if you do not use DVC, you can still
add custom files with your metrics and parameters and DVC Studio will
efficiently generate tables and plots for your custom input.

DVC Studio also provides visual UI to create and manage teams, manage roles, and
share your experiment tables, enabling easy and efficient knowledge sharing and
collaboration.

## Use Git for ML metrics tracking. Nothing fancy.

Most ML engineers already use Git for code versioning. `dvc init`, `dvc add`,
`dvc push` - these simple Git-like DVC commands are all you need to convert your
Git repos into DVC repos - a single source of truth for not just your code but
also your data, model and metrics.

https://www.youtube.com/watch?v=5xM5az78Lrg

What makes DVC Studio special is this connection to the Git ecosystem. The table
and visuals in DVC Studio aren’t magic - they are simply a representation of the
data in JSON or CSV files in your Git repositories.

## Automate your ML process. No-code.

Mature ML teams reuse their code over and over again while tuning data and
hyperparameters. DVC Studio automates this in the visual user interface. To run
an experiment on DVC Studio, use its UI to modify the ML model hyperparameters
and dataset version. The modifications and the message you enter will be
automatically converted to a proper Git commit. Your team members can see the
changes through your Git platform or DVC Studio and track the author and
timestamp of the change.

https://www.youtube.com/watch?v=nXJXR-zBvHQ

If your project is integrated with the CI/CD process, the model training process
will be automatically triggered. Once the experiment completes, all its inputs
and outputs are available in DVC Studio, ready for visualizing and comparing.
This visual modification helps your team to iterate faster and avoid mistakes
with manual code changes.

[CML](https://cml.dev/) can create reports and orchestrate resources in your
cloud (GCP, AWS or Azure) or Kubernetes to run training. Because this is
cloud-agnostic, you are not tied to a particular cloud provider, and this helps
you avoid vendor lock-in.

With this approach, the managers, and DevOps folks who are not experts in
creating ML models, can also be part of the ML model training process. They can
re-train your model on a new version of the dataset or try other changes to your
model.

## Create magic!

So, don’t reinvent the wheel. Use Git. Through a simple UI. Use your existing
CI/CD setup. Use your existing cloud. Get the most out of them. And create magic
:) Okay, the tables and visuals in DVC Studio aren’t magic, but they sure are
magical. Right?

## Get started now

Get started at [https://studio.datachain.ai](https://studio.datachain.ai).
Simply connect with your GitHub, GitLab or Bitbucket account. No additional
sign-ups are required.

DVC Studio is completely free for individuals and small teams. Let us know if
you would like to set up DVC Studio
for[ 5+ member teams](https://form.typeform.com/to/nydf3Oys?typeform-medium=embed-snippet)
or for
[enterprises](https://form.typeform.com/to/bd9lTEt9?typeform-medium=embed-snippet),
and we will get back to you soon.

We would love to get your feedback. Reach out to us with your questions,
concerns or requests on [Discord](https://discord.com/invite/dvwXA2N). Head to
the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas. You can also
raise an issue on [GitHub](https://github.com/iterative/studio-support).

We are super excited to have you use DVC Studio. We’re confident that it’ll make
your Machine Learning journeys so much easier. We can’t wait to hear how it
goes.
