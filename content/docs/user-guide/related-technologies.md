# Comparison with Related Technologies

DVC combines a number of existing ideas into a single tool, with the goal of
bringing best practices from software engineering into the data science field
(refer to [What is DVC?](/doc/user-guide/what-is-dvc) for more details).

## Git

- DVC builds upon Git by introducing the concept of data files – large files
  that should not be stored in a Git repository, but still need to be tracked
  and versioned. It leverages Git's features to enable managing different
  versions of data, data pipelines, and experiments.

- DVC is not fundamentally bound to Git, and can work without it (except
  [versioning-related](/doc/use-cases/versioning-data-and-model-files)
  features).

## Git-LFS (Large File Storage)

- DVC does not require special servers like Git-LFS demands. Any cloud storage
  like S3, Google Cloud Storage, or even an SSH server can be used as a
  [remote storage](/doc/command-reference/remote). No additional databases,
  servers, or infrastructure are required.

- DVC does not add any hooks to the Git repo by default (although they are
  [available](/doc/command-reference/install)).

- Git-LFS was not made with data science in mind, so it doesn't provide related
  features (e.g. [pipelines](/doc/command-reference/dag),
  [metrics](/doc/command-reference/metrics), etc.).

- GitHub (most common Git hosting service) has a limit of 2 GB per repository.

## Git-annex

- DVC can use reflinks\* or hardlinks (depending on the system) instead of
  symlinks to improve performance and the user experience.

- Git-annex is a datafile-centric system whereas DVC focuses on providing a
  workflow for machine learning and reproducible experiments. When a DVC or
  Git-annex repository is cloned via `git clone`, data files won't be copied to
  the local machine, as file contents are stored in separate
  [remotes](/doc/command-reference/remote). With DVC however, `.dvc` files,
  which provide the reproducible workflow, are always included in the Git
  repository. Hence, they can be executed locally with minimal effort.

- DVC optimizes file hash calculation.

> \* **copy-on-write links or "reflinks"** are a relatively new way to link
> files in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.

## Git workflows/methodologies such as Gitflow

- DVC enables a new experimentation methodology that integrates easily with
  existing Git workflows. For example, a separate branch can be created for each
  experiment, with a subsequent merge of the branch if the experiment is
  successful.

- DVC innovates by giving users the ability to easily navigate through past
  experiments without recomputing them each time.

## Workflow management systems

Pipelines and dependency graphs
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) such as _Airflow_,
_Luigi_, etc.

- DVC is focused on data science and modeling. As a result, DVC pipelines are
  lightweight and easy to create and modify. However, DVC lacks advanced
  pipeline execution features like execution monitoring, error handling, and
  recovering.

- `dvc` is purely a command line tool without a graphical user interface (GUI)
  and doesn't run any daemons or servers. Nevertheless, DVC can generate images
  with pipeline and experiment workflow visualizations.

- See also our sister project, [CML](https://cml.dev/), that helps fill some of
  these gaps.

## Experiment management software

- DVC uses Git as the underlying version control layer for data, pipelines, and
  experiments. Data versions exist as metadata in Git, as opposed to using
  external databases or APIs, so no additional services are required.

- DVC doesn't need to run any services. There's no GUI as a result, but we
  expect some GUI services will be created on top of DVC.

- DVC can generate images with [experiment](/doc/start/experiments) workflow
  visualizations.

- DVC has transparent design. Its
  [internal files and directories](/doc/user-guide/dvc-files-and-directories)
  have a human-readable format and can be easily reused by external tools.

## Build automation tools

[_Make_](https://www.gnu.org/software/make/) and others.

- File tracking:

  - DVC tracks files based on their hash values (MD5) instead of using
    timestamps. This helps avoid running into heavy processes like model
    retraining when you checkout a previous version of the project (Make would
    retrain the model).

  - DVC uses file timestamps and inodes\* for optimization. This allows DVC to
    avoid recomputing all dependency file hashes, which would be highly
    problematic when working with large files (multiple GB).

- DVC utilizes a
  [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
  (DAG):

  - The DAG or dependency graph is defined implicitly by the connections between
    pipeline [stages](/doc/command-reference/run), based on their
    <abbr>dependencies</abbr> and <abbr>outputs</abbr>.

  - Each stage defines one node in the DAG. All DVC-files in a repository make
    up a [pipelines](/doc/command-reference/dag) (think a single Makefile). All
    stages (and corresponding processes) are implicitly combined through their
    inputs and outputs, simplifying conflict resolution during merges.

  - DVC stages can be written manually in an intuitive `dvc.yaml` file, or
    generated by the helper command `dvc run`, based on a terminal command, its
    inputs, and outputs.

> \* **Inodes** are metadata file records to locate and store permissions to the
> actual file contents. See **Linking files** in
> [this doc](http://www.tldp.org/LDP/intro-linux/html/sect_03_03.html) for
> technical details (Linux).
