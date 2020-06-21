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
repository). It will contain the
[`.dvc/` directory](/doc/user-guide/dvc-files-and-directories), as well as
[`dvc.yaml`](/doc/user-guide/dvc-files-and-directories#dvcyaml-file) and
[`.dvc`](/doc/user-guide/dvc-files-and-directories#dvc-files) files created with
commands such as `dvc add` or `dvc run`.
