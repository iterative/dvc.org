# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, source code, and ML models together? What's the best way to
organize and store multiple versions of data and model files? How can data
lifecycles be defined and enforced?

![](/img/data-ver-complex.png) _Exponential complexity of data science projects_

Data Version Control (DVC) addresses these issues by helping you organize data
and models effectively. It lets you capture their versions with
[Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>),
without putting the actual data in the repo. You can have a single immutable
history for all assets and data artifacts.

Unique data versions are stored automatically (preventing file duplication), so
the data stays with you. Additionally, file names don't need to change in DVC,
because they
[link](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
to those variable contents. Now the data can be modified without worrying about
code.

![](/img/project-versions.png) _DVC matches the right versions of code and
data._

DVC enables data _versioning through codification_. This means describing which
data, ML artifacts, etc. should be in the environment at any given time. This is
achieved with special [metafiles](/doc/user-guide/dvc-files-and-directories)
that can be put in Git.

We won't go much deeper into how DVC works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that. You
can also try our
[versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
👩‍💻 to learn how it looks and feels. These are the high-level benefits of our
approach:

- **Simplicity**: DVC is a
  [free](https://github.com/iterative/dvc/blob/master/LICENSE), open-source
  [command line](/doc/command-reference) tool that doesn't require databases or
  servers. It keeps your project readable and consistent: No need for ad hoc
  file names like `data/20190922/labels_v7_final.bak`.
- **Data management**: Efficient data storage is automated and decoupled from
  other assets, which enables teams to
  [share data stores](/doc/use-cases/shared-development-server) across
  development environments. Data and ML models can be
  [shared remotely](/doc/use-cases/sharing-data-and-model-files) and
  [reused](/doc/start/data-access) data using cloud storage, improving
  **collaboration**.
- **Reproducibility**: Restore any project version and find the corresponding
  data instantly. Identify past research inputs to understand the results, or
  for debugging.
- [**Git workflows**](https://about.gitlab.com/topics/version-control/what-is-git-workflow/).
  They open the door to advanced scenarios such as continuous integration
  (CI/CD) like [CML](https://cml.dev/), specialized patterns such as
  [data registries](/doc/use-cases/data-registries), and other best practices
  that improve productivity and scalability.
- **Data compliance**: Maintain visibility on data and model changes. Review who
  wants to modify them, and why, with pull requests (e.g. on GitHub). Audit this
  process later to determine when and by whom where data or model versions
  approved.

In summary, data science and machine learning are iterative processes where the
lifecycles of data, models, and code happen at different paces. DVC helps
integrate and manage them effectively.
