---
name: Dependency
match: [dependency, dependencies]
---

A file or directory (possibly tracked by DVC) recorded in the `deps` section of
a DVC-file (stage file). See `dvc run`. Stages are invalidated when any of their
dependencies change.
