---
name: Workspace
match: [workspace]
tooltip: >-
  Directory containing all your project files e.g. raw datasets, source code, ML
  models, etc. Typically, it's also a Git repository. It will contain your DVC
  project.
---

<!-- keywords: data science project architecture, machine learning project architecture, machine learning workflow, data science workflow, machine learning file system, data science file system, data science project structure, machine learning project structure, notebook version control -->

# Workspace

A data science project consists of data obtained from many different sources.
This data may be split into multiple files or directories or (as the project
structure needs) have different versions for different requirements. e.g. A
smaller / simplified version might be required in prototyping for faster
feedback and shorter training times. A single workspace to manage all artifacts
of a project is desirable, although versioning needs and managing dependencies
make it increasingly complex.

DVC allows a single directory to contain all your project artifacts. In the
documentation the workspace is the _user visible_ part of the directory that
contains all your <abbr>project</abbr> files e.g. raw datasets, source code, ML
models, etc. Users work in this directory using their data and model files that
and manipulate the contents through DVC commands.

Files and directories in the workspace can be added to DVC (`dvc add`) or they
can be downloaded from external sources (`dvc get`, `dvc import`,
`dvc import-url`). Changes to the files, directories, notebooks, models and in
general machine learning file system can be tracked (`dvc commit`).
<abbr>Pipelines</abbr> and <abbr>dependencies</abbr> between them can be defined
(`dvc run`). Data and model files can be sent to or retrieved from
<abbr>remotes</abbr> (`dvc push`, `dvc pull`) and can be removed (`dvc remove`,
`dvc gc`) from the workspace. DVC supports all typical operations of files and
directories of a file system through its commands.

Behind the scene these operations of a <abbr>DVC project</abbr> uses
<abbr>metafiles</abbr> to track the content and dependencies.

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Versioning Data and Model](/doc/use-cases/versioning-data-and-model-files)
  from Use Cases
