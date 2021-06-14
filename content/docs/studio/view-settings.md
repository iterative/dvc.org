# Configure a View

If you are connecting to a DVC repo which is at the root of the Git repository
and does not reference remote/cloud storage, then you can successfully visualize
it without configuring additional settings.

Alternatively, you could create views from:

- Non-DVC repositories
- Project sub-directories in a monorepo
- Custom files in your repository or remote/cloud storage

In each of these scenarios, you will need to configure additional settings for
DVC Studio to be able to access the data required for visualization. Details are
given below.

## Non-DVC repositories

In the section on
[preparing your repositories](/doc/studio/get-started#preparing-your-repositories),
you saw that you can use DVC Studio with DVC as well as non-DVC repositories. If
you are conecting to a non-DVC repository, then you will need to specify the
custom files that contain the metrics and hyperparameters that you want to
visualize.

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
