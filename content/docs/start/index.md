# Get Started

Assuming DVC is already [installed](/doc/install), let's initialize it by
running `dvc init` inside a Git project:

<details>

### ⚙️ Expand to prepare the project.

In expandable sections that start with the ⚙️ emoji, we'll be providing more
information for those trying to run the commands. It's up to you to pick the
best way to read the material - read the text (skip sections like this, and it
should be enough to understand the idea of DVC), or try to run them and get the
fist hand experience.

We'll be building an NLP project from scratch together. The end result is
published on [Github](https://github.com/iterative/example-get-started).

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

A few
[directories and files](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files)
are created that should be added to Git:

```dvc
$ git status
Changes to be committed:
        new file:   .dvc/.gitignore
        new file:   .dvc/config
        ...
$ git commit -m "Initialize DVC"
```

DVC functionality can be split into layers and we'll explore them one by one in
the next few sections:

- [**Data versioning**](/doc/start/data-versioning) is the core
  part of DVC for large files, datasets, ML models versioning and efficient
  sharing. We'll show how to use a regular Git workflow, without storing large
  files with Git. Think "Git for data".

- [**Data access**](/doc/start/data-access) shows how to use data artifacts
  from outside of the project and how to import data artifacts from another DVC
  projects. This can help to download a specific version of an ML model to a
  deployment server or import a model to another project.

- [**Data pipelines**](/doc//start/data-pipelines) describe how
  models and other data artifacts are built, and provide an efficient way to
  reproduce them. Think "Makefiles for data and ML projects" done right.

- [**Experiments**](/doc/start/experiments) attach parameters,
  metrics, plots. You can capture and navigate experiments not leaving Git.
  Think "Git for ML".
