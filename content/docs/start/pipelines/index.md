---
title: 'Get Started: Data Pipelines'
description: 'Learn how to build and use DVC pipelines to capture, organize,
version, and reproduce your data science and machine learning workflows.'
---

# Get Started: Data Pipelines

Versioning large data files and directories for data science is great, but not
enough. How is data filtered, transformed, or used to train ML models? DVC
introduces a mechanism to capture _data pipelines_ — series of data processes
that produce a final result.

DVC pipelines and their data can also be easily versioned (using Git). This
allows you to better organize projects, and reproduce your workflow and results
later — exactly as they were built originally! For example, you could capture a
simple ETL workflow, organize a data science project, or build a detailed
machine learning pipeline.

Watch and learn, or follow along with the code example below!

https://youtu.be/71IGzyH95UY

DVC pipelines (`dvc.yaml` file, `dvc stage add`, and `dvc repro` commands) solve
a few important problems:

- _Automation_: run a sequence of steps in a "smart" way which makes iterating
  on your project faster. DVC automatically determines which parts of a project
  need to be run, and it caches "runs" and their results to avoid unnecessary
  reruns.
- _Reproducibility_: `dvc.yaml` and `dvc.lock` files describe what data to use
  and which commands will generate the pipeline results (such as an ML model).
  Storing these files in Git makes it easy to version and share.
- [_Continuous Delivery and Continuous Integration (CI/CD) for ML_](/doc/use-cases/ci-cd-for-machine-learning):
  describing projects in way that can be reproduced (built) is the first
  necessary step before introducing CI/CD systems. See our sister project
  [CML](https://cml.dev) for some examples.

- [**Add stages**](/doc/start/pipelines/add-stages): How to add a stage to your
  pipeline.
- [**Run stages**](/doc/start/pipelines/run-stages): Run the pipeline
- [**Defining pipeline graph**](/doc/start/pipelines/dag): Define a Directed
  Acyclic Graph for your workflow.
- [**Change (hyper)parameters to run the pipeline (again)**](/doc/start/pipelines/change-params):
  Run only the affected portion of pipeline when you change dependencies.
- [**Visualize the pipeline graph**](/doc/start/pipelines/visualize): Visualize
  the pipeline on (text) terminal.
