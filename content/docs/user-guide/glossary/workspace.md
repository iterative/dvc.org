---
name: Workspace
match: [workspace]
tooltip: >-
  Directory containing all your project files e.g. raw datasets, source code, ML
  models, etc. Typically, it's also a Git repository. It will contain your DVC
  project. Learn more about the [workspace
  concept](/doc/user-guide/glossary/workspace) in DVC.
---

# Workspace

<!-- _from dvc-project tooltip_ -->

Initialized by running `dvc init` in the **workspace** (typically a Git
repository). It will contain the
[`.dvc/` directory](/doc/user-guide/dvc-files-and-directories), as well as
`dvc.yaml` and `.dvc` files created with commands such as `dvc add` or
`dvc run`.
