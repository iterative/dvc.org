---
name: Dependency
match: [dependency, dependencies]
---

A file or directory (possibly tracked by DVC) recorded in the `deps` section of
a [`dvc.yaml` file](/doc/user-guide/dvc-file-format). See `dvc run`. Stages are
invalidated when any of their dependencies change.
