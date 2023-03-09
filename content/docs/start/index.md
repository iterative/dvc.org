---
title: 'Get Started with DVC'
description: 'Get a quick introduction to the major features of DVC for data
science and machine learning projects: version data, access it anywhere, capture
pipelines and metrics, and manage experiments.'
---

# Get Started with DVC

Assuming DVC is already [installed](/doc/install), let's initialize it by
running `dvc init` inside a
[Git Repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository):

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
	new file:   .dvcignore
$ git commit -m "Initialize DVC"
```

Now you're ready to DVC!

DVC can be divided in groups of features that are modular but combinable:

## Data

- **[Data and model versioning]**

  Use a standard Git workflow for managing datasets and ML models, without
  storing large artifacts in Git.

- **[Data and model access]**

  Bring, explore, and access large artifacts from outside your project.

[data and model versioning]: /doc/start/data/data-versioning
[data and model access]: /doc/start/data/data-and-model-access

## Experiments

- **[Experiment versioning]**

  Track the changes to the code, data, metrics, parameters and plots associated
  with each experiment, without bloating your Git repo.

- **[Experiment management]**

  Manage experiments and share them with others using the workflow that best
  suits your needs.

[experiment versioning]: /doc/start/experiments/experiment-versioning
[experiment management]: /doc/start/data/experiment-management

## Pipelines

- **[Building Pipelines]**

  Split your workflow into stages and build a pipeline by connecting
  dependencies and outputs.

- **[Running Pipelines]**

  Execute your pipeline in different ways without unnecessarily recomputing
  stages.

[building pipelines]: /doc/start/pipeline-management/building-pipelines
[running pipelines]: /doc/start/pipeline-management/running-pipelines
