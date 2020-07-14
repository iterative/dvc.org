---
name: Dependency
match: [dependency, dependencies]
---

A file or directory (possibly tracked by DVC) recorded in the `deps` section of
a stage (in `dvc.yaml`) or
[`.dvc` file](/doc/user-guide/dvc-files-and-directories#dvc-files) file. See
`dvc run`. Stages are invalidated when any of their dependencies change.
