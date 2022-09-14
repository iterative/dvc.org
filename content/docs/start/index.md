---
description: 'Learn how you can use DVC to manage data science and machine
learning projects: version data, access it anywhere, capture data pipelines, and
manage experiments.'
---

# Get Started

Assuming DVC is already [installed](/doc/install), let's initialize it by
running `dvc init` inside a Git project:

<details>

### ⚙️ Expand to prepare the project.

We'll be building an NLP project from scratch together. The end result is
published on [GitHub](https://github.com/iterative/example-get-started) -- feel
free to clone the repo.

Let's start with `git init`:

```dvc
$ mkdir example-get-started
$ cd example-get-started
$ git init
```

</details>

```dvc
$ dvc init
```

A few [internal files](/doc/user-guide/project-structure/internal-files) are
created that should be added to Git:

```dvc
$ git status
Changes to be committed:
        new file:   .dvc/.gitignore
        new file:   .dvc/config
        ...
$ git commit -m "Initialize DVC"
```

Now you're ready to DVC!

DVC's features can be grouped into functional components. You can explore them
in two independent trails:

### Data Management

- [**Data and model versioning**](/doc/start/data-and-model-versioning) (try
  this next) is the base layer of DVC for large files, datasets, and machine
  learning models. Use a regular Git workflow, but without storing large files
  in the repo (think "Git for data"). Data is stored separately, which allows
  for efficient sharing.

- [**Data and model access**](/doc/start/data-and-model-access) shows how to use
  data artifacts from outside of the project and how to import data artifacts
  from another DVC project. This can help to download a specific version of an
  ML model to a deployment server or import a model to another project.

- [**Data pipelines**](/doc/start/data-pipelines) describe how models and other
  data artifacts are built, and provide an efficient way to reproduce them.
  Think "Makefiles for data and ML projects" done right.

- [**Metrics, parameters, and plots**](/doc/start/metrics-parameters-plots) can
  be attached to pipelines. These let you capture, navigate, and evaluate ML
  projects without leaving Git. Think "Git for machine learning".

### Experimentation

- [**Experiments**](/doc/start/experiments) enable exploration, iteration, and
  comparison across many ML experiments. Track your experiments with automatic
  versioning and checkpoint logging. Compare differences in parameters, metrics,
  code, and data. Apply, drop, roll back, resume, or share any experiment.

- [**Visualization**](/doc/start/experiments/visualization) compare experiment
  results visually, track your plots and generate them with library
  integrations.
