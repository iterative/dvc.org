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

Before we begin, settle on a directory for this guide. Everything we will do
will be self contained there.

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

## Initializing a project

Inside your chosen directory, we will use our current working directory as a
<abbr>DVC project</abbr>. Let's initialize it by running `dvc init` inside a Git
project:

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

To help you understand and use DVC better, consider the following three
use-cases: **data management**, **experiment tracking** and **model
management**. You may pick any to start learning about how DVC helps you "solve"
that scenario!

Choose a trail to jump into its first chapter:

- **[Data Management]** - Track and version large amounts of data along with
  your code, and use DVC as a build system for reproducible, data driven
  pipelines.

- **[Experiment Management]** - Easily track your experiments and their progress
  by only instrumenting your code, and collaborate on ML experiments like
  software engineers do for code.

- **[Model Management]** - Use the DVC model registry to manage the lifecycle of
  your models in an auditable way. Easily access your models and integrate your
  model registry actions into CICD pipelines to follow GitOps best practices.

[Data Management]: /doc/start/data-management/data-versioning
[Experiment Management]: /doc/start/experiments/experiment-tracking
[Model Management]: /doc/start/model-management/model-registry

<admon type="tip">

Feel free to "choose your own adventure" and follow the chapters which answer
your specific needs. In case you're unsure where to start, we recommend starting
with **data management**.

</admon>
