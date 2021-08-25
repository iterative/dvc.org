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
  See full [concept page](/doc/user-guide/basic-concepts/workspace).
---

# DVC Project

Initialized by running `dvc init` in a directory, it will contain all the
[DVC files and directories](/doc/user-guide/dvc-files-and-directories),
including the <abbr>cache</abbr>, `dvc.yaml` and `.dvc` files, etc. Any other
files referenced from special DVC files are also considered part of the project
(for example [metrics files](/doc/command-reference/metrics)).

> `dvc destroy` can be used to remove all DVC-specific files from the directory,
> in effect deleting the DVC project.

## DVC repository

<abbr>DVC project</abbr> initialized in a Git repository. This enables the
versioning features of DVC (recommended). Files tracked by Git are considered
part of the DVC project when referenced from special DVC files such as
`dvc.lock`, for example source code that is used as a stage
<abbr>dependency</abbr>.

## Further Reading

- [What is DVC?](/doc/user-guide/what-is-dvc)
- [Get Started](/doc/start) with DVC
- DVC [Project Structure](/doc/user-guide/project-structure)
