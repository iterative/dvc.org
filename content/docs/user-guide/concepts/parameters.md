---
name: Parameters
match: [parameter, parameters, param, params, hyperparameter, hyperparameters]
tooltip: >-
  In DVC, parameters and hyperparameters associated with machine learning
  experiments and data science projects can be tracked as dependencies in a data
  pipeline. [📖](/doc/user-guide/concepts/parameters)
description: >-
  In DVC, parameters and hyperparameters associated with machine learning
  experiments and data science projects can be tracked as dependencies in a data
  pipeline.
---

<!-- keywords: machine learning parameter tracking, data science project parameters, experiment parameter tracking, data pipeline parameter stage, "what is a parameter", deep learning experiment tracking -->

A machine learning / data science project is usually needs parameters to alter
behavior of models under development. DVC allows to set these parameters in a
central location.

<abbr>Stages</abbr> that depend on these values become invalid when any of the
parameters changes. It enables to run only stages which are affected by a
parameter and keep others intact when running experiments.

Parameters are <abbr>dependencies</abbr> like data file/directories but they are
stored centrally in a file (`params.yaml` by default) and their invalidation
depends on value changes. Parameter files are text files that can be checked in
to Git like any other file. DVC allows to write or generate parameter files with
any text editor. Parameters themselves can be of strings, integers, floats or
arrays.

Parameter files are used to define stage invalidation. They are **not** passed
to the commands that run experiments. Program files that train/evaluate/run
experiments should read parameter files themselves.

## Further Reading

- `dvc params` command reference.
