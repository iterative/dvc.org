# Continuous Integration and Deployment for Machine Learning

MLOps and DataOps apply DevOps methodologies to machine learning (ML) and data
management. The fields are rapidly evolving beyond a mere set of best practices,
and now encompass the entire product lifecycle management. A core component is
the automation of testing and deployment: CI/CD (continuous integration and
continuous delivery).

CI/CD is easy to set up with practically any Git repository. Some example
scenarios are:

- Easy testing and quality assurance (QA)
  - When new data is pushed in a pull request (PR), validation tests
    automatically run in the cloud (without each collaborator setting up
    potentially inconsistent local testing environments)
  - Agile development: automating QA means teams can confidently deploy new
    versions several times a day and even before the weekend without fear of
    bugs/regressions
- Continuous machine learning (CML): training in the cloud
  - Infrastructure orchestration: provision hardware in the cloud
  - Run a hyperparameter search
  - Schedule regular jobs pulling in new data from regularly updated external
    sources to refine deployed models
  - Automatically generate performance metrics reports and post them as a PR
    comment with interactive graphs and tables

In ML, CI/CD can be used to automatically build, test and push data and models
to production in the cloud with minimal effort. There are many components, such
as:

1. Data collection & storage
2. Metadata management
3. Validation & testing (including provisioning resources)
4. Sharing & deployment
5. Monitoring & feedback

Quite often, CI/CD for ML is hard to set up and debug, and solutions unclear.
DVC provides lightweight tools that can work on any infrastructure and alleviate
[hidden technical debt](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
by managing data, models, and code together.

**Data as Code**: DVC removes the need to manage databases or write bespoke code
to read and write to such databases. Instead, DVC works alongside Git to manage
data files and folders as painlessly as code.

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
