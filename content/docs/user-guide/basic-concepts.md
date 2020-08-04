# Basic Concepts of DVC

DVC streamlines large data files and binary models into a single Git
environment. This approach will not require storing binary files in your Git
repository.

### Data Files

Large files (or directories) that are tracked and <abbr>cached</abbr> by DVC.
Data files are stored outside of the Git repository, on a local/shared hard
drive, and/or remote storage. `.dvc` files describing the data are put into Git
as placeholders, for DVC needs (to maintain pipelines and reproducibility).

> A.k.a. <abbr>data artifacts</abbr> and <abbr>outputs</abbr>

### DVC Cache

A DVC project's <abbr>cache</abbr> is an
[internal directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
used to store all data files outside of the Git repository. It's a local hard
drive or external location. See `dvc cache dir`.

### Processing Stage

An individual process that transforms a data input (<abbr>dependency</abbr>)
into some result (usually a data <abbr>output</abbr>). DVC stages execute
terminal commands to (re)generate their results.

### Data Pipeline

Dependency graph ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)),
or series of [data processing stages](#stage) to (re)produce certain results.
Multiple stages can be chained by their dependencies and outputs. Pipelines are
defined in special `dvc.yaml` files. Refer to `dvc dag` for more information.

See [Data Pipelines](/doc/start/data-pipelines) for a hands-on explanation.

### Reproducibility

Action to reproduce an experiment state. This regenerates output files (or
directories) based on a set of input files and source code. This action usually
changes experiment state.

> This is one of the biggest challenges in reusing, and hence managing ML
> projects.

## Advanced Concepts

### Experiment

An attempt at a data science task. Each one can be performed in a separate Git
branch or tag, and its states identified by different
[revisions](https://git-scm.com/docs/revisions). Examples: add a new data
source, extract new features, change model hyperparameters, etc. DVC doesn't
need to recompute the results after a successful merge that integrates an
experiment into the <abbr>repository</abbr> history.

> See [Experiments](/doc/start/experiments) for a hands-on explanation.

### Workflow

Set of experiments and relationships among them. Corresponds to the entire
<abbr>project</abbr> and may contain several [data pipelines](#data-pipelines).
