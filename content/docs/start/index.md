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

The value of DVC's several feature sets is best understood from different
angles. Pick one of the two trails below to learn about DVC from that
perspective:

## Data

- **[Data and model versioning]** is the base layer of DVC for large files,
  datasets, and machine learning models. Use a standard Git workflow, but
  without storing large files in the repo. Data is cached by DVC, allowing for
  efficient sharing. Think "Git for data".

- **[Data and model access]** goes over using data artifacts from outside of the
  project and importing them from another DVC project. This can help to download
  a specific version of an ML model to a deployment server or import a dataset
  into another project.

- **[Data pipelines]** describe how models and other data artifacts are built,
  and provide an efficient way to reproduce them. Think "Makefiles for data and
  ML projects" done right.

- **[Metrics, parameters, and plots]** can be attached to pipelines. These let
  you capture, evaluate, and visualize ML projects without leaving Git.

[data and model versioning]: /doc/start/data-management/data-versioning
[data and model access]: /doc/start/data-management/data-and-model-access
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

## Experiments

- **[Experiment versioning]**

  Track the changes to the code, data, metrics, parameters and plots associated
  with each experiment, without bloating your Git repo.

- **[Experiment management]**

  Manage experiments and share them with others using software engineering best
  practices.

- **[Building pipelines]**

  Split your workflow into stages and build a pipeline by connecting
  dependencies and outputs.

- **[Experiments Iterations]**

  Explore the benefits of running experiments using DVC Pipelines.

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

## Following the Get Started

Each page in the trails above is more or less independent, especially if you're
only reading them to get a general idea of the features in question. For better
learning, try each step yourself from the beginning of any trail. Some of the
preparation steps may be inside collapsed sections you can click on to expand:

<details>

### Click for an example!

Click the header again to collapse this message. Or move on by picking a page
from the list above, left-side navigation, or just click `NEXT` below!

</details>
