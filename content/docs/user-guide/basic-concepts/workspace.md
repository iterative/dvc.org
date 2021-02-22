---
name: Workspace
match: [workspace]
tooltip: >-
  Directory containing all your project files e.g. raw datasets, source code, ML
  models, etc. Typically, it's also a Git repository. It will contain your DVC
  project.
---

# Workspace

A data science project consists of data obtained from many different sources.
This data may be split into multiple files or directories or (as the project
structure needs) have different versions for different requirements. e.g. A
smaller / simplified version might be required in prototyping for faster
feedback and shorter training times. A single workspace to manage all artifacts
of a project is desirable, although versioning needs and managing dependencies
make it increasingly complex.

DVC allows a single directory to contain all your project artifacts. The
workspace is the directory containing _visible_ part of your
<abbr>project</abbr> e.g. raw data, source code, model files. You can have
multiple versions of data, models and other kinds of artifacts within the
workspace and limit your focus to a subset of these, then record your progress
in a commit and move along your data and model history. DVC provides a _machine
learning file system_ to manipulate your data and models using its commands. No
need to keep different artifact versions in different directories, under
different names, without any semantic relation among them. Instead DVC is able
to link your data and models and can show the evolution, progress and
interrelationships.

Files and directories in the workspace can be added to DVC (`dvc add`) or they
can be downloaded from external sources (`dvc get`, `dvc import`,
`dvc import-url`). Changes to the data, notebooks, models, and any related
machine learning artifact can be tracked (`dvc commit`) and versioned in Git
(`dvc checkout`). They can be removed (`dvc remove`) from the workspace.
<abbr>Pipelines</abbr> and <abbr>dependencies</abbr> between them can be
defined. Data and model files can be moved to the cloud and retrieved when
necessary (`dvc push`, `dvc pull`). DVC supports all typical operations of files
and directories of a file system through its commands.

Behind the scene these operations of a <abbr>DVC project</abbr> uses
<abbr>metafiles</abbr> like the `.dvc/` directory, `dvc.yaml` or files with
`*.dvc` extension to track the content and dependencies.

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Versioning Data and Model](/doc/use-cases/versioning-data-and-model-files)
  from Use Cases
