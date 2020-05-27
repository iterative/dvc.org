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

Initialized by running `dvc init` in the **workspace** (typically in a Git
repository). It will contain the
[`.dvc/` directory](/doc/user-guide/dvc-files-and-directories) and
[DVC-files](/doc/user-guide/dvc-file-format) created with commands such as
`dvc add` or `dvc run`.
