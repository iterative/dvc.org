---
name: Output
match: [output, outputs]
---

A file or directory tracked by DVC, recorded in the `outs` section of a stage
(in `dvc.yaml`) or
[`.dvc` file](/doc/user-guide/dvc-files-and-directories#dvc-files). Outputs are
usually the result of stages. See `dvc add`, `dvc run`, `dvc import`, et al.
A.k.a. _data artifact_
