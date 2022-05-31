---
title: >
  Turn Visual Studio Code into an ML experimentation platform with the DVC
  extension
date: 2022-06-14
description: >
  Streamline your data science workflow with the DVC extension for VS Code. Full
  experiment management and data versioning from the comfort of your IDE.
descriptionLong: >
  VS Code has become the IDE of choice for many data scientists. Today we are
  releasing the DVC extension, which brings a full ML experimentation platform
  to VS Code. Manage your data, run experiments, compare metrics, and visualize
  plots, all from the comfort of your IDE.
picture: 2022-06-14/header.png
author: rob_dewit
# commentsUrl:
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

Today we are proud to launch a new product that extends how ML teams can use
DVC: our extension for Visual Studio Code.

With this extension you get a full VS Code-native experimentation platform for
your machine learning projects. You can control datasets, run experiments, view
metrics, create plots, and much more. All in one place in your IDE.

[Install the DVC extension from the marketplace to get started.](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)

# Why an extension?

We built DVC to expand upon the Git workflow. This approach has made it a
powerful tool that can easily be picked up by users familiar with Git. However,
it can be more difficult for those less familiar with CLI tools to get
accustomed to using DVC. Moreover, while DVC provides many useful
visualizations, a CLI tool can only take things so far.

Therefore we wanted to incorporate DVC's functionality in a graphical interface.
[VS Code is the IDE of choice for many](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-integrated-development-environment),
including most of us here at Iterative. It seemed like the natural choice for a
platform to make DVC more versatile, accessible, and useful.

With this extension, we want to achieve the following:

- Move the entire data science workflow into your IDE
- Enhance existing visualizations and provide new ones
- Make DVC more accessible by hiding the complexity of the CLI

As data scientists, DVC is our toolbox. This extension turns VS Code into our
workshop.

<!-- # Why Visual Studio Code

One of [our core beliefs at Iterative](https://iterative.ai/why-iterative/) is
that our products should couple tightly with existing tools and processes for
data science projects.
[VS Code is the IDE of choice for many](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-integrated-development-environment),
including many of us at Iterative. Here are a few reasons why we really like it:

VS Code...

- is open source and lightweight
- has excellent support for Git workflows
- supports Jupyter Notebooks
- comes with remote development and execution built-in
- has a rich ecosystem of extensions -->

# Features

Our first priority was to include all DVC features related to data management
and experiments. Here are the main features that are available when you install
the extension right now:

## DVC View: experiments, metrics, and plots

The main feature of our extension is the DVC view, which provides a one-stop
shop for everything related to your machine learning experiments. You can run
new experiments from here and compare both metrics and plots for different
models. Never has it been easier to analyze the results of your experiments and
find the best model.

![Experiment tables to compare different
experiments](/uploads/images/2022-06-14/dvc-view-experiments-table.png)

![Plots to visualize your
experiments](/uploads/images/2022-06-14/dvc-view-plots.png)

## Source control management

On top of Git version contol for your code, the source control view now lets you
manage datasets and models tracked by DVC. Quickly see which artifacts have been
changed, and synchronize versions with your remote repository. Use `checkout`,
`commit`, `add`, `push`, and `pull` straight from the interface:

![Get a quick overview of changes to your data in the source control
panel](/uploads/images/2022-06-14/source-control.png)

## Command palette

The DVC extension makes extensive use of the Command Palette, reducing the need
to learn syntax by heart. Want to run a new experiment or pull data from your
remote repository? Give the word in the Command Palette and the DVC extension
will guide you along all required details.

![Use the command palette to quickly find DVC
features](/uploads/images/2022-06-14/command-palette.gif)

<!--
TODO: seems to overlap with Source control management; can we safely remove this?

## Tracked resources

Resources tracked by DVC can be viewed and managed through the tracked explorer
view. See at a glance which datasets and models have been changed, and use
`push` and `pull` to synchronize with your remote:

![Tracked resources in the explorer
view](/uploads/images/2022-06-14/tracked-resources.png) -->

# What's next?

We're excited that version 1.0 is live and available to the public! From here on
out, we plan on making the extension even better with new features such as
pipeline (DAG) support, TPI integration for remote execution, autocomplete for
`dvc.yaml`, and parallel coordinate plots.

Of course, we'd love to hear what you are most looking forward to. Make sure to
give us feedback on what you'd like to see next!

# Thank you!

We would like to sincerely thank everyone who has helped make this project
possible:

- [Henning Dieterichs](https://github.com/hediet), for helping us get started
- [Paige Bailey](https://twitter.com/DynamicWebPaige), for her support and warm
  tweets
- [Sid Unnithan](https://www.linkedin.com/in/siddhanthunnithan/), for his review
  and help in getting the word out there
- The VS Code developer community
- Everyone who has beta-tested the extension and provided their feedback!

# Resources

Want to read more about the extension? Check out the following pages:

- [DVC extension on the VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
- [GitHub repository](https://github.com/iterative/vscode-dvc)
- [DVC docs](https://dvc.org/)
- [Iterative community on Discord](https://dvc.org/chat)
