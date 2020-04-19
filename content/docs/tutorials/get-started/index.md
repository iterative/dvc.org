# Get Started with DVC!

The next few pages explore the main layers of features in DVC, from basic to
advanced. This will be done in a hands-on way, working with source code and
command line.

You'll need [Git](https://git-scm.com) to run the commands in this tutorial.
Also, if DVC is not installed, please follow [these instructions](/doc/install)
first.

<details>

### Expand to get the complete project

In case you'd like to get the complete code base and results, or have any issues
along the way, please note that we have a fully reproducible
[example-get-started](https://github.com/iterative/example-get-started) repo on
Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ dvc pull
```

</details>

## Initialize

Let's start by creating a <abbr>workspace</abbr>, and initialize `git` in it as
an underlying versioning layer. Then run `dvc init` inside to create a <abbr>DVC
repository</abbr>:

```dvc
$ cd ~
$ mkdir so-tag-predict
$ cd so-tag-predict
$ git init
$ dvc init
$ git commit -m "Initialize DVC repository"
```

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories), that are
hidden from the user. This directory can be committed with Git.

> See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
> learn more about the DVC internal file and directory structure.

## What's ahead?

The following pages of this tutorial go over the multiple layers of
functionality provided by DVC. We call them _layers_ because each one builds on
top of the previous ones:

- [Data Versioning](/doc/tutorials/get-started/data-versioning) leverages Git
  SCM to version and share large files (e.g. raw data, prepared features,
  machine learning models, etc.) without storing them with Git.

- [Data Pipelines](/doc/tutorials/get-started/data-pipelines) let you build a
  dependency graph between your data processing stages, while versioning their
  input and output. Stages an pipelines can be managed and reproduced easily by
  you or others in the future.

- [Experiments](/doc/tutorials/get-started/experiments) of data and processes
  are a normal part of the data science process. DVC provides special tools to
  define and track experiments for anyone to compare within your project.

Please choose a topic from the sidebar to the left, or click the `Next` button
below to start from the beginning ↘
