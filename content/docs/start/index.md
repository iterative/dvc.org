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

## Before You Begin

To help you understand and use DVC consider those two high level scenarios:

- **Data Management** - Track and version large amounts of data along with your
  code, and use DVC as a build-system for reproducible, data driven pipelines.

- **Experiment Management** - Track experiments using only Git as a storage
  system (no service/DB required). Manage parameters, metrics and plots easily,
  and get powerful live tracking capabilities for training jobs via code
  instrumentation.

The following chapters are categorized into the above 2 trails and are all
pretty self-contained.

<admon type="tip">

Feel free to "choose your own adventure" and skip to the chapters which answer
your specific needs. In case you're unsure where to start, we recommend going
over the chapters in order.

</admon>

## Data Management

- **[Data and model versioning]** - Manage large files, datasets, and machine
  learning models. DVC helps you track your data and couple its versions to your
  code, while your data is stored outside of your Git repo.

- **[Discovering and accessing data]** - Accessing and using data artifacts from
  outside of the project and importing them from anywhere. This can help to
  download a specific version of an ML model to a deployment server or import a
  dataset into another project.

- **[Data pipelines]** - Use pipelines to describe how models and other data
  artifacts are built, and provide an efficient way to reproduce them. Think
  "Makefiles for data and ML projects" done right.

- **[Metrics, parameters, and plots]** - Those are 1st class citizens in DVC
  pipelines. Capture, evaluate, and visualize ML projects without leaving Git.

[data and model versioning]: /doc/start/data-management/data-versioning
[discovering and accessing data]:
  /doc/start/data-management/discovering-and-accessing-data
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

- **[Experiment versioning]** - Track the changes to the code, data, metrics,
  parameters and plots associated with each experiment, without bloating your
  Git repo.

- **[Experiment management]** - Manage experiments and share them with others
  using software engineering best practices.

- **[Building pipelines]** - Split your workflow into stages and build a
  pipeline by connecting dependencies and outputs.

- **[Experiments Iterations]** - Explore the benefits of running experiments
  using DVC Pipelines.

[experiment versioning]: /doc/start/experiments/experiment-versioning
[experiment management]: /doc/start/experiments/experiment-management
[building pipelines]: /doc/start/experiments/building-pipelines
[experiments iterations]: /doc/start/experiments/experiment-iterations

<admon type="tip">

These are captured in our [example-dvc-experiments] repo (see its
[tags][example-dvc-experiments-tags]).

[example-dvc-experiments]: https://github.com/iterative/example-dvc-experiments
[example-dvc-experiments-tags]:
  https://github.com/iterative/example-dvc-experiments/tags

</admon>

## Where To Go Next

Picking a page from the list above, left-side navigation, or just click `NEXT`
below!
