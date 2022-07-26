<admon type="info">

We have renamed Views to Projects in Iterative Studio.

</admon>

# Prepare Your Repositories

Iterative Studio creates [Projects](/doc/studio/user-guide/projects) by
identifying datasets, metrics and hyperparameters defined in your Git
repositories. These values are stored in repos as JSON or YAML files. You can
add them in two ways:

1. **Set up DVC repositories**: You can use [DVC](https://dvc.org/) to version
   your code, data, and machine learning models together using Git. Large files
   move to the cloud or other remote storage locations, while you track their
   version info in Git as configuration along with your code. This way you can
   avoid bloating your repos.

   DVC also enables you to [store and share data and models], [create data
   registries], [codify data pipelines] and connect them with
   [CML](https://cml.dev) for [CI/CD], track [ML experiments], and more.

2. **Specify custom files with your metrics and parameters**: If you are working
   with a non-DVC repository, you can add the project provided that the metrics
   and hyperparameters are stored in JSON or YAML files. For instance, if you
   have an ML project for which you generate and save metrics either manually or
   using some ML tracking tools, then you can add this project by specifying the
   file (within your Git repo) which contains your saved metrics. Refer to the
   section [on project settings] to learn how to specify the custom files.

[store and share data and models]:
  /doc/start/data-and-model-versioning#storing-and-sharing
[create data registries]: /doc/use-cases/data-registry
[codify data pipelines]: /doc/start/data-pipelines
[ci/cd]: /doc/use-cases/ci-cd-for-machine-learning
[ml experiments]: /doc/user-guide/experiment-management/experiments-overview
[on project settings]: /doc/studio/user-guide/projects#non-dvc-repositories
