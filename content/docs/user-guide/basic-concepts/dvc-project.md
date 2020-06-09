---
name: 'DVC Project'
match:
  [
    'DVC project',
    'DVC projects',
    project,
    projects,
    'DVC repository',
    'DVC repositories',
    repository,
    repositories,
  ]
---

Initialized by running `dvc init` in the **workspace** (typically a Git
repository). It will contain the `.dvc/` directory and other
[special DVC files](/doc/user-guide/dvc-files-and-directories) created with
commands such as `dvc add` or `dvc run`.
