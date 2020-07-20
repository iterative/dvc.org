# What Is DVC?

**Data Version Control** is a new type of data versioning, workflow and
experiment management software, that builds onto [Git](https://git-scm.com/)
(although it can work stand-alone). DVC reduces the gap between established
engineering tool sets and data science needs, allowing users to take advantage
of [new features](#core-features) while reusing existing skills and intuition.

![](/img/reproducibility.png) _DVC codifies data and ML experiments_

Data science experiment sharing and collaboration can be done through regular
Git features (commits, branching, pull requests, etc.), the same way it works
for software engineers.

DVC is [open source](https://github.com/iterative/dvc/blob/master/LICENSE)
software!

## Core Principles

- **Workflow**: Set of experiments and relationships among them. Workflow
  corresponds to the entire Git repository.

- **Pipeline**: Dependency graph or series of commands to reproduce data
  processing results. The commands are connected by their inputs
  (<abbr>dependencies</abbr>) and <abbr>outputs</abbr>. Pipelines are defined by
  special [stage files](/doc/command-reference/run) (similar to
  [Makefiles](https://www.gnu.org/software/make/manual/make.html#Introduction)).
  Refer to [pipeline](/doc/command-reference/pipeline) for more information.

- **Experiment**: Equivalent to a
  [Git revision](https://git-scm.com/docs/revisions). Each experiment (extract
  new features, change model hyperparameters, data cleaning, add a new data
  source) can be performed in a separate branch or tag. DVC allows experiments
  to be integrated into a Git repository history and never needs to recompute
  the results after a successful merge.

- **Experiment state** or state: Equivalent to a Git snapshot (all committed
  files). A Git commit hash, branch or tag name, etc. can be used as a
  [reference](https://git-scm.com/book/en/v2/Git-Internals-Git-References) to an
  experiment state.

- **Reproducibility**: Action to reproduce an experiment state. This regenerates
  output files (or directories) based on a set of input files and source code.
  This action usually changes experiment state.

  > This is one of the biggest challenges in reusing, and hence managing ML
  > projects.

- **Data files**: Cached files (for large files). Data files are stored outside
  of the Git repository on a local/shared hard drive or remote storage, but
  [DVC-files](/doc/user-guide/dvc-files-and-directories) describing that data
  are stored in Git for DVC needs (to maintain pipelines and reproducibility).

- **Cloud storage** support: available complement to the core DVC features. This
  is how a data scientist transfers large data files or shares a GPU-trained
  model with those without GPUs available.

## Core Features

- DVC works **on top of Git repositories** and has a similar command line
  interface and Git workflow.

- It makes data science projects **reproducible** by creating lightweight
  [pipelines](/doc/command-reference/pipeline) using implicit dependency graphs.

- **Large data file versioning** works by creating special files in your Git
  repository that point to the <abbr>cache</abbr>, typically stored on a local
  hard drive.

- DVC is **Programming language agnostic**: Python, R, Julia, shell scripts,
  etc. as well as ML library agnostic: Keras, Tensorflow, PyTorch, Scipy, etc.

- It's **Open-source** and **Self-serve**: DVC is free and doesn't require any
  additional services.

- DVC supports cloud storage (Amazon S3, Microsoft Azure Blob Storage, Google
  Cloud Storage, etc.) for **data sources and pre-trained model sharing**.

DVC streamlines large data files and binary models into a single Git environment
and this approach will not require storing binary files in your Git repository.
The diagram below describes all the DVC commands and relationships between a
local cache and remote storage:

![](/img/flow-large.png) _DVC data management_
