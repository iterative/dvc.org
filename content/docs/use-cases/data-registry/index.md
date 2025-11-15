# Data Registry

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/use-cases/data-and-model-files-versioning).
DVC also enables cross-project
[reusability](/user-guide/data-management/discovering-and-accessing-data) of
these <abbr>data artifacts</abbr>. This means that your projects can depend on
data from other repositories — like a **package management system for data
science**.

![](/img/data-registry.png) _Data management middleware_

We can build a <abbr>DVC project</abbr> dedicated to versioning _datasets_ (or
data features, [ML models](/use-cases/model-registry), etc.). The repository
contains the necessary metadata, as well as the entire change history. The data
itself is stored in one or more [DVC remotes][remote storage]. This is what we
call a **data registry** -- data management _middleware_ between ML projects and
cloud storage. Advantages:

- **Reusability**: Reproduce and organize _feature stores_ with a simple CLI
  (`dvc get` and `dvc import` commands, similar to software package management
  like `pip`).
- **Persistence**: Separating metadata from storage on reliable platforms (Git,
  cloud locations) improve the durability of your data.
- **Storage optimization**: Centralize data shared by multiple projects in a
  single location (distributed copies are possible too). This simplifies data
  management and optimizes space requirements.
- **Data as code**: Leverage Git workflow benefits such as having a commit
  history, branching, pull requests, reviews, and even [CI/CD for your data and
  models lifecycle]. Think "Git for cloud storage".
- **Security**: DVC-controlled [remote storage] (e.g. Amazon S3) can be
  configured to limit data access. For example, you can setup read-only
  endpoints (e.g. an HTTP server) to prevent data deletions or alterations.

[ci/cd for your data and models lifecycle]:
  /use-cases/ci-cd-for-machine-learning
[remote storage]: /user-guide/data-management/remote-storage

👩‍💻 Intrigued? Try our [registry tutorial] to learn how DVC looks and feels
firsthand.

[registry tutorial]: /use-cases/data-registry/tutorial

<admon type="info">

See also [Model Registry](/use-cases/model-registry).

</admon>
