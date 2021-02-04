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

A DVC project (or DVC repository) is a directory initialized by `dvc init`. It
contains [`.dvc/` directory](/doc/user-guide/project-structure/internal-files),
`dvc.yaml` file that describes <abbr>pipeline</abbr> and `.dvc` files for each
tracked data file. See `dvc add` for data file tracking and `dvc run` for
pipelines.
