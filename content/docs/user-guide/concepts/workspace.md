---
name: Workspace
match: [workspace]
tooltip: >-
  The workspace is the _user visible_ part of the directory containing all your
  project files e.g. raw datasets, source code, ML models, etc.
  [📖](/doc/user-guide/concepts/workspace)
description: >-
  The workspace is the directory containing all your project files e.g. raw
  datasets, source code, ML models, etc. Typically, it's also a Git repository.
---

<!-- keywords: data science project architecture, machine learning project architecture, machine learning workflow, data science workflow, machine learning file system, data science file system, data science project structure, machine learning project structure, notebook version control -->

# Workspace

The workspace is the _user visible_ part of the directory that contains all your
project files e.g. raw datasets, source code, ML models, etc. Users work in this
directory with links of the data/model files that reside in <abbr>cache</abbr>
and manipulate the contents through DVC commands.

Files and directories in the workspace can be added to DVC (`dvc add`) or they
can be downloaded from external sources (`dvc get`, `dvc import`,
`dvc import-url`), changes to them can be tracked (`dvc commit`),
<abbr>pipelines</abbr> and <abbr>dependencies</abbr> between them can be defined
(`dvc run`), they can be sent to or retrieved from <abbr>remotes</abbr>
(`dvc push`, `dvc pull`) and can be removed (`dvc remove`, `dvc gc`) from the
workspace. DVC supports all typical operations of files and directories through
its commands.

Behind the scene these operations of a <abbr>DVC project</abbr> uses
<abbr>metafiles</abbr> to track the content and dependencies.

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Versioning Data and Model](/doc/use-cases/versioning-data-and-model-files)
  from Use Cases
