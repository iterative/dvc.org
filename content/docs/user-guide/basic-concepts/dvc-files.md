---
name: DVC File
match: ['dvc files', 'dvc file']
---

A file used by DVC to track
[versioning](/doc/use-cases/versioning-data-and-model-files) and
[pipeline](/doc/command-reference/dag) relationships. Commands like `dvc add`
and `dvc repro` create and modify these files. 

Typically these files have a `.dvc` extension or named as `dvc.yaml` and `dvc.lock`.

