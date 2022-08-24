---
name: 'Parameter Dependency'
match: [parameter, parameters, param, params, hyperparameter, hyperparameters]
tooltip: >-
  Pipeline stages (defined in `dvc.yaml`) can depend on specific values inside a
  structured file (`params.yaml` by default). Stages are invalid (considered
  outdated) when any of their parameter values change. See `dvc params`.
---
