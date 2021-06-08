# Configure a View

If you are creating a view for a DVC repo, and if the DVC repo is at the root of
the Git repository and does not reference remote/cloud storage, then you can
successfully visualize it without configuring additional settings.

Alternatively, you could create views from:

- Non-DVC repositories
- Project sub-directories in a monorepo
- Custom files in your repository or remote/cloud storage

In each of these scenarios, you will need to configure additional settings for
DVC Studio to be able to access the data required for visualization. Details are
given below.

## Non-DVC repositories

DVC Studio creates views by identifying datasets, metrics and hyperparameters
defined in your Git repositories. These values are stored in your Git
repositories as CSV, JSON or YAML files. You can add these values to your Git
repositories in two ways:

1. **Set up DVC repositories**: You can use [DVC](https://dvc.org/) and Git to
   version your code, data and models all within your Git repositories. By using
   DVC, you can be sure not to bloat your repositories with large volumes of
   data or huge models. These large assets reside in the cloud or other remote
   storage locations. You will simply track their version info in Git. DVC also
   enables you to
   [share your data and model files](/doc/use-cases/sharing-data-and-model-files),
   [create data registries](/doc/use-cases/data-registries),
   [create data pipelines](/doc/start/data-pipelines), connect them with
   [CML](/doc/cml) for CI/CD in machine learning, and so on. Find more about the
   features and benefits of DVC [here](/doc/start).

   Refer to the [DVC documentation](https://dvc.org/doc) to initialize a DVC
   repository. You can then connect to this DVC repository and create a view as
   described [earlier](/doc/studio/create-view). DVC Studio automatically
   detects metrics, plots, and hyperparameters files specified in the project's
   `dvc.yaml`. Each time you push a commit to this DVC repository, your view
   will reflect the new changes.

2. **Specify custom files with your metrics and parameters**: If you are working
   with a non-DVC repository, you can still create views for it provided that
   metrics and hyperparameters are stored in CSV, JSON or YAML files. To
   visualize such custom data, simply
   [specify the custom files](#specifying-view-settings) to use, and DVC Studio
   will efficiently generate tables and plots for your custom input. For
   instance, if you have an ML project for which you generate and save metrics
   either manually or using some ML tracking tools, then you can create a view
   for this project by specifying the file (within your Git repo) which contains
   your saved metrics.

   So as you can see, DVC Studio simply requires your metrics and
   hyperparameters to be available in data files in your Git repositories. This
   video further illustrates this concept.

   https://www.youtube.com/watch?v=5xM5az78Lrg

## Monorepo

Depending on how you have set up your Git repositories, your DVC repo (for which
you are trying to create the view) may not be in the root of your Git repo.
Instead, it could be in a sub-directory of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). If this is the case, you
will need to specify the full path to the sub-directory that you want to use
with your view.

## Data remotes (cloud/remote storage)

The metrics and parameters that you want to include in the view may also be
present in a data remote (cloud storage or another location outside the Git
repo). If you want to include such data in your views, then you will have to
grant DVC Studio access to the data remote.

# Configuring view settings

For any of the scenarios defined above, specify the additional settings as
described below. You can access these settings at any time after creating the
view. For this, click on the
![](https://static.iterative.ai/img/studio/view_open_settings_icon_v2.png) icon
in the view. In the menu that opens up, click on `Settings`.

- **Custom metrics and parameters:** If you want to connect custom files, you
  can add them by clicking the `Add file` button. Enter the full file path, and
  specify whether the file is for `Metrics` or `Parameters`.

- **Monorepo:** If you have connected to a
  [monorepo](https://en.wikipedia.org/wiki/Monorepo), then specify the full path
  to the sub-directory that contains the DVC repo for which you want to create
  the view.

- **Data remotes:** If you need to set up DVC data remotes for your view, you
  will need to do it after your view has been created. First, create your view
  without specifying the data remotes. Once your view is created, open its
  settings. Open the `Data remotes / cloud storage credentials` section. The
  data remotes that are used in your DVC repo will be listed. Now, click on
  `Add new credentials`. In the form that opens up, select the provider (Amazon
  S3, GCP, etc.). Depending on the provider, you will be asked for more details
  such as the credentials name, username, password etc.

  ![](https://static.iterative.ai/img/studio/s3_remote_settings.png)

  For details on what permissions are required, refer to the DVC documentation
  on
  [supported storage types](/doc/command-reference/remote/add#supported-storage-types).

  Note that DVC Studio uses the credentials only to read plots/metrics files if
  they are not saved into Git. It does not access any other data in your remote
  storage. And you do not need to provide the credentials if any DVC data remote
  in not used in your Git repository.
