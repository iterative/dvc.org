---
name: Dependency
match: [dependency, dependencies, depends, input]
tooltip: >-
  A file or directory (possibly tracked by DVC) recorded in the `deps` section
  of a stage (in `dvc.yaml`) or `.dvc` file file. Stages are invalidated
  (considered outdated) when any of their dependencies change. See `dvc stage
  add`, `dvc params`, `dvc repro`, among others.
---
