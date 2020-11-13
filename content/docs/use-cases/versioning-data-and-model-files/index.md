# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models together? What's the best way to organize
and store multiple versions of data and model files? How can data lifecycles be
defined and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

Data Version Control (DVC) can address these issues by helping you organize your
data and models like any other asset that can be captured with
[Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>),
storing their historic versions automatically outside ot Git. DVC matches the
right versions of code and data for you 💘.

![](/img/ml-pipeline-evolution.png) _Evolution of an ML project_

We won't go too deep into how it works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that, but
here's the gist of it: DVC enables data _versioning through codification_. This
means describing which data, ML artifacts, etc. should be in the environment at
any given time. It's achieved with special
[metafiles](/doc/user-guide/dvc-files-and-directories) that can be put in Git.

Only the desired data versions exist in the <abbr>workspace</abbr> at any given
time. This way you can worry about the current state of your
[data pipelines](/doc/command-reference/dag) instead of on moving files around —
to see how this looks and feels, try our
[versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
👩‍💻. This approach bring the following benefits:

- **Reproducibility**: Restore any project version and find the data you need
  instantly. You can always identify past research inputs and understand the
  results.
- **Simplify**: No need for ad hoc naming conventions like
  `data/2019/labels_v7_final`.
- **Best practices**: Adopt existing engineering tools like Git SCM,
  [semver](https://semver.org/), continuous integration (CI) such as
  [CML](https://cml.dev/), etc. to improve collaboration and productivity.
- **Efficient storage**: Versions of data and models contents are
  [cached](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
  in a way that prevents file duplication and allows
  [sharing them](/doc/use-cases/sharing-data-and-model-files) easily.
- **Specialize**: Implement useful project patterns such as
  [data registries](/doc/use-cases/data-registries) and
  [model zoos](/doc/api-reference/open).
- **Data security**: Enforce lifecycle policies by having a defined process to
  change data and models.

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
