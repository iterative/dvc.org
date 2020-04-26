# Get Started with DVC!

This tutorial explores DVC hands-on, working with source code and command line.

## Initialize

Start by creating a <abbr>workspace</abbr> and initialize Git in it, as the
underlying versioning layer. Then use `dvc init` to create a <abbr>DVC
repository</abbr>. For example:

```dvc
$ mkdir dvc-get-started
$ cd dvc-get-started
$ git init
$ dvc init
$ git status
Changes to be committed:
        new file:   .dvc/.gitignore
        new file:   .dvc/config
$ git commit -m "Initialize DVC repository"
```

At DVC initialization, a new `.dvc/` directory is created for internal
[files and directories 📖](/doc/user-guide/dvc-files-and-directories). This
directory is automatically staged with Git, so it can be committed right away.

## What's ahead?

DVC functionality can be split into layers. Each one can be used independently,
but together they form a robust framework to capture and navigate machine
learning development.

- [Data **versioning**](/doc/tutorials/get-started/data-versioning) leverages
  Git SCM to track and share large files (e.g. raw data, prepared features,
  machine learning models) while storing them separately.

- [Data **pipelines**](/doc/tutorials/get-started/data-pipelines) let you
  register data workflows, automatically versioning inputs and outputs of all
  stages. Registered pipelines can be managed and reproduced easily by you or
  others.

- [**Experiments**](/doc/tutorials/get-started/experiments) of data and
  processes are a natural part of the data science process. DVC provides special
  tools to define and track experiments that can be tuned and compared.

Please choose a topic, or click the `Next` button below to start from the
beginning ↘
