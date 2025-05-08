---
title: >
  Turn Visual Studio Code into a machine learning experimentation platform with
  the DVC extension
date: 2022-06-14
description: >
  Today we are releasing the DVC extension, which brings a full ML
  experimentation platform to Visual Studio Code.
descriptionLong: >
  Today we are releasing the DVC extension, which brings a full machine learning
  experimentation platform to Visual Studio Code. Manage your data, run
  experiments, compare metrics, and visualize plots, all from the comfort of
  your IDE.
picture: 2022-06-14/header-vs-code-release.png
author: rob_dewit
commentsUrl: https://discuss.dvc.org/t/release-dvc-extension-for-visual-studio-code/1211
tags:
  - VS Code
  - DVC
  - MLOps
  - Release
---

Since its beta release in 2017, DVC has become an essential tool for many data
science teams. Its data versioning capabilities, reproducible pipelines, and
experiment tracking features are at the core of our ecosystem of open MLOps
tools.

Today we are proud to launch a new product that extends how machine learning
teams can use DVC:
[our extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc).

With this extension, you get a full VS Code-native experimentation platform for
your machine learning projects. Control your datasets and models, run
experiments, view metrics, create plots, and much more. You can do this all from
the comfort of your IDE, without the need for external services or logins. The
only thing you need is a
[DVC pipeline](https://dvc.org/doc/start/data-management/data-pipelines#get-started-data-pipelines).

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-06-14/overview.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

<external-link 
href="https://marketplace.visualstudio.com/items?itemName=Iterative.dvc" 
title="Download the DVC extension" 
description="Install the DVC extension from the VS Code marketplace to get started. Manage your data, run experiments,
  compare metrics, and visualize plots, all from the comfort of your IDE."
link="marketplace.visualstudio.com"
image="../uploads/images/2022-06-14/vscode-logo.png" />

# Why a VS Code extension?

We built DVC to expand upon the Git workflow to
[make it well-suited for ML experimentation](https://dvc.org/blog/ml-experiment-versioning).
This approach brought us independence from the infrastructure and provided a
natural connection to best practices from software engineering. However, a pure
CLI tool can only take things so far when it comes to visualizing experiments or
displaying large tables.

[VS Code is the IDE of choice for many](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-integrated-development-environment)
and was a natural choice for a platform to add a graphical interface to DVC.

With this extension, we want to:

- Move the ML experimentation workflow into your IDE
- Provide interactive plots and tables for analyzing ML experiments
- Make DVC more accessible by providing an alternative to the complexity of the
  CLI

As data scientists, DVC is our toolbox. This extension turns VS Code into our
workshop.

# Features

Our extension introduces the DVC view, your one-stop-shop for everything related
to your ML experiments. You can run new experiments from here, manage
parameters, and compare metrics and plots for different models.

The extension also adds panes to the
[_Explorer_](https://code.visualstudio.com/docs/getstarted/userinterface#_explorer)
and [_Source Control_](https://code.visualstudio.com/Docs/editor/versioncontrol)
views for managing all datasets and models in your DVC repository.

[_Check out the feature video on Youtube!_](https://youtu.be/LHi3SWGD9nc)

## Experiment bookkeeping

Quickly run new experiments and compare their resulting metrics in the
experiments table. Use the command palette or buttons to reproduce old
experiments, run new ones, or add them to the queue for later.

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-06-14/experiment-bookkeeping.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

## Interactive plots

Select experiments to compare and visualize their performance in interactive
plots. You can export these plots to PNG or SVG for use elsewhere.

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-06-14/compare-experiments.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

## Live tracking

Get insight into the training process of your models with live tracking of
metrics. As soon as your metrics change, your plots will be updated
automatically.

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-06-14/live-metrics.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

## Reproducibility

Click _Apply to workspace_ to reproduce any past experiment. DVC will restore
all artifacts for that experiment, and you can rerun it or use it as a base for
a new experiment.

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-06-14/apply-to-workspace.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

## Data management

Use the DVC tracked panel in the
[_Explorer_](https://code.visualstudio.com/docs/getstarted/userinterface#_explorer)
view to quickly navigate the files in the DVC project(s) in your workspace.

The [_Source Control_](https://code.visualstudio.com/Docs/editor/versioncontrol)
view now lets you manage datasets and models tracked by DVC without using the
terminal. The DVC panel shows you the state of the workspace. From here, you can
track artifacts and synchronize versions with your remote repository. Just like
you use Git to track changes to your code!

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-06-14/data-management.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

---

# What's next?

From here on out, we plan on making the extension even better with new features
such as pipeline (DAG) support,
[TPI](https://github.com/iterative/terraform-provider-iterative) integration for
remote execution, autocomplete for `dvc.yaml`, and parallel coordinate plots.

Of course, we would love to hear what you look forward to most. Please give us
feedback on what you would like to see next!

![Space Cowboy GIF](https://media.giphy.com/media/cEYFeE4wJ6jdDVBiiIM/giphy.gif)

# Thank you! ❤️

We would sincerely like to thank everyone who has helped make this project
possible:

- [Henning Dieterichs](https://github.com/hediet), for helping us get started
- [Paige Bailey](https://twitter.com/DynamicWebPaige), for her support and warm
  tweets
- [Sid Unnithan](https://www.linkedin.com/in/siddhanthunnithan/), for his review
  and help in getting the word out there
- [The VS Code developer community](https://vscode-dev-community.slack.com/join/shared_invite/zt-zq9w7ddw-VD1NVQ4p2XLT7vh_kO7bJA#/shared-invite/email)
- Everyone who has beta-tested the extension and provided their feedback!

# Resources

Want to read more about DVC or the extension? Check out the following pages:

- [DVC extension on the VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
- [GitHub repository](https://github.com/iterative/vscode-dvc)
- [DVC docs](https://dvc.org/)
- [Dave Berenbaum's post on DVC's experiment versioning](https://dvc.org/blog/ml-experiment-versioning)
- [Alex Kim's guide on setting up an ML pipeline](https://dvc.org/blog/end-to-end-computer-vision-api-part-1-data-versioning-and-ml-pipelines)
- [Iterative community on Discord](https://dvc.org/chat)

https://youtu.be/LHi3SWGD9nc
