# What Is DVC?

Data Version Control, or DVC, is **a new type of experiment management
software** that has been built **on top of the existing engineering toolset that
you're already used to**, and particularly on a source code version control
system (currently Git). DVC reduces the gap between existing tools and data
science needs, allowing users to take advantage of experiment management
software while reusing existing skills and intuition.

The underlying source code control system eliminates the need to use external
services. Data science experiment sharing and collaboration can be done through
regular Git tools (commit messages, merges, pull requests, etc) the same way it
works for software engineers.

DVC implements a **Git experimentation methodology** where each experiment
exists with its code as well as data, and can be represented as a separate Git
branch or commit.

DVC uses a few core concepts:

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

- **Reproducibility**: Action to reproduce an experiment state. This action
  generates output files (or directories) based on a set of input files and
  source code. This action usually changes experiment state.

- **Pipeline**: Dependency graph or series of commands to reproduce data
  processing results. The commands are connected by their inputs
  (<abbr>dependencies</abbr>) and <abbr>outputs</abbr>. Pipelines are defined by
  special [stage files](/doc/command-reference/run) (similar to
  [Makefiles](https://www.gnu.org/software/make/manual/make.html#Introduction)).
  Refer to [pipeline](/doc/command-reference/pipeline) for more information.

- **Workflow**: Set of experiments and relationships among them. Workflow
  corresponds to the entire Git repository.

- **Data files**: Cached files (for large files). Data files are stored outside
  of the Git repository on a local/shared hard drive or remote storage, but
  [DVC-files](/doc/user-guide/dvc-file-format) describing that data are stored
  in Git for DVC needs (to maintain pipelines and reproducibility).

- **Cache directory**: Directory with all data files on a local hard drive or in
  cloud storage, but not in the Git repository. See `dvc cache dir`.

- **Cloud storage** support: available complement to the core DVC features. This
  is how a data scientist transfers large data files or shares a GPU-trained
  model with those without GPUs available.
