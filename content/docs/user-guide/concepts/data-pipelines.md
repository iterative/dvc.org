---
name: 'Data Pipelines'
match: ['data pipeline', 'pipeline', 'pipelines']
tooltip: >-
  A [data pipeline](/doc/user-guide/concepts/data-pipelines) is a series of data
  processing stages, chained by their outputs and inputs. They use some initial
  data, may produce intermediate artifacts, and reach a final result.
description: >-
  A data pipeline is a series of data processing stages. They use some initial
  data, may produce intermediate artifacts, and reach a final result.
---

<!-- keywords: data pipeline, machine learning pipeline, devops for data science, devops for machine learning, "MLops", "what is a data pipeline?", "data pipeline examples", "machine learning (ML) workflow", "data science workflow", "data science pipeline workflow" -->

# Data Pipelines

A data pipeline, in general, is a series of data processing <abbr>stages</abbr>
like data gathering, data transformation, model training, model testing and
report <abbr>metrics</abbr> and results. A pipeline may produce intermediate
data, and has a final result. DVC allows to represent this pipeline as a
[DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) and enables to
reproduce the pipeline via `dvc repro`.

In DVC, pipeline stages and commands, their data I/O, interdependencies, and
results (intermediate or final) are specified in `dvc.yaml`, which can be
written manually or built using `dvc run`. This allows DVC to restore one or
more pipelines later (see `dvc repro`).

