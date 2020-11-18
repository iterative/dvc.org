# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models together? What's the best way to organize
and store multiple versions of data and model files? How can data lifecycles be
defined and enforced?

![](/img/data-ver-complex.png) _Exponential complexity of data science projects_

Data Version Control (DVC) can address these issues by helping you organize your
data and models effectively and capture their versions in
[Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>),
while storing the actual data contents outside ot Git. This way there's a single
project history for all of its assets and artifacts, and at the same time the
data stays with you.

![](/img/data-ver-storage.png) _DVC matches the right versions of code and
data._

DVC enables data _versioning through codification_. This means describing which
data, ML artifacts, etc. should be in the environment at any given time. This is
achieved with special [metafiles](/doc/user-guide/dvc-files-and-directories)
that can be put in Git — but we won't much deeper into how it works here, since
we have many [guides](/doc/user-guide) and [references](/doc/command-reference)
for that. To learn how it looks and feels, try our
[versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
👩‍💻.

DVC's approach brings the following benefits:

- **Simplicity**: Work with a straightforward project file structure. No need
  for ad hoc naming conventions like `data/2019/labels_v7_final`.
- **Roll-backs**: Restore any project version and find the data you need
  instantly. Identify past research inputs and understand/reproduce previous
  results at any time!
- **Collaboration**: Data and models can be easily
  [shared](/doc/use-cases/sharing-data-and-model-files) and
  [reused](/doc/start/data-access) via on-premises or cloud
  [storage remotes](/doc/command-reference/remote).
- **Efficient storage**: All versions of data contents are
  [cached](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
  automatically, in a way that prevents file duplication.
- **Standard**: Adopt existing engineering tools like Git SCM, and best
  practices like [semver](https://semver.org/) and continuous integration
  (CI/CD) such as [CML](https://cml.dev/) to improve team productivity.
- **Lightweight**: DVC keeps it simple. No databases, servers, or external
  services are required.<br/> DVC is a
  [free](https://github.com/iterative/dvc/blob/master/LICENSE), open-source
  [command line](/doc/command-reference) tool.

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
