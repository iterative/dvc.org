# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What's the best way to organize and store
multiple versions of data and model files? How can data lifecycles be defined
and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

Data Version Control (DVC) can address these issues by helping you organize your
data and models like any other asset that can be captured with
[Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>),
storing their historic versions automatically outside ot Git. DVC matches the
right versions of code and data for you 💘.

Unique versions of data contents are
[cached](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
under the same file name so you don't need to name them manually — this also
prevents storing duplicate files. Only one data version is placed in the
workspace at any given time (alongside the corresponding code). This way you can
worry about the current state of your data pipeline instead of on moving files
around.

![](/img/ml-pipeline-evolution.png) _Evolution of an ML project_

We won't go too deep into how it works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that, but
here's the gist of it: DVC enables data _versioning through codification_. This
means describing which data, ML artifacts, etc. should be in the environment at
any given time. It's achieved with special
[metafiles](/doc/user-guide/dvc-files-and-directories) that we can put in Git
along with the source code.

> To try hands-on data versioning with DVC, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
> 👩‍💻.

Let's summarize the benefits of Data Version Control:

- Restore any project version and find the data you need instantly. You can
  always identify past research inputs to understand and reproduce the results.
- Avoid ad hoc naming conventions: No need for complicated file paths like
  `data/2019/labels_v7_final` in your projects.
- Adopt existing engineering tools like Git SCM, [semver](https://semver.org/),
  continuous integration (CI) such as [CML](https://cml.dev/), and other best
  practices that improve collaboration and productivity.
- Independent storage (<abbr>DVC cache</abbr>) increases data persistence, and
  allows [sharing data and models](/doc/use-cases/sharing-data-and-model-files)
  easily.
- Enable specialized project patterns such as
  [data registries](/doc/use-cases/data-registries) and
  [model zoos](/doc/api-reference/open).
- Enforce lifecycle policies by having a defined process to change data and
  models. Data security audits, anyone?

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
