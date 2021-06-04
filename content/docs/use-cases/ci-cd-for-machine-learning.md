# Continuous Integration and Deployment for Machine Learning

## DevOps

Applying DevOps methodologies to machine learning (MLOps) and data management
(DataOps) is increasingly common. This means resource orchestration
(provisioning servers), testing, and deployment to production (CI/CD --
continuous integration and continuous delivery), as well as monitoring &
feedback.

![](https://static.iterative.ai/img/ml-vs-cicd.png) _Traditional machine
learning (ML) meets CI/CD_

The main benefits of CI/CD for ML are detailed below.

### Quality Assurance (QA)

This concerns automating & enforcing testing. For example:

- Enforcing data integrity with application-specific tests (such as validation
  against a schema or verifying pipeline consistency).
- Enforcing model integrity with application-specific tests (such as
  input/output and performance validation).
- When data or code is added/changed in a pull request (PR), automatically
  running validation tests in the cloud.

### Continuous Machine Learning (CML)

This concerns training in the cloud. For example:

- Infrastructure orchestration: make CI systems provision and launch a GPU
  instance, train a model, cleanly terminate, and pull results back.
- Automatically generate performance metrics reports and post them as a PR
  comment with interactive graphs and tables.
- Fine-tune on a schedule: set up jobs to pull in new data from regularly
  updated external sources to refine deployed models.
- Run a hyperparameter search: keep heavyweight resources and big data on CI
  servers running overnight, and put your laptop to sleep.

## DVC and CML

<img src="https://static.iterative.ai/logo/dvc.svg" alt="DVC" width="24px" style="vertical-align: text-top"/> +
<img src="https://static.iterative.ai/logo/cml.svg" alt="CML" width="24px" style="vertical-align: text-top"/>
= ❤️

Normally, CI/CD is hard to set up, configure, and maintain -- especially for
data and ML pipelines. DVC can alleviate most (in not all) of the
[hidden technical debt in ML](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf).
Advantages include:

1. Automating all of the above (embracing agile development so you can
   confidently package, deploy and deliver new versions several times a day --
   and even before the weekend -- without fear of bugs/regressions).
2. Not needing any additional config (using pre-existing infrastructure;
   providing abstraction/codification, and requiring no databases or external
   services).

Here are a few feature highlights:

**Models, Data, and Metrics as Code**: DVC removes the need to manage databases
or write bespoke code to read and write to such databases. Instead, DVC works
alongside Git to manage data files and folders as painlessly as code.

**Data Validation**: It is common practice for tests to be triggered each time a
code change is pushed to a repository branch. DVC can be used in a similar
manner to checkout
[different data versions](/doc/use-cases/versioning-data-and-model-files) for
the purposes of testing and running sanity checks. Mistakes can be caught
automatically without requiring contributors to set up complicated tests
locally.

**Metrics (Model Validation)**: Whenever a change is committed, DVC can check
that the pipeline (including data, parameters, code, and metrics) is up to date,
thereby ensuring that Git commits and model artefacts are in sync. DVC can also
run benchmarks against previously deployed models before a new one is
[released into production](/doc/use-cases/data-registries). Our sister project
[CML](https://cml.dev) provides useful tools to make this process easy --
including reporting metric changes with tables and graphs in pull request
comments.

**Refine in the Cloud**: Rather than frequently updating models locally (e.g.
based on new data from regular feeds), DVC and CML let you refine in the cloud.
For example, CI providers allow scheduling of regular jobs. Every day, a job
could use CML to provision a GPU server on which DVC will pull in data from a
regularly updated source, checkout a pre-existing model, and then deploy an
updated model refined on the additional data.

**Experiment in the Cloud**: Alternatively, DVC and CML can be used to do
research and run [experiments](/doc/start/experiments) in the cloud -- such as
an entire hyperparameter search!
