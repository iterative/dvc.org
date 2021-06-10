# Continuous Integration and Deployment for Machine Learning

Applying DevOps methodologies to machine learning (MLOps) and data management
(DataOps) is increasingly common. This means resource orchestration
(provisioning servers), testing, and deployment to production (CI/CD --
continuous integration and continuous delivery), as well as monitoring &
feedback.

![](https://static.iterative.ai/img/ml-pipeline.png) _Basic ML pipeline_

The main benefits of CI/CD for ML are detailed below.

### Automating Quality Assurance (QA)

This concerns automating & enforcing testing. For example:

- Enforcing data integrity with application-specific tests (such as validation
  against a schema or verifying pipeline consistency).
- Enforcing model integrity with application-specific tests (such as
  input/output and performance validation).
- When data or code is added/changed in a pull request (PR), automatically
  running validation tests in the cloud.
- Automatically generate metrics reports.

### Continuous Machine Learning (CML)

This concerns training in the cloud. For example:

- Infrastructure orchestration: make CI systems provision and launch a GPU
  instance, train a model, cleanly terminate, and pull results back.
- Fine-tune on a schedule: set up jobs to pull in new data from regularly
  updated external sources to retrain/refine deployed models.
- Run a hyperparameter search: keep heavyweight resources and big data on CI
  servers running overnight, and put your laptop to sleep.

## Helpful Tools

Normally, CI/CD is hard to set up, configure, and maintain -- especially for
data and ML pipelines.

![](https://static.iterative.ai/img/ml-vs-cicd.png) _Traditional ML meets CI/CD_

DVC and CML can alleviate most (in not all) of the management headache
([hidden technical debt](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf))
in ML. You can automate all of the above without needing any additional
configuration. Here are a few feature highlights:

**Models, Data, and Metrics as Code**: DVC removes the need to manage databases,
use special file/folder structures, or write bespoke interfacing code. Instead,
DVC works alongside Git to manage data files and folders as painlessly as code.

**Low friction**: Our sister project [CML](https://cml.dev) provides lightweight
machine resource orchestration that lets you use pre-existing infrastructure.
DVC and CML both provide abstraction/codification and require no external
services.

**Data Validation**: It is common practice for tests to be triggered each time a
code change is pushed to a repository branch. DVC can be used in a similar
manner to checkout
[different data versions](/doc/use-cases/versioning-data-and-model-files) for
the purposes of testing and running sanity checks. Mistakes can be caught
automatically without requiring contributors to set up complicated tests
locally. Instead, embrace agile development so you can confidently package,
deploy and deliver new versions several times a day -- and even before the
weekend -- without fear of bugs/regressions.

**Metrics (Model Validation)**: Whenever a change is committed, DVC can check
that the pipeline (including data, parameters, code, and metrics) is up to date,
thereby ensuring that Git commits and model artefacts are in sync. DVC can also
run benchmarks against previously deployed models before a new one is
[released into production](/doc/use-cases/data-registries).
[CML](https://cml.dev) provides useful tools to make this process easy --
including reporting metric changes with interactive graphs and tables in pull
request comments.

**Refine in the Cloud**: Rather than frequently updating models locally (e.g.
based on new data from regular feeds), DVC and CML let you retrain/refine in the
cloud. For example, CI providers allow scheduling of regular jobs. Every day, a
job could use CML to provision a GPU server on which DVC will pull in data from
a regularly updated source, checkout a pre-existing model, and then deploy an
updated model refined on the additional data.

**Experiment in the Cloud**: Alternatively, DVC and CML can be used to do
research and run [experiments](/doc/start/experiments) in the cloud -- such as
an entire hyperparameter search!

<img src="https://static.iterative.ai/logo/dvc.svg" alt="DVC" width="24px" style="vertical-align: text-top"/> +
<img src="https://static.iterative.ai/logo/cml.svg" alt="CML" width="24px" style="vertical-align: text-top"/>
= ❤️
