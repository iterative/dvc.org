---
name: 'Data Pipelines'
match: ['data pipeline', 'pipeline', 'pipelines']
tooltip: >-
  In DVC, a [data pipeline](/doc/user-guide/concepts/data-pipelines) is a series
  of data processing stages (for example, console commands that take an input
  and produce an output). A pipeline may produce intermediate data, and has a
  final result.
description: >-
  In DVC, a data pipeline is a series of data processing stages. A pipeline may
  produce intermediate data, and has a final result.
---

<!-- keywords: data pipeline, machine learning pipeline, devops for data science, devops for machine learning, "MLops", "what is a data pipeline?", "data pipeline examples" -->

# Data Pipelines

<!-- _from `dvc dag`_ -->

A data pipeline, in general, is a series of data processing
[stages](/doc/command-reference/run) (for example, console commands that take an
input and produce an <abbr>output</abbr>). A pipeline may produce intermediate
data, and has a final result.

Data science and machine learning pipelines typically start with large raw
datasets, include intermediate featurization and training stages, and produce a
final model, as well as accuracy [metrics](/doc/command-reference/metrics).

In DVC, pipeline stages and commands, their data I/O, interdependencies, and
results (intermediate or final) are specified in `dvc.yaml`, which can be
written manually or built using the helper command `dvc run`. This allows DVC to
restore one or more pipelines later (see `dvc repro`).

> DVC builds a dependency graph
> ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) to do this.

<!-- link to dag, pipeline get started -->
