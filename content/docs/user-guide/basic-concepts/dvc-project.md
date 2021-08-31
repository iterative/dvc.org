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
    repositories
  ]
tooltip: >-
  Initialized by running `dvc init` in the **workspace** (typically a Git
  repository). It will contain the `.dvc/` directory, as well as `dvc.yaml` and
  `.dvc` files created with commands such as `dvc add` or `dvc run`.  
  [More info](/doc/user-guide/basic-concepts/dvc-project)
---

# DVC Project

Initialized by running `dvc init` in your <abbr>workspace</abbr> directory, a
DVC project will contain all of the [DVC metafiles and
directories][dvc-metafiles], such as the <abbr>cache</abbr>, `dvc.yaml`, and
`.dvc` files. Any other files referenced from these DVC metafiles are also
considered part of the project (e.g.
[metrics files](/doc/command-reference/metrics)).

[dvc-metafiles]: /doc/user-guide/project-structure

> `dvc destroy` can be used to remove all DVC-specific files from the directory,
> in effect deleting the DVC project.

## DVC repository

A DVC project in a Git repository can also be called a _DVC repository_ or "the
repo". This setup enables the
[versioning features](/doc/start/data-and-model-versioning) of DVC
(recommended). Files tracked by Git are considered part of the DVC project when
referenced from DVC metafiles such as `dvc.lock`; for example source code that
is used as a <abbr>stage</abbr> command (`cmd` field in `dvc.yaml`).

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Get Started](/doc/start) with DVC
- DVC [Project Structure](/doc/user-guide/project-structure)
