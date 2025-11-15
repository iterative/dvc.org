---
name: 'Run cache'
match: ['run cache']
tooltip: >-
  A log of stages that have been run in the project. It's comprised of
  `dvc.lock` file backups, identified as combinations of dependencies, commands,
  and outputs that correspond to each other. `dvc repro` and `dvc exp run`
  populate and reutilize the run cache. See [Run
  cache](/user-guide/pipelines/run-cache) for more details.
---
