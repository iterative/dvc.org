# What Is DVC?

**Data Version Control** is a new type of data versioning, workflow and
experiment management software, that builds upon [Git](https://git-scm.com/)
(although it can work stand-alone). DVC reduces the gap between established
engineering tool sets and data science needs, allowing users to take advantage
of new [features](#core-features) while reusing existing skills and intuition.

![](/img/reproducibility.png) _DVC codifies data and ML experiments_

Data science experiment sharing and collaboration can be done through a regular
Git flow (commits, branching, pull requests, etc.), the same way it works for
software engineers.

[`dvc`](/doc/command-reference) is a command line tool, similar to `git`.

## Core Features

- DVC works **on top of Git repositories** and has a similar command line
  interface and flow as Git. DVC can also work stand-alone, but without
  versioning capabilities.

- **Large [data file](/doc/user-guide/basic-concepts#data-files) versioning** is
  enabled by replacing the data with small metafiles (easy to manage with Git).
  These placeholders point to the original data files, directories, ML models,
  etc. which can now be stored outside the project (e.g. in cloud storage).

- DVC makes data science projects **reproducible** by creating lightweight
  [pipelines](/doc/user-guide/basic-concepts#data-pipelines) using implicit
  dependency graphs,and codifying the data and artifacts involved.

- **Remote storage**: DVC separates the project's code and pipeline
  configuration (typically in a Git repo) from the data it needs and produces.
  Multiple providers are supported to push and distribute the cached data
  [remotely](/doc/command-reference/remote) (Amazon S3, Microsoft Azure Blob
  Storage, Google Cloud Storage, etc.) This is how data scientists transfer
  large data files or share a GPU-trained model with others.

  > Remote storage is complementary from the basic features, and never required.

- DVC is **platform agnostic**: It runs on all major operating systems (Linux,
  MacOS, and Windows), and works independently of the programming languages
  (Python, R, Julia, shell scripts, etc.) or ML libraries (Keras, Tensorflow,
  PyTorch, Scipy, etc.) used in the <abbr>project</abbr>.

- **Free** and **Easy to use**: DVC is
  [open-source](https://github.com/iterative/dvc/blob/master/LICENSE), quick to
  [install](/doc/install), and doesn't require special infrastructure, nor does
  it depend on APIS or external services. It's a stand-alone CLI tool.

  > Git servers, as well as SSH and cloud storage providers are supported,
  > however.
