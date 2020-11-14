# Basic Concepts

Intro and DVC philosophy...possible diagram of cache/remote/workspace

## Cache

_From `dvc cache`_

The DVC Cache is where your data files, models, etc. (anything you want to
version with DVC) are actually stored. The data files and directories visible in
the <abbr>workspace</abbr> are links\* to (or copies of) the ones in cache.
Learn more about it's
[structure](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).

_from tooltip_

The DVC cache is a hidden storage (by default located in the `.dvc/cache`
directory) for files that are tracked by DVC, and their different versions.
Learn more about it's
[structure](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).

## DVC Files

_from dvc-files-and-directories_

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the
[internal directories and files](#internal-directories-and-files) needed for DVC
operation.

Additionally, there are a few metafiles that support DVC's features:

- Files ending with the `.dvc` extension are placeholders to track data files
  and directories. A <abbr>DVC project</abbr> usually has one `.dvc` file per
  large data file or directory being tracked.
- `dvc.yaml` files (or _pipelines files_) specify stages that form the
  pipeline(s) of a project, and how they connect (_dependency graph_ or DAG).

  These normally have a matching `dvc.lock` file to record the pipeline state
  and track its <abbr>outputs</abbr>.

Both `.dvc` files and `dvc.yaml` use human-friendly YAML 1.2 schemas, described
below. We encourage you to get familiar with them so you may create, generate,
and edit them on your own.

Both the internal directory and these metafiles should be versioned with Git (in
Git-enabled <abbr>repositories</abbr>).

## Metrics and Plots

_from plots and metrics intros_

DVC has two concepts for metrics, that represent different results of machine
learning training or data processing:

1. `dvc metrics` represent **scalar numbers** such as AUC, _true positive rate_,
   etc.
2. `dvc plots` can be used to visualize **data series** such as AUC curves, loss
   functions, confusion matrices, etc.

_from `dvc metrics`_

In order to follow the performance of machine learning experiments, DVC has the
ability to mark a certain stage <abbr>outputs</abbr> as metrics. These metrics
are project-specific floating-point or integer values e.g. AUC, ROC, false
positives, etc.

_from `dvc plots` description_

DVC provides a set of commands to visualize certain metrics of machine learning
experiments as plots. Usual plot examples are AUC curves, loss functions,
confusion matrices, among others.

_probably should mention diff..._

## Pipelines

_from `dvc dag`_

A data pipeline, in general, is a series of data processing
[stages](/doc/command-reference/run) (for example, console commands that take an
input and produce an <abbr>output</abbr>). A pipeline may produce intermediate
data, and has a final result.

Data science and machine learning pipelines typically start with large raw
datasets, include intermediate featurization and training stages, and produce a
final model, as well as accuracy [metrics](/doc/command-reference/metrics).

In DVC, pipeline stages and commands, their data I/O, interdependencies, and
results (intermediate or final) are specified in `dvc.yaml`, which can be
written manually or built using the helper command `dvc run`. This allows DVC to
restore one or more pipelines later (see `dvc repro`).

> DVC builds a dependency graph
> ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) to do this.

## Remote

_from `dvc remote`_

What is data remote?

The same way as GitHub provides storage hosting for Git repositories, DVC
remotes provide a location to store and share data and models. You can pull data
assets created by colleagues from DVC remotes without spending time and
resources to build or process them locally. Remote storage can also save space
on your local environment – DVC can [fetch](/doc/command-reference/fetch) into
the <abbr>cache directory</abbr> only the data you need for a specific
branch/commit.

Using DVC with remote storage is optional. DVC commands use the local cache
(usually in dir `.dvc/cache`) as data storage by default. This enables the main
DVC usage scenarios out of the box.

## Workspace

_from workspace tooltip_

Directory containing all your project files e.g. raw datasets, source code, ML
models, etc. Typically, it's also a Git repository. It will contain your DVC
project.

_from dvc-project tooltip_

Initialized by running `dvc init` in the **workspace** (typically a Git
repository). It will contain the
[`.dvc/` directory](/doc/user-guide/dvc-files-and-directories), as well as
`dvc.yaml` and `.dvc` files created with commands such as `dvc add` or
`dvc run`.
