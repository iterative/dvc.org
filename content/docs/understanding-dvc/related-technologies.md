# Comparison to Existing Technologies

DVC takes a novel approach, and it may be easier to understand DVC in comparison
to existing technologies and tools.

DVC combines a number of existing ideas into a single product, with the goal of
bringing best practices from software engineering into the data science field.

## Differences with related tools

### Git

- DVC extends Git by introducing the concept of _data files_ – large files that
  should NOT be stored in a Git repository but still need to be tracked and
  versioned.

### Workflow management tools

Pipelines and dependency graphs
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) such as Airflow,
Luigi, etc.

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
  [internal files and directories](/doc/user-guide/dvc-files-and-directories)
  (including the <abbr>cache</abbr> directory) have a human-readable format and
  can be easily reused by external tools.

### Git workflows/methodologies such as Gitflow

- DVC supports a new experimentation methodology that integrates easily with a
  Git workflow. A separate branch can be created for each experiment, with a
  subsequent merge of the branch if the experiment was successful.

- DVC innovates by giving experimenters the ability to easily navigate through
  past experiments without recomputing them each time.

### Build automation tools

[Make](https://www.gnu.org/software/make/) and others.

- DVC utilizes a
  [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
  (DAG):

  - The DAG or dependency graph is defined implicitly by the connections between
    [DVC-files](/doc/user-guide/dvc-file-format) (with file names `<file>.dvc`
    or `Dvcfile`), based on their dependencies and <abbr>outputs</abbr>.

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
  [DVC-files](/doc/user-guide/dvc-file-format), which provide the reproducible
  workflow, are always included in the Git repository. Hence, they can be
  executed locally with minimal effort.

- DVC is not fundamentally bound to Git, and users have the option of using DVC
  without SCM.

### Git-LFS (Large File Storage)

- DVC does not require special Git servers like Git-LFS demands. Any cloud
  storage like S3, GCS, or an on-premises SSH server can be used as a backend
  for datasets and models. No additional databases, servers, or infrastructure
  are required.

- DVC is not fundamentally bound to Git, and users have the option of using DVC
  without SCM.

- DVC does not add any hooks to the Git repo by default. To checkout data files,
  the `dvc checkout` command has to be run after each `git checkout` and
  `git clone` command. It gives more granularity on managing data and code
  separately. Hooks could be configured to make workflows simpler.

- DVC attempts to use reflinks\* and has other
  [file linking options](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache).
  This way the `dvc checkout` command does not actually copy data files from
  <abbr>cache</abbr> to the <abbr>workspace</abbr>, as copying files is a heavy
  operation for large files (30 GB+).

- `git-lfs` was not made with data science scenarios in mind, so it does not
  provide related features (e.g. pipelines,
  [metrics](/doc/command-reference/metrics)), and thus GitHub has a limit of 2
  GB per repository.

---

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.
