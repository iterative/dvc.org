---
name: 'Parameter Dependency'
match: [parameter, parameters, param, params, hyperparameter, hyperparameters]
tooltip: >-
  Pipeline stages (defined in `dvc.yaml`) can depend on specific values inside
  an arbitrary YAML, JSON, TOML, or Python file (`params.yaml` by default).
  Stages are invalid (considered outdated) when any of their parameter values
  change. See [`dvc params`](/doc/command-reference/params).
---
