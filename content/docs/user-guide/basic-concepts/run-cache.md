---
name: 'Run-cache'
match: ['run-cache']
---

The DVC run-cache is a log of stages that have been run in the project. It's
comprised of `dvc.lock` file backups, identified as combinations of
dependencies, commands, and outputs that correspond to each other. `dvc repro`
and `dvc run` populate and reutilize the run-cache. See
[Run-cache](/doc/user-guide/project-structure/internal-files#run-cache) for more
details.
