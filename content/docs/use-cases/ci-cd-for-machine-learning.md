# Continuous Integration and Deployment for Machine Learning

MLOps/DataOps apply DevOps methodologies to machine learning (ML) and data
management. This means automating resource orchestration, testing and deployment
(CI/CD -- continuous integration and continuous delivery), as well as monitoring
and feedback.

In ML, CI/CD can be used to automatically build, test and push data and models
to production in the cloud with minimal effort. Benefits include:

- Automating & enforcing testing and quality assurance (QA)
  - When data or code is added or changed in a pull request (PR), validation
    tests automatically run in the cloud
  - Agile development: automating QA means teams can confidently package, deploy
    and deliver new versions several times a day and even before the weekend
    without fear of bugs/regressions
- Continuous machine learning (CML): training in the cloud
  - Infrastructure orchestration: make CI systems provision and launch a GPU
    instance, train a model, cleanly terminate, and pull results back
  - Run a hyperparameter search: keep heavyweight resources and big data on CI
    servers running overnight, and put your laptop to sleep
  - Fine-tune on a schedule: set up jobs to pull in new data from regularly
    updated external sources to refine deployed models
  - Automatically generate performance metrics reports and post them as a PR
    comment with interactive graphs and tables

![](https://static.iterative.ai/img/ci-cd-ml.png)

Quite often, CI/CD for ML is hard to set up and debug, and solutions unclear.
DVC and CML provide lightweight tools that can work on any infrastructure (such
as AWS, GitHub Actions, or Bitbucket piplelines) by managing data, models, and
code together.

![](https://static.iterative.ai/img/git-dvc-cml.png)

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
based on new data from regular feeds), DVC lets you refine in the cloud. For
example, CI providers allow scheduling of regular jobs. Every day, a job could
use DVC to pull in data from a regularly updated source, checkout a pre-existing
model, and then deploy an updated model refined on the additional data.

**Experiment in the Cloud**: Alternatively, DVC can be used to do research and
run [experiments](/doc/start/experiments) in the cloud -- such as an entire
hyperparameter search!
