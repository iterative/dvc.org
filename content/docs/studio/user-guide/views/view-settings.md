# Configure a View

You can configure additional settings for your views. Some of these settings,
such as view name, are optional. Some other settings, such as data remotes, may
be required depending on how your Git repository has been set up.

## Scenarios when views settings are required

If you are connecting to a DVC repo which is at the root of the Git repository
and does not reference remote/cloud storage, then you can successfully visualize
it without configuring additional settings.

Alternatively, you could create views from:

- Non-DVC repositories
- Project sub-directories in a monorepo
- Custom files in your repository or remote/cloud storage

In each of these scenarios, you will need to configure additional settings for
DVC Studio to be able to access the data required for visualization.

Additionally, you can also configure view settings to
[change the name](#view-name) of your view and to
[define the tracking scope](#tracking-scope) for your view.

### Non-DVC repositories

In the section on
[preparing your repositories](/doc/studio/user-guide/prepare-repositories), you
saw that you can use DVC Studio with DVC as well as non-DVC repositories. If you
are connecting to a non-DVC repository, then you will need to
[specify the custom files](#custom-metrics-and-parameters) that contain the
metrics and hyperparameters that you want to visualize.

### Monorepo

Depending on how you have set up your Git repositories, your DVC repo (for which
you are trying to create the view) may not be in the root of your Git repo.
Instead, it could be in a sub-directory of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). If this is the case, you
will need to specify the full path to the sub-directory that you want to use
with your view.

### Data remotes (cloud/remote storage)

The metrics and parameters that you want to include in the view may also be
present in a [data remote](/doc/command-reference/remote#description) (cloud
storage or another location outside the Git repo). If you want to include such
data in your views, then you will have to grant DVC Studio access to the data
remote.

## Configuring view settings

You can configure a view's settings at any time after creating the view. For
this, click on the
![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon in
the view. In the menu that opens up, click on `Settings`.

### View name

To change the view name, enter the new name for your view as shown below.

![](https://static.iterative.ai/img/studio/view_settings_view_name.png)

### Project directory

If you have connected to a [monorepo](https://en.wikipedia.org/wiki/Monorepo),
then specify the full path to the sub-directory that contains the DVC repo for
which you want to create the view.

![](https://static.iterative.ai/img/studio/view_settings_sub_directory.png)

### Data remotes / cloud storage credentials

If you need to provide credentials for
[DVC data remotes](/doc/command-reference/remote#description), you will need to
do it after your view has been created. First, create your view without
specifying the data remotes. Once your view is created, open its settings. Open
the `Data remotes / cloud storage credentials` section. The data remotes that
are used in your DVC repo will be listed.

![](https://static.iterative.ai/img/studio/view_settings_credentials.png)

Now, click on `Add new credentials`. In the form that opens up, select the
provider (Amazon S3, GCP, etc.). For details on what types of remote storage
(protocols) are supported, refer to the DVC documentation on
[supported storage types](/doc/command-reference/remote/add#supported-storage-types).

Depending on the provider, you will be asked for more details such as the
credentials name, username, password etc. Note that for each supported storage
type, the required details may be different.

![](https://static.iterative.ai/img/studio/s3_remote_settings.png)

You will also have to ensure that the credentials you enter have the required
permissions on the cloud / remote storage. In the DVC documentation on
[supported storage types](/doc/command-reference/remote/add#supported-storage-types),
expand the section for the storage type you want to add. There, you will find
the details of the permissions that you need to grant to the account
(credentials) that you are configuring on DVC Studio.

Note that DVC Studio uses the credentials only to read plots/metrics files if
they are not saved into Git. It does not access any other data in your remote
storage. And you do not need to provide the credentials if any DVC data remote
in not used in your Git repository.

### Tracking scope

DVC Studio can track upto 200 metrics, parameters, and files. If you have more
than 200 values in your Git repository, you can specify which ones to track and
which ones to leave out. To ensure that a value is included, make sure that it
is selected in the tracking scope. Any value that is not selected may not
display in your view.

![](https://static.iterative.ai/img/studio/view_settings_tracking_scope.png)

### Custom metrics and parameters

If you want to connect custom files, you can add them by clicking the `Add file`
button. Enter the full file path within your Git repository, and specify whether
the file is for `Metrics` or `Parameters`.

![](https://static.iterative.ai/img/studio/view_settings_custom_files.png)
