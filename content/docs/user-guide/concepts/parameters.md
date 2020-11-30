---
name: Parameters
match: [parameter, parameters, param, params, hyperparameter, hyperparameters]
tooltip: >-
  Pipeline stages (defined in `dvc.yaml`) can depend on specific values inside
  an arbitrary YAML, JSON, TOML, or Python file (`params.yaml` by default).
  Stages are invalidated when any of their
  [parameter](/doc/user-guide/concepts/parameters) values change. See `dvc
  param`.
---

# Parameters

Pipeline stages (defined in `dvc.yaml`) can depend on specific values inside an
arbitrary YAML, JSON, TOML, or Python file (`params.yaml` by default). Stages
are invalidated when any of their parameter values change. See `dvc param`.
