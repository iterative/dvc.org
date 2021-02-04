---
name: 'Parameter Dependency'
match: [parameter, parameters, param, params, hyperparameter, hyperparameters]
---

<abbr>Pipeline</abbr> <abbr>stages</abbr> (defined in `dvc.yaml`) can depend on
specific values inside an arbitrary YAML, JSON, TOML, or Python file
(`params.yaml` by default). Stages are invalid (considered outdated) when any
of their parameter values change. See `dvc param`.
