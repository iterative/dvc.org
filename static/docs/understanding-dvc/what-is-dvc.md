# What Is DVC?

Data Version Control, or DVC, is **a new type of experiment management
software** that has been built **on top of the existing engineering toolset**,
and particularly on a source code version control system (currently Git). DVC
reduces the gap between the existing tools and the data scientist needs. This
gives an ability to use the advantages of experiment management software while
reusing existing skills and intuition.

The underlying source code control system eliminates the need to use external
services. Data science experiment sharing and collaboration can be done through
regular Git tools (commit messages, merges, pull requests, etc) the same way it
works for software engineers.

DVC implements a **Git experimentation methodology** where each experiment
exists with its code as well as data, and can be represented as a separate Git
branch or commit.

DVC uses a few core concepts:

- **Experiment**: Equivalent to a Git version. Each experiment (extract new
  features, change model hyperparameters, data cleaning, add a new data source)
  should be performed in a separate branch and then merged into the master
  branch only if the experiment is successful. DVC allows experiments to be
  integrated into a project's history and NEVER needs to recompute the results
  after a successful merge.

- **Experiment state** or state: Equivalent to a Git snapshot (all committed
  files). Git checksum, branch name, or tag can be used as a reference to a
  experiment state.

- **Reproducibility**: Action to reproduce an experiment state. This action
  generates output files based on a set of input files and source code. This
  action usually changes experiment state.

- **Pipeline**: Directed acyclic graph (DAG) or chain of commands to reproduce
  an experiment state. The commands are connected by input and output files.
  Pipeline is defined by special **DVC-files** (which act like Makefiles).

- **Workflow**: Set of experiments and relationships among them. Workflow
  corresponds to the entire Git repository.

- **Data files**: Cached files (for large files). Data files are stored outside
  of the Git repository on a local/shared hard drive or remote storage, but
  [DVC-files](/doc/user-guide/dvc-file-format) describing that data are stored
  in Git for DVC needs (to maintain pipelines and reproducibility).

- **Data cache**: Directory with all data files on a local hard drive or in
  cloud storage, but not in the Git repository.

- **Cloud storage** support: available complement to the core DVC features. This
  is how a data scientist transfers large data files or shares a GPU-trained
  model with those without GPUs available.
