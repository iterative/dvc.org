# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models together? What's the best way to organize
and store multiple versions of data and model files? How can data lifecycles be
defined and enforced?

![](/img/data-ver-complex.png) _Traceability of data artifacts_

Data Version Control (DVC) can address these issues by helping you organize your
data and models effectively and capture their versions in
[Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>),
while storing the actual data contents outside ot Git. DVC also matches the
right versions of code and data for you 💘.

Only the desired data versions exist in the <abbr>workspace</abbr> at any given
time. This way you can worry about the current state of your
[data pipelines](/doc/command-reference/dag) instead of on moving files around.

![](/img/ml-pipeline-evolution.png) _Evolution of an ML project_

We won't go too deep into how it works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that, but
here's the gist of it: DVC enables data _versioning through codification_. This
means describing which data, ML artifacts, etc. should be in the environment at
any given time. It's achieved with special
[metafiles](/doc/user-guide/dvc-files-and-directories) that can be put in Git —
to learn how this looks and feels, try our
[versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
👩‍💻.

This approach bring the following benefits:

- **Simplicity**: No need for ad hoc naming conventions like
  `data/2019/labels_v7_final`.
- **Reproducibility**: Restore any project version and find the data you need
  instantly. Now you can always identify past research inputs and understand the
  results.
- **Efficient storage**: Relevant versions of data contents are
  [cached](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
  automatically and in a way that prevents file duplication.
- [**Share**](/doc/use-cases/sharing-data-and-model-files): Data and models can
  be easily pushed and pulled from online/cloud storage.
- **Best practices**: Adopt existing engineering tools like Git SCM,
  [semver](https://semver.org/), continuous integration (CI) such as
  [CML](https://cml.dev/), etc. to improve collaboration and productivity.
- **Specialization**: Implement useful project patterns such as
  [data registries](/doc/use-cases/data-registries) and
  [model zoos](/doc/api-reference/open).
- **Data security**: Enforce lifecycle policies by having a defined process to
  change data and models.

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
