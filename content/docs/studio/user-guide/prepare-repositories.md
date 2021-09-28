# Prepare Your Repositories

DVC Studio creates views by identifying datasets, metrics and hyperparameters
defined in your Git repositories. These values are stored in your Git
repositories as JSON or YAML files. You can add these values to your Git
repositories in two ways:

1. **Set up DVC repositories**: You can use [DVC](https://dvc.org/) and Git to
   version your code, data and models all within your Git repositories. Data
   Version Control, or DVC, is a data and ML experiment management tool that
   takes advantage of the existing engineering toolset that you're already
   familiar with (Git, CI/CD, etc.). By using DVC, you can be sure not to bloat
   your repositories with large volumes of data or huge models. These large
   assets reside in the cloud or other remote storage locations. You will simply
   track their version info in Git.

   DVC also enables you to
   [share your data and model files](/doc/use-cases/sharing-data-and-model-files),
   [create data registries](/doc/use-cases/data-registries),
   [create data pipelines](/doc/start/data-pipelines), connect them with
   [CML](https://cml.dev) for
   [CI/CD in machine learning](/doc/use-cases/ci-cd-for-machine-learning), and
   so on. Find more about the features and benefits of DVC [here](/doc/start).

   Refer to the [DVC documentation](https://dvc.org/doc) to initialize a DVC
   repository.

2. **Specify custom files with your metrics and parameters**: If you are working
   with a non-DVC repository, you can still create views for it provided that
   the metrics and hyperparameters are stored in JSON or YAML files. For
   instance, if you have an ML project for which you generate and save metrics
   either manually or using some ML tracking tools, then you can create a view
   for this project by specifying the file (within your Git repo) which contains
   your saved metrics. Refer to the section on
   [view settings](/doc/studio/user-guide/views/view-settings#non-dvc-repositories)
   to learn how to specify the custom files.
