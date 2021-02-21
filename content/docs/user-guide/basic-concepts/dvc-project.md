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
  directory. It contains all <abbr>metafiles</abbr> related to project and also
  includes the underlying <abbr>cache</abbr>.
  [📖](/doc/user-guide/basic-concepts/dvc-project)
---

# DVC Project

A DVC project (or DVC repository) is a directory initialized by `dvc init`. It
contains [`.dvc` directory](/doc/user-guide/project-structure/internal-files),
`dvc.yaml` files that describe <abbr>pipelines</abbr> and `*.dvc` files for each
tracked data file. Files in <abbr>remotes</abbr> and <abbr>cache</abbr>, and
files like <abbr>metrics</abbr> and <abbr>plots</abbr> produced by DVC are also
considered part of the project.

Although it can used without a standard VCS or with alternative VCS's, a DVC
project _usually_ has a `.git` directory along with a `.dvc` directory. A DVC
project can be called a DVC repository to emphasize the presence of underlying
VCS. In most of the cases DVC project and DVC repository are synonyms.

_User facing_ part of a DVC project is referred as the <abbr>workspace</abbr>. A
DVC project can be considered as a superset of workspace.

`dvc root` returns the root directory of DVC project. As `dvc init` is used to
initialize a DVC project, `dvc destroy` can be used to remove all DVC related
<abbr>metafiles</abbr> from a directory.

## Further Reading

- [Project Structure](/doc/user-guide/project-structure/)
- `dvc init` command reference for initializing the project
- `dvc root` for relative path of a DVC project to be used in automation
- `dvc destroy` for deleting DVC related files from a directory
