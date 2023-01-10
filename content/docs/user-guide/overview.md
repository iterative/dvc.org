# Overview

## Core Features

- DVC is a [free], open-source [VS Code Extension] and [command line] tool.

- DVC works **on top of Git repositories** and has a similar command line
  interface and flow as Git. DVC can also work stand-alone, but without
  [versioning](/doc/use-cases/versioning-data-and-models) capabilities.

- DVC codifies data and ML experiments:

  ![](/img/reproducibility.png)

- **Data versioning** is enabled by replacing large files, dataset directories,
  machine learning models, etc. with small
  [metafiles](/doc/user-guide/project-structure) (easy to handle with Git).
  These placeholders point to the original data, which is decoupled from source
  code management.

- **Data storage**: On-premises or cloud storage can be used to store the
  project's data separate from its code base. This is how data scientists can
  transfer large datasets or share a GPU-trained model with others.

- DVC makes data science projects **reproducible** by creating lightweight
  [pipelines] using implicit dependency graphs, and by codifying the data and
  artifacts involved.

- DVC is **platform agnostic**: It runs on all major operating systems (Linux,
  macOS, and Windows), and works independently of the programming languages
  (Python, R, Julia, shell scripts, etc.) or ML libraries (Keras, Tensorflow,
  PyTorch, Scipy, etc.) used in the <abbr>project</abbr>.

- **Easy to use**: DVC is quick to [install](/doc/install) and doesn't require
  special infrastructure, nor does it depend on APIs or external services. It's
  a stand-alone CLI tool.

  <admon type="info">

  Git servers, as well as SSH and cloud storage providers are supported,
  however.

  </admon>

[free]: https://github.com/iterative/dvc/blob/master/LICENSE
[vs code extension]: /doc/vs-code-extension
[command line]: /doc/command-reference
[pipelines]: /doc/user-guide/pipelines

## Comparison with Related Technologies

DVC combines a number of existing ideas into a single tool, with the goal of
bringing best practices from software engineering into the data science field.

<details>

### Git

- DVC builds upon Git by introducing the concept of data files – large files
  that should not be stored in a Git repository, but still need to be tracked
  and versioned. It leverages Git's features to enable managing different
  versions of data, data pipelines, and experiments.

- DVC is not fundamentally bound to Git, and can work without it (except
  [versioning-related](/doc/use-cases/versioning-data-and-models) features).

</details>

<details>

### Git-LFS (Large File Storage)

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

</details>

<details>

### Git-annex

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

<admon type="info">

\* ([copy-on-write](https://en.wikipedia.org/wiki/Copy-on-write)) links or
**reflinks** are a type of file linking available in modern file systems. Unlike
hard links or symlinks, editing reflinks is always safe, as the original
<abbr>cached</abbr> data will remain unchanged.

</admon>

</details>

<details>

### Git workflows such as Gitflow

- DVC enables a new experimentation methodology that integrates easily with
  standard Git workflows. For example, a separate branch can be created for each
  experiment, with a subsequent merge of the branch if the experiment is
  successful.

- DVC innovates by giving users the ability to easily navigate through past
  experiments without recomputing them each time.

</details>

<details>

### Workflow management systems

Systems to manage data pipelines and [dependency graphs] such as _Airflow_,
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

[dependency graphs]: /doc/user-guide/pipelines/defining-pipelines

</details>

<details>

### Experiment management software

> See also the [Experiment Management](/doc/user-guide/experiment-management)
> guide.

- DVC uses Git as the underlying version control layer for data, pipelines, and
  experiments. Data versions exist as metadata in Git, as opposed to using
  external databases or APIs, so no additional services are required.

- DVC doesn't need to run any services. There's no built-in GUI as a result, but
  we also have our sister project [Studio](/doc/studio) to fill that gap.

- DVC can generate images with experiment workflow visualizations.

- DVC has transparent design. <abbr>DVC files</abbr> have a human-readable
  format and can be easily reused by external tools.

</details>

<details>

### Build automation tools

[_Make_](https://www.gnu.org/software/make/) and others.

- File tracking:

  - DVC tracks files based on their hash values (MD5) instead of using
    timestamps. This helps avoid running into heavy processes like model
    retraining when you checkout a previous version of the project (Make would
    retrain the model).

  - DVC uses file timestamps and inodes\* for optimization. This allows DVC to
    avoid recomputing all dependency file hashes, which would be highly
    problematic when working with large files (multiple GB).

- DVC utilizes a [directed acyclic graph] (DAG):

  - The dependency graph is defined implicitly by the connections between
    [stages](/doc/command-reference/run), based on their
    <abbr>dependencies</abbr> and <abbr>outputs</abbr>.

  - Each stage defines one node in the DAG, and `dvc.yaml` files contain these
    stage definitions (think Makefiles). All stages (and corresponding
    processes) are implicitly combined through their inputs and outputs,
    simplifying conflict resolution during merges.

  - DVC stages can be written manually in an intuitive `dvc.yaml` file, or
    generated by the helper command `dvc run`, based on a terminal command, its
    inputs, and outputs.

> \* **Inodes** are metadata file records to locate and store permissions to the
> actual file contents. See **Linking files** in
> [this doc](http://www.tldp.org/LDP/intro-linux/html/sect_03_03.html) for
> technical details (Linux).

[directed acyclic graph]:
  /doc/user-guide/pipelines/defining-pipelines#directed-acyclic-graph-dag

</details>
