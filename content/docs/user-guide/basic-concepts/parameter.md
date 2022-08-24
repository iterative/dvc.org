---
name: 'Parameter Dependency'
match: [parameter, parameters, param, params, hyperparameter, hyperparameters]
tooltip: >-
  Pipeline stages (defined in `dvc.yaml`) can depend on specific values inside
  an arbitrary YAML 1.2, JSON, TOML 1.0, or Python file (`params.yaml` by
  default). Stages are invalid (considered outdated) when any of their parameter
  values change. [Learn
  more](/doc/user-guide/data-pipelines/defining-pipelines#parameter-dependencies).
---
