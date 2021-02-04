---
name: 'Pipeline'
match: ['pipeline', 'pipelines']
---

A Machine Learning / Data Science project is considered as a pipeline where the
data gathering, data transformation, model training and reporting are various
<abbr>stages</abbr> that make up the steps. DVC allows to represent this
pipeline with all its inputs and outputs.

A pipeline is created by defining its stages in `dvc.yaml` or via `dvc run`
command.
