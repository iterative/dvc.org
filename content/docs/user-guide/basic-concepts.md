# Basic Concepts of DVC

DVC streamlines large data files and binary models into a single Git
environment. This approach will not require storing binary files in your Git
repository.

## DVC Project

Initialized by running `dvc init` in a directory, it will contain all the
[DVC files and directories](/doc/user-guide/dvc-files-and-directories),
including the <abbr>cache</abbr>, `dvc.yaml` and `.dvc` files, etc. Any other
files referenced from special DVC files are also considered part of the project
(for example [metrics files](/doc/command-reference/metrics)).

> `dvc destroy` can be used to remove all DVC-specific files from the directory,
> in effect deleting the DVC project.

## DVC repository

<abbr>DVC project</abbr> initialized in a Git repository. This enables the
versioning features of DVC (recommended). Files tracked by Git are considered
part of the DVC project when referenced from special DVC files such as
`dvc.lock`, for example source code that is used as a stage
<abbr>dependency</abbr>.

## Data Files

Large files (or directories) that are tracked and <abbr>cached</abbr> by DVC.
Data files are too large to be added to a Git repository. DVC stores them on a
local/shared hard drive, and/or _remote storage_. `dvc.lock` or `.dvc` files
describing the data are put in the <abbr>project</abbr> as placeholders for DVC
needs (to maintain pipelines and reproducibility). These can be committed to Git
instead of the data files themselves.

Examples of data files are raw datasets, extracted features, ML models,
performance data, etc.

> A.k.a. <abbr>data artifacts</abbr> and <abbr>outputs</abbr>

## Workspace

It's comprised by the non-internal <abbr>project</abbr> files, as well as the
currently present set of _data files_ and directories (see `dvc checkout`).
Similar to the
[working tree](https://git-scm.com/docs/gitglossary#def_working_tree) in Git.

## DVC Cache

A DVC project's <abbr>cache</abbr> is an
[internal directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
used to store all data files outside of the Git repository. It's a local hard
drive or external location. See `dvc cache dir`.

## Remote Storage

Storage location external to the DVC project, which is used to share and backup
all or parts of the <abbr>cache</abbr>. See `dvc remote` for more details.

## Processing Stage

An individual process that transforms a data input (<abbr>dependency</abbr>)
into some result (usually a data <abbr>output</abbr>). DVC stages execute
terminal commands to (re)generate their results.

## Data Pipeline

Dependency graph ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)),
or series of [data processing stages](#stage) to (re)produce certain results.
Multiple stages can be chained by their dependencies and outputs. Pipelines are
defined in special `dvc.yaml` files. Refer to `dvc dag` for more information.

See [Data Pipelines](/doc/start/data-pipelines) for a hands-on explanation.

## Reproducibility

Action to reproduce an experiment state. This regenerates output files (or
directories) based on a set of input files and source code. This action usually
changes experiment state.

> This is one of the biggest challenges in reusing, and hence managing ML
> projects.

## Experiment

An attempt at a data science task. Each one can be performed in a separate Git
branch or tag, and its states identified by different
[revisions](https://git-scm.com/docs/revisions). Examples: add a new data
source, extract data features, change model hyperparameters, etc. DVC doesn't
need to recompute the results after a successful merge that integrates an
experiment into the <abbr>repository</abbr> history.

> See [Experiments](/doc/start/experiments) for a hands-on explanation.

## Run Cache

DVC's run-cache is an automatic performance feature that stores both the context
and results of past experiment runs. It's located in the `.dvc/cache/runs`
directory.

`dvc run` and `dvc repro` look in the run-cache first before executing any
stages, to see if this exact same configuration has been run before (and if so
use the cached results). The run-cache can be uploaded and downloaded to/from
remote storage, along with the rest of the <abbr>cache</abbr>.

## Workflow

Set of experiments and relationships among them. Corresponds to the entire
<abbr>project</abbr> and may contain several [data pipelines](#data-pipelines).
