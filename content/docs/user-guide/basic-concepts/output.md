---
name: Output
match: [output, outputs]
---

A file or directory tracked by DVC, recorded in the `outs` section of a
[`dvc.yaml` file](/doc/user-guide/dvc-file-format) or [`.dvc` file](/doc/user-guide/dvc-file-format). Outputs are usually the result of stages. See
`dvc add`, `dvc run`, `dvc import`, et al. A.k.a. _data artifact_
