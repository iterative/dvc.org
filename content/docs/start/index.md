---
description: 'Learn how you can use DVC to manage data science and machine
learning projects: version data, access it anywhere, capture data pipelines, and
manage experiments.'
---

# Get Started

Welcome to DVC!

Assuming DVC is already [installed](/doc/install), let's initialize it by
running `dvc init` inside a Git project:

<details>

### ⚙️ Expand to prepare the project.

In expandable sections that start with the ⚙️ emoji, we'll be providing more
information for those trying to run the commands. It's up to you to pick the
best way to read the material — read the text (skip sections like this, and it
should be enough to understand the idea of DVC), or try to run them and get the
first hand experience.

We'll be building an NLP project from scratch together. The end result is
published on [GitHub](https://github.com/iterative/example-get-started).

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

We grouped DVC's features into three interlinked trails. You can start from any
of them suitable to your interests, and come back here to explore another one.

- [**Data Management Trail**](/doc/start/data/) If you're looking for a solution
  to version your large file, datasets, and machine learning models on top of
  Git, follow this trail. It will introduce you to add files to DVC, store and
  share them using cloud providers, how to add project-external data from URLs.

- [**Pipelines Trail**](/doc/start/pipelines/) If you're building ML models
- with complex set of dependencies, and would like to track these dependencies
- persistently, and reproduce your solutions whenever required, you can explore
- this this trail. This trail will introduce how DVC pipelines can be used as a
- project dependency management tool, and how you can leverage it to reduce
- unnecessary retraining times.

- [**Experiments**](/doc/start/experiments/) enable exploration, iteration, and
  comparison across many ML experiments. Track your experiments with automatic
  versioning and checkpoint logging. Compare differences in parameters, metrics,
  code, and data. Apply, drop, roll back, resume, or share any experiment.

**New!** Once you set up your DVC repository, you can also interact with it
using Iterative Studio, the online UI for DVC.
[Here's a demo](https://studio.iterative.ai/team/Iterative/views/example-get-started-zde16i6c4g)
of how that looks like!
