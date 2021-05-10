---
name: Workspace
match: [workspace]
tooltip: >-
  The directory containing all your project files, e.g., the raw data, source
  code, ML models. Typically, it's also a Git repository. It contains your DVC
  project.
---

# Workspace

A data science project can consist of data obtained from many distinct sources.
These may be split into multiple files or directories or (as the project
structure needs) have different versions for different requirements, e.g., a
smaller / simplified version might be required in prototyping for faster
feedback and shorter training times. A single workspace to manage all artifacts
of a project is desirable, although versioning needs and managing dependencies
make it increasingly difficult.

DVC allows a single directory to contain all your project artifacts. The
workspace is the directory containing the _visible_ part of your
<abbr>project</abbr>, e.g., the raw data, source code, model files. You can have
multiple versions of data, models, and other kinds of artifacts within the
workspace and limit your focus to a subset of these. You can record your
progress in a commit and analyze your data and model history. DVC provides a
_machine learning file system_ to manipulate your data and models using its
commands. No need to rename your models for minor changes, save cleaned up data
in different directories or save tens of different renamed files for training
programs. DVC can keep track of all of these in a single directory called the
workspace.

Files and directories in the workspace can be added to DVC (`dvc add`), or they
can be downloaded from external sources (`dvc get`, `dvc import`,
`dvc import-url`). Changes to the data, notebooks, models, and any related
machine learning artifact can be tracked (`dvc commit`), and their content can
be synchronized (`dvc checkout`). Tracked data can be removed (`dvc remove`)
from the workspace.

DVC supports all typical operations of a versioned data file system through its
commands. Behind the scene these operations use <abbr>metafiles</abbr> like the
`.dvc/` directory, `dvc.yaml` files or files with `*.dvc` extension to track the
content and dependencies.

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Versioning Data and Model](/doc/use-cases/versioning-data-and-model-files)
  from Use Cases
