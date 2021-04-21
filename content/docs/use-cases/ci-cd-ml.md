# Continuous Integration and Deployment for Machine Learning

MLOps and DataOps apply DevOps methodologies to machine learning (ML) and data
management. The fields are rapidly evolving beyond a mere set of best practices,
and now encompass the entire product lifecycle management. A core component is
the automation of testing and deployment: CI/CD (continuous integration and
delivery).

CI/CD is easy to set up with practically any Git repository. Some example
scenarios are:

- Agile development
  - Automating quality assurance (QA) means teams can confidently deploy new
    versions several times a day and even before the weekend without fear of
    bugs/regressions
- Easy testing
  - When new data is pushed in a pull request (PR), validation tests
    automatically run in the cloud (without each collaborator setting up
    potentially inconsistent local testing environments)
  - When a new model is pushed in a PR, reports (on performance against the
    current deployed models) are automatically generated and posted as a PR
    comment with graphs and tables
- Continuous machine learning (CML): online training
  - Schedule regular jobs pulling in data updates from public sources to refine
    deployed models
  - Provision bare metal in the cloud and run a brute force hyperparameter
    search

In ML, CI/CD can be used to automatically build, test and push data and models
to production in the cloud with minimal effort. There are many components, such
as:

1. Data collection & storage
2. Metadata management
3. Validation & testing (including provisioning resources)
4. Sharing & deployment
5. Monitoring & feedback

Quite often, CI/CD for ML is hard to set up and debug, and solutions unclear.
DVC can alleviate most (in not all) of the
[hidden technical debt in ML](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf).

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

**Metrics (Model Validation)**: Whenever a commit changes a model, DVC can
handle running benchmarks against previously deployed models before a new one is
[released into production](/doc/use-cases/data-registries). Our sister project
[CML](https://cml.dev) provides useful tools to make this process easy --
including reporting metric changes with tables and graphs in pull request
comments.

**Schedule Updates in the Cloud**: Rather than conducting
[experiments](/doc/start/experiments) locally, DVC lets you research and refine
in the cloud. For example, CI providers allow scheduling of regular jobs. Every
day, a job could use DVC to pull in data from a regularly updated public source,
checkout a pre-existing model, and then deploy an updated model refined on the
additional data.

**Training in the Cloud**: Alternatively, DVC can be used to schedule and run an
entire hyperparameter search in the cloud!
