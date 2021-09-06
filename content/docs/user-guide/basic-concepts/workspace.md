---
name: Workspace
match: [workspace]
tooltip: >-
  Directory containing all your DVC project files, e.g. raw data, source code,
  ML models. One project version at a time is visible in the workspace.  
  [More info](/doc/user-guide/basic-concepts/workspace)
---

# Workspace

Setting up an effective data science project structure can be challenging. Do
you organize ML models in nested directory trees, link large datasets from
different locations, identify variations with ad hoc filename conventions?
Adding versioning needs and dependency management can easily turn this near
impossible.

A <abbr>DVC project</abbr> structure is simplified by encapsulating
[data versioning](/doc/start/data-and-model-versioning) and
[pipelining](/doc/start/data-pipelines) (e.g. machine learning workflows), among
other features. This leaves a _workspace_ directory with a clean view of your
working raw data, source code, data artifacts, etc. and a few
[metafiles](/doc/user-guide/project-structure) that enable these features. A
single version of the project is visible at a time.

> The DVC workspace is analogous to the
> [working tree](https://git-scm.com/docs/gitglossary#def_working_tree) in Git.

Files and directories in the workspace can be added to DVC (`dvc add`), or they
can be downloaded from external sources (`dvc get`, `dvc import`,
`dvc import-url`). Changes to the data, notebooks, models, and any related
machine learning artifact can be tracked (`dvc commit`), and their content can
be synchronized (`dvc checkout`). Tracked data can be removed (`dvc remove`)
from the workspace.

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Get Started](/doc/start) with DVC
- DVC [Project Structure](/doc/user-guide/project-structure)
