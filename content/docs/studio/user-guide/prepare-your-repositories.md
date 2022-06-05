# Prepare Your Repositories

Iterative Studio creates Views by identifying datasets, metrics, and
hyperparameters defined in your Git repositories. These values are stored in
repos as JSON or YAML files. You can add them in two ways:

1. **Set up DVC repositories**: You can use [DVC](https://dvc.org/) to version
   your code, data, and machine learning models together using Git. Large files
   move to the cloud or other remote storage locations, while you track their
   version info in Git as configuration along with your code. This way you can
   avoid bloating your repos.

   DVC also enables you to [store and share data and models], [create data
   registries], [codify data pipelines] and connect them with
   [CML](https://cml.dev) for [CI/CD], track [ML experiments], and more.

2. **Specify custom files with your metrics and parameters**: If you are working
   with any other Git repository, you can still create Studio Views for it via
   JSON or YAML metrics and hyperparameters files. For instance, if you have a
   project for which you generate metrics manually or with other ML tracking
   tools, you can create a view by specifying the Git-tracked file which
   contains its metrics.

   Refer to [this section of Create a View] to learn how to specify the custom
   files.

[store and share data and models]:
  /doc/start/data-and-model-versioning#storing-and-sharing
[create data registries]: /doc/use-cases/data-registry
[codify data pipelines]: /doc/start/data-pipelines
[ci/cd]: /doc/use-cases/ci-cd-for-machine-learning
[ml experiments]: /doc/user-guide/experiment-management/experiments-overview
[this section of create a view]:
  /doc/studio/user-guide/views-and-experiments/create-a-view#non-dvc-repositories
