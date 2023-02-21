---
name: 'Parameters'
match: [parameter, parameters]
tooltip: >-
  Hyperparameters or other config values used by your code, loaded from a a
  structured file (`params.yaml` by default). They can be tracked as granular
  dependencies for stages of DVC pipelines (defined in `dvc.yaml`). DVC can also
  compare them among machine learning experiments (useful for optimization). See
  `dvc params`.
---
