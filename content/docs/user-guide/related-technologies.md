# Comparison with Related Technologies

DVC combines a number of existing ideas into a single tool, with the goal of
bringing best practices from software engineering into the data science field
(refer to [What is DVC?](/doc/user-guide/what-is-dvc) for more details).

### Git

DVC builds upon Git by introducing the concept of
[data files](/doc/user-guide/basic-concepts#data-files) – large files that
should not be stored in a Git repository, but still need to be tracked and
versioned. It leverages Git's features to enable managing different versions of
data itself, data pipelines, and experiments.

### Git-LFS (Large File Storage)

- DVC is not fundamentally bound to Git, and can work without it (except any
  versioning-related features).

- DVC does not require special servers like Git-LFS demands. Any cloud storage
  like S3, Google Cloud Storage, or even an SSH server can be used as a
  [remote storage](/doc/command-reference/remote). No additional databases,
  servers, or infrastructure are required.

- DVC does not add any hooks to the Git repo by default (although they are
  [available](/doc/command-reference/install)).

- Git-LFS was not made with data science in mind, so it doesn't provide related
  features (e.g. [pipelines](/doc/user-guide/basic-concepts#data-pipeline),
  [metrics](/doc/command-reference/metrics), etc.).

- Github (most common Git hosting service) has a limit of 2 GB per repository.

### Git-annex

- DVC uses the idea of storing the content of large files (that you don't want
  to see in your Git repository) in a local key-value store and uses file
  symlinks instead of the actual files.

- DVC can use reflinks\* or hardlinks (depending on the system) instead of
  symlinks to improve performance and the user experience.

- DVC optimizes file hash calculation.

- Git-annex is a datafile-centric system whereas DVC is focused on providing a
  workflow for machine learning and reproducible experiments. When a DVC or
  Git-annex repository is cloned via `git clone`, data files won't be copied to
  the local machine, as file contents are stored in separate
  [remotes](/doc/command-reference/remote). With DVC,
  [DVC-files](/doc/user-guide/dvc-files-and-directories), which provide the
  reproducible workflow, are always included in the Git repository. Hence, they
  can be executed locally with minimal effort.

- DVC is not fundamentally bound to Git, and users have the option of using DVC
  without Git.

### Git workflows/methodologies such as Gitflow

- DVC supports a new experimentation methodology that integrates easily with Git
  workflows. A separate branch can be created for each experiment, with a
  subsequent merge of the branch if the experiment was successful.

- DVC innovates by giving experimenters the ability to easily navigate through
  past experiments without recomputing them each time.

### Workflow management tools

Pipelines and dependency graphs
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) such as _Airflow_,
_Luigi_, etc.

- DVC is focused on data science and modeling. As a result, DVC pipelines are
  lightweight and easy to create and modify. However, DVC lacks pipeline
  execution features like execution monitoring, execution error handling, and
  recovering.

- DVC is purely a command line tool without a graphical user interface (GUI) and
  doesn't run any daemons or servers. Nevertheless, DVC can generate images with
  pipeline and experiment workflow visualizations.

### Experiment management software

- DVC uses Git as the underlying platform for experiment tracking instead of a
  web application.

- DVC doesn't need to run any services. There's no graphical user interface as a
  result, but we expect some GUI services will be created on top of DVC.

- DVC has transparent design. Its
  [files and directories](/doc/user-guide/dvc-files-and-directories) (including
  the <abbr>cache</abbr> directory) have a human-readable format and can be
  easily reused by external tools.

### Build automation tools

[Make](https://www.gnu.org/software/make/) and others.

- DVC utilizes a
  [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
  (DAG):

  - The DAG or dependency graph is defined implicitly by the connections between
    [DVC-files](/doc/user-guide/dvc-files-and-directories) (with file names
    `<file>.dvc`), based on their dependencies and <abbr>outputs</abbr>.

  - Each DVC-file defines one node in the DAG. All DVC-files in a repository
    make up a single pipeline (think a single Makefile). All DVC-files (and
    corresponding pipeline commands) are implicitly combined through their
    inputs and outputs, simplifying conflict resolution during merges.

  - DVC provides a simple command – `dvc run` – to generate a DVC-file or "stage
    file" automatically, based on the provided command, dependencies, and
    outputs.

- File tracking:

  - DVC tracks files based on their hashes (MD5) instead of file timestamps.
    This helps avoid running into heavy processes like model retraining when you
    checkout a previously trained version of a model (Make would retrain the
    model).

  - DVC uses file timestamps and inodes for optimization. This allows DVC to
    avoid recomputing all dependency file hashes, which would be highly
    problematic when working with large files (10 GB+).

---

> \* **copy-on-write links or "reflinks"** are a relatively new way to link
> files in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.
