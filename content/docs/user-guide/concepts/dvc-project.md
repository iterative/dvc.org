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
  A DVC project is a directory initialized by `dvc init` that contains a `.dvc`
  directory.
---

# DVC Project

A DVC project (or DVC repository) is a directory initialized by `dvc init`. It
contains [`.dvc` directory](/doc/user-guide/project-structure/internal-files),
`dvc.yaml` files possible in multiple directories that describes
<abbr>pipelines</abbr> and `.dvc` files for each tracked data file. `dvc root`
returns the root of DVC project.

Although it can used without a standard VCS or with alternative VCS's, a DVC
project _usually_ has a `.git` directory along with a `.dvc` directory.

When we talk about DVC project apart from <abbr>workspace</abbr>, we mean all
artifacts of the project including those in <abbr>remotes</abbr> and
<abbr>cache</abbr>.

## Further Reading

- [Project Structure](/doc/project-structure/)
- `dvc add` command reference for data file tracking
- `dvc run` command reference for pipelines.
