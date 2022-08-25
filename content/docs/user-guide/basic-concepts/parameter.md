---
name: 'Parameters'
match: [parameter, parameters]
tooltip: >-
  Project code can depend on simple values loaded from a a structured file
  (`params.yaml` by default). DVC can track them as granular dependencies for
  pipeline stages (defined in `dvc.yaml`). These are especially useful for
  machine learning hyperparameter tuning. See `dvc params`.
---
