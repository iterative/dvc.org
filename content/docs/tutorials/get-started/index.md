# Get Started with DVC!

The next pages explore the different layers of DVC hands-on, working with source
code and command line.

- You'll need [Git](https://git-scm.com/) to follow this tutorial.
- Also, if DVC is not installed, please follow
  [these instructions](/doc/install) first.

## Initialize

Start by creating a <abbr>workspace</abbr> and initialize Git in it, as the
underlying versioning layer. Then use `dvc init` to create a <abbr>DVC
repository</abbr>. For example:

```dvc
$ mkdir dvc-get-started
$ cd dvc-get-started
$ git init
$ dvc init
$ git commit -m "Initialize DVC repository"
```

> 📖 See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)
> to learn more about DVC internals.

## What's ahead?

These are the layers of DVC that we will cover; Each one is designed to work on
top of the previous ones, but they can be used independently:

- [Data **versioning**](/doc/tutorials/get-started/data-versioning) leverages
  Git SCM to track and share large files (e.g. raw data, prepared features,
  machine learning models) while storing them separately.

- [Data **pipelines**](/doc/tutorials/get-started/data-pipelines) let you
  register data workflows, automatically versioning inputs and outputs of all
  stages. Registered pipelines can be managed and reproduced easily by you or
  others.

- [**Experiments**](/doc/tutorials/get-started/experiments) of data and
  processes are a normal part of the data science process. DVC provides special
  tools to define and track experiments that can be tuned and compared.

Please choose a topic, or click the `Next` button below to start from the
beginning ↘
