---
title: 'Get Started with DVC'
description: 'Get a quick introduction to the major features of DVC for data
science and machine learning projects: version data, access it anywhere, capture
pipelines and metrics, and manage experiments.'
---

# Get Started with DVC

<!--
## Get Started with DVC
-->

Assuming DVC is already [installed](/doc/install), let's initialize it by
running `dvc init` inside a Git project:

<details>

### ⚙️ Expand to prepare a project.

Imagine we want to build an ML project from scratch. Let's start by creating a
Git repository:

```cli
$ mkdir example-get-started
$ cd example-get-started
$ git init
```

<admon type="info">

This directory name is used in our
[example-get-started](https://github.com/iterative/example-get-started) repo.

</admon>

</details>

```cli
$ dvc init
```

A few [internal files](/doc/user-guide/project-structure/internal-files) are
created that should be added to Git:

```cli
$ git status
Changes to be committed:
        new file:   .dvc/.gitignore
        new file:   .dvc/config
        ...
$ git commit -m "Initialize DVC"
```

Now you're ready to DVC!

## Following This Guide

To help you understand and use DVC better, consider those two high level
scenarios:

- **Data Management** - Track and version large amounts of data along with your
  code, and use DVC as a build system for reproducible, data driven pipelines.

- **Experiment Management** - Easily track your experiments and their progress
  by only instrumenting your code, and collaborate on ML experiments like
  software engineers do for code.

The following chapters are grouped into the above 2 trails and are all pretty
self-contained.

<admon type="tip">

Feel free to "choose your own adventure" and skip to the chapters which answer
your specific needs. In case you're unsure where to start, we recommend going
over the chapters in order.

</admon>

## Data Management

- **[Data and model versioning]** - Manage large files, datasets, and machine
  learning models. Track your data and couple its versions to your code
  versions, while keeping it stored properly outside of your Git repo.

- **[Data pipelines]** - Use pipelines to describe how models and other data
  artifacts are built, and provide an efficient way to reproduce them. Think
  "Makefiles for data and ML projects" done right.

- **[Metrics, parameters, and plots]** - Those are first class citizens in DVC
  pipelines. Capture, evaluate, and visualize ML projects without leaving Git.

[data and model versioning]: /doc/start/data-management/data-versioning
[data pipelines]: /doc/start/data-management/data-pipelines
[metrics, parameters, and plots]:
  /doc/start/data-management/metrics-parameters-plots

<admon type="tip">

The steps and results of some of these chapters are captured in our
[example-get-started] repo. Feel free to `git clone/checkout` any of its
[tags][example-get-started-tags].

[example-get-started]: https://github.com/iterative/example-get-started
[example-get-started-tags]:
  https://github.com/iterative/example-get-started/tags

</admon>

## Experiment Management

- **[Experiment tracking]** - Instrument your code to quickly start tracking
  experiments. Manage changes to code, data, metrics, parameters and plots
  associated with each experiment without bloating your Git repo.

- **[Collaborating on experiments]** - Manage experiments the same way
  developers manage code. Share experiments with your team over git, create
  branches and pull requests, and compare results.

- **[Experimenting using pipelines]** - Leverage DVC data pipelines as an
  experiment management system. Split your workflow into stages, track
  dependencies and outputs, and natively inject parameters and hyper-parameters
  to experiment runs.

[experiment tracking]: /doc/start/experiments/experiment-tracking
[collaborating on experiments]: /doc/start/experiments/experiment-collaboration
[experimenting using pipelines]: /doc/start/experiments/experiment-pipelines

<admon type="tip">

These are captured in our [example-dvc-experiments] repo (see its
[tags][example-dvc-experiments-tags]).

[example-dvc-experiments]: https://github.com/iterative/example-dvc-experiments
[example-dvc-experiments-tags]:
  https://github.com/iterative/example-dvc-experiments/tags

</admon>

## Where To Go Next

Pick a page from the list above, the left-side navigation bar, or just click
`NEXT` below!
