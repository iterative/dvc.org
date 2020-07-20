# Basic Concepts of DVC

DVC streamlines large data files and binary models into a single Git
environment. This approach will not require storing binary files in your Git
repository.

![](/img/flow-large.png) _DVC data management_

### Data Files

Large files (or directories) that are tracked and cached by DVC. Data files are
stored outside of the Git repository, on a local/shared hard drive, and/or
remote storage. `.dvc` files describing the data are put into Git as
placeholders, for DVC needs (to maintain pipelines and reproducibility).

### Local Cache

Directory with all data files on a local hard drive or in cloud storage, but not
in the Git repository. See `dvc cache dir`.

### Data Processing Stage

An individual process that transforms a data input (<abbr>dependency</abbr>)
into some result (usually a data <abbr>output</abbr>). DVC stages execute
terminal commands to (re)generate their results.

### Data Pipeline

Dependency graph ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)),
or series of [data processing stages](#stage) to (re)produce certain results.
Multiple stages can be chained by their dependencies and outputs. Pipelines are
defined in special `dvc.yaml` files. Refer to `dvc dag` for more information.

See [Data Pipelines](/doc/start/data-pipelines) for a hands-on explanation.
