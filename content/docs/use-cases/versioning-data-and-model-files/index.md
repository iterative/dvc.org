# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models together? What's the best way to organize
and store multiple versions of data and model files? How can data lifecycles be
defined and enforced?

![](/img/data-ver-complex.png) _Exponential complexity of data science projects_

Data Version Control (DVC) can address these issues by helping you organize your
data and models effectively, and capture their versions with
[Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>)
without having to put the actual data contents in the repo. This way you can
have a single, immutable history for all of your assets and artifacts, and at
the same time, the data stays with you.

![](/img/project-versions.png) _DVC matches the right versions of code and
data._

DVC enables data _versioning through codification_. This means describing which
data, ML artifacts, etc. should be in the environment at any given time. This is
achieved with special [metafiles](/doc/user-guide/dvc-files-and-directories)
that can be put in Git. These use constant file names but link to variable
contents (via the metadata in Git), so that the data can be modified
independently from the source code that addresses it.

We won't go much deeper into how it works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that. You
can also try our
[versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
👩‍💻 to learn how it looks and feels.

DVC's approach brings the following benefits:

- **Simple file names**: Work with a natural project structure. No need for ad
  hoc naming conventions like `data/20190922/labels_v7_final`.
- **Lightweight**: No databases, servers, or external services are required. DVC
  is a [free](https://github.com/iterative/dvc/blob/master/LICENSE), open-source
  [command line](/doc/command-reference) tool.
- **Collaboration**: Data artifacts and machine learning models can be easily
  [shared](/doc/use-cases/sharing-data-and-model-files) and
  [reused](/doc/start/data-access) via on-premises or cloud storage
  [remotely](/doc/command-reference/remote).
- **Reproducibility**: Restore any project version and find the corresponding
  data instantly. Identify past research inputs to understand its results, or
  for debugging.
- **Integrations**: Adopting a
  [Git workflow](https://about.gitlab.com/topics/version-control/what-is-git-workflow/)
  opens the door to advanced scenarios such as continuous integration (CI/CD
  e.g. [CML](https://cml.dev/)), specialized patterns like
  [data registries](/doc/use-cases/data-registries), and other best practices
  that improve productivity and scalability.
- **Data compliance**: Maintain visibility on data and ML model changes. Review
  who wants to modify them, and why, with pull requests (e.g. on GitHub). Audit
  this process later: when was a model version approved, and by whom?

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
