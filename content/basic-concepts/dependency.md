---
name: Dependency
match: [dependency, dependencies, depends, input]
tooltip: >-
  A file (e.g. data, code), directory (e.g. datasets), or parameter used as
  input for a stage in a DVC pipeline. These are specified as paths in the
  `deps` field of `dvc.yaml` or `.dvc` files. Stages are invalidated (considered
  outdated) when any of their dependencies change. See `dvc stage add`, `dvc
  params`, `dvc repro`.
---
