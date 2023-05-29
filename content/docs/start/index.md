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

## Initializing a project

Before we begin, settle on a directory for this guide. Everything we will do
will be self contained there. Create this directory and initialize a Git
repository:

```cli
$ mkdir example-get-started
$ cd example-get-started
$ git init
```

<admon type="info">

This directory name is used in our
[example-get-started](https://github.com/iterative/example-get-started) repo.

</admon>

Now install DVC in your project.

<details>

### ⚙️ Example installation using virtualenv

We assume you have Python 3.7 or greater installed. Here is a common path for
installing DVC using Pip, inside an
[virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
(it's not a must, but we **strongly** recommend it):

```cli
$ virtualenv venv && echo "venv" > .gitignore
$ git add .gitignore
$ source venv/bin/activate
$ pip install dvc
```

Click [here](/doc/install) for more installation scenarios

</details>

We will use this working directory as a <abbr>DVC project</abbr>. Let's
initialize it by running `dvc init` inside the Git project:

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
        new file:   .gitignore
$ git commit -m "Initialize DVC"
```

Now you're ready to DVC!

## Following This Guide

To help you understand and use DVC better, consider the below use-cases. You may
pick either one to start learning about how DVC helps you "solve" that scenario!

Choose a trail to jump into its first chapter:

- **[Basic Data Management]** - Track and version your data along with your
  code, and move data (push/pull) efficiently between your local environment and
  remote storage locations.

- **[Data Pipelines]** - Connect data as dependencies and outputs of multi-stage
  processing pipelines to get a powerful data-centric build system for your
  projects.

- **[Experiment Management]** - Easily track your experiments and their progress
  by only instrumenting your code, and collaborate on ML experiments like
  software engineers do for code.

[Basic Data Management]: /doc/start/data-management/data-versioning
[Data Pipelines]: /doc/start/data-pipelines/building-pipelines
[Experiment Management]: /doc/start/experiments/experiment-tracking

<admon type="tip">

Feel free to "choose your own adventure" and follow the chapters which answer
your specific needs. In case you're unsure where to start, we recommend starting
with **data management**.

</admon>

Pick a page from the list above, the left-side navigation bar, or just click
`NEXT` below!
