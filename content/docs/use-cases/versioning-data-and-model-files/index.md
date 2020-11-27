# Versioning Data and Models

Data science teams face data management questions around versions of data and
machine learning models. How do we keep track of changes in data, source code,
and ML models together? What's the best way to organize and store variations of
these files and directories?

![](/img/data-ver-complex.png) _Exponential complexity of data science projects_

Another problem in the field has to do with bookkeeping: being able to identify
past research inputs and processes to understand results, for knowledge sharing,
or for debugging. There's also the matter of defining and enforcing data
lifecycles.

**Data Version Control** (DVC) helps you organize data and models effectively,
and capture their versions with
[Git commits](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository).
It supports data _versioning through codification_: describing which datasets,
ML artifacts, etc. should be in the <abbr>workspace</abbr> at any given time.
DVC also provides mechanisms to cache different data contents, and to switch
between their versions.

![](/img/project-versions.png) _DVC matches the right versions of data to the
rest of your project._

This is achieved with special
[metafiles](/doc/user-guide/dvc-files-and-directories) that can be put in Git
instead of the actual data. And by storing unique data versions (no file
duplication) separate from the workspace.

The result is a single immutable history for data, code, models, etc., like an
experiments journal. This makes the project fully _reproducible_:
[Restore](/doc/command-reference/checkout) any project version and find the
corresponding data instantly. And at the same time, the data stays with you —
free from the storage constraints of Git repos and
[hosting](https://docs.github.com/en/free-pro-team@latest/github/managing-large-files/what-is-my-disk-quota).

> To learn how it looks and feels, try the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
> 👩‍💻. And there are many other [guides](/doc/user-guide) and
> [references](/doc/command-reference) that explain DVC in more detail.

These are the benefits of our approach:

- **Lightweight**: DVC is a
  [free](https://github.com/iterative/dvc/blob/master/LICENSE), open-source
  [command line](/doc/command-reference) tool that doesn't require databases or
  servers.

- **Consistency**: Keep your projects readable with stable file names (which can
  contain variable data). No need for complicated paths like
  `data/20190922/labels_v7_final` or for constantly editing them in source code.

- **Efficient data management**: Use a cost-effective on-premises or cloud
  storage of your choice for your data and ML models. DVC
  [optimizes](/doc/user-guide/large-dataset-optimization) their storage and
  transfers.

- **Collaboration**: Easily share project data
  [internally](/doc/use-cases/shared-development-server) or
  [remotely](/doc/use-cases/sharing-data-and-model-files), or
  [reuse](/doc/start/data-access) it elsewhere.

- **Data compliance**: Review data modification attempts as Git
  [pull requests](https://www.dummies.com/web-design-development/what-are-github-pull-requests/).
  Audit this process later to learn when data or model versions were approved,
  and why.

- **GitOps**: Connect your data science projects with the Git-powered universe.
  Git workflows open the door to advanced tools such as continuous integration
  (like [CML](https://cml.dev/) CI/CD), specialized patterns such as
  [data registries](/doc/use-cases/data-registries), and other best practices.

In summary, data science and machine learning are iterative processes where the
lifecycles of data, models, and code happen at different paces. DVC helps
integrate and manage them effectively. There are other things that DVC can do
