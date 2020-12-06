# Versioning Data and Models

Data science teams face data management questions around versions of data and
machine learning models. How do we keep track of changes in data, source code,
and ML models together? What's the best way to organize and store variations of
these files and directories?

![](/img/data-ver-complex.png) _Exponential complexity of data science projects_

Another problem in the field has to do with bookkeeping: being able to identify
past data inputs and processes to understand their results, for knowledge
sharing, or for debugging.

**Data Version Control** (DVC) lets you capture the versions of your data and
models in
[Git commits](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository),
while storing them on-premises or in cloud storage. It also provides a mechanism
to switch between these different data contents. The result is a single history
for data, code, and ML models that you can traverse — a proper journal of your
work!

![](/img/project-versions.png) _DVC matches the right versions of data, code,
and models for you 💘._

DVC enables data _versioning through codification_. You write simple
[metafiles](/doc/user-guide/dvc-files-and-directories) once, describing what
datasets, ML artifacts, etc. to track. This metadata can be put in Git in lieu
of large files. Now you can use DVC to create
[snapshots](/doc/command-reference/add) of the data,
[restore](/doc/command-reference/checkout) previous versions,
[reproduce](/doc/command-reference/repro) experiments, record evolving
[metrics](/doc/command-reference/metrics), and more!

👩‍💻 **Intrigued?** Try our
[versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
to learn how DVC looks and feels firsthand.

As you use DVC, unique versions of your data files and directories are
[cached](dvc-files-and-directories#structure-of-the-cache-directory) in a
systematic way (preventing file duplication). The working datastore is separated
from your <abbr>workspace</abbr> to keep the project light, but stays connected
via file
[links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
handled automatically by DVC.

Benefits of our approach include:

- **Lightweight**: DVC is a
  [free](https://github.com/iterative/dvc/blob/master/LICENSE), open-source
  [command line](/doc/command-reference) tool that doesn't require databases,
  servers, or any other special services.

- **Consistency**: Keep your projects readable with stable file names — they
  don't need to change because they represent variable data. No need for
  complicated paths like `data/20190922/labels_v7_final` or for constantly
  editing these in source code.

- **Efficient data management**: Use a familiar and cost-effective storage
  solution for your data and models (e.g. SFTP, S3, HDFS,
  [etc.](/doc/command-reference/remote/add#supported-storage-types)) — free from
  Git hosting
  [constraints](https://docs.github.com/en/free-pro-team@latest/github/managing-large-files/what-is-my-disk-quota).
  DVC [optimizes](/doc/user-guide/large-dataset-optimization) storing and
  transferring large files.

- **Collaboration**: Easily distribute your project development and share its
  data [internally](/doc/use-cases/shared-development-server) and
  [remotely](/doc/use-cases/sharing-data-and-model-files), or
  [reuse](/doc/start/data-access) it in other places.

- **Data compliance**: Review data modification attempts as Git
  [pull requests](https://www.dummies.com/web-design-development/what-are-github-pull-requests/).
  Audit the project's immutable history to learn when datasets or models were
  approved, and why.

- **GitOps**: Connect your data science projects with the Git-powered universe.
  Git workflows open the door to advanced tools such as continuous integration
  (like [CML](https://cml.dev/) CI/CD), specialized patterns such as
  [data registries](/doc/use-cases/data-registries), and other best practices.

In summary, data science and ML are iterative processes where the lifecycles of
data, models, and code happen at different paces. DVC helps you manage, and
enforce them.

And this is just the beginning. DVC supports multiple advanced features
out-of-the-box: Build, run, and versioning
[data pipelines](/doc/command-reference/dag),
[manage experiments](/doc/start/experiments) effectively, and more.
