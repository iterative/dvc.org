---
name: Workspace
match: [workspace]
tooltip: >-
  The [workspace](/doc/user-guide/concepts/workspace) is the directory
  containing all your project files e.g. raw datasets, source code, ML models,
  etc. Typically, it's also a Git repository. It will contain your DVC project.
---

# Workspace

The workspace is the directory containing all your project files e.g. raw
datasets, source code, ML models, etc. Typically, it's also a Git repository. It
will contain your DVC project.

<!-- _"External dependencies, outputs, and cache are the exception to the rule."_ -->

<!-- _from dvc-project tooltip_ -->

Initialized by running `dvc init` in the **workspace** (typically a Git
repository). It will contain the
[`.dvc/` directory](/doc/user-guide/dvc-files-and-directories), as well as
`dvc.yaml` and `.dvc` files created with commands such as `dvc add` or
`dvc run`.

## What's the difference between workspace and project?

<!-- _Relationship between workspace, cache, remote_ -->

## Things you can do in the Workspace

`dvc init` to create a DVC project...
