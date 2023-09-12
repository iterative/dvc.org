# Configure a Project

You can configure additional settings for your projects. Some of these settings,
such as project name, are optional. Some other settings, such as data remotes,
may be required depending on how your Git repository has been set up.

## Scenarios where project settings are required

If you are connecting to a DVC repo which is at the root of the Git repository
and does not reference remote/cloud storage, then you can successfully visualize
it without configuring additional settings. But in the following scenarios, you
will need to configure project settings:

### Non-DVC repositories

If you are creating a project for a non-DVC repository, you will need to
[specify the custom files] that contain the metrics and hyperparameters that you
want to visualize.

[specify the custom files]: #custom-metrics-and-parameters

### Monorepo

If the DVC repo for which you are creating the project is not in the root of
your Git repo but is in a [sub-directory] of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo), you will need to specify the
full path to the sub-directory that contains the data you want to visualize in
Iterative Studio.

[sub-directory]: /doc/command-reference/init#initializing-dvc-in-subdirectories

### Data remotes (cloud/remote storage)

If you want to include data stored in [data remotes] (cloud storage or another
location outside the Git repo), you will have to grant Iterative Studio access
to the data remotes.

[data remotes]: /doc/user-guide/data-management/remote-storage

Additionally, you can also configure project settings to
[change the name](#project-name) of your project and to
[select columns](#columns) to import in your project.

## Configuring project settings

You can configure a project's settings at any time after creating the project.
For this, open the 3-dot menu for the project and click on `Settings`.

![](https://static.iterative.ai/img/studio/project_open_settings.png)

### Project name

To change the project name, enter the new name for your project as shown below.

![](https://static.iterative.ai/img/studio/project_settings_view_name.png)

### Project directory

If you have connected to a [monorepo](https://en.wikipedia.org/wiki/Monorepo),
then specify the full path to the sub-directory that contains the DVC repo to
which you are trying to connect.

   <admon type="note">

Create multiple projects at once by providing up to 10 comma-separated values
during the initial [create project] flow.

   </admon>

![](https://static.iterative.ai/img/studio/project_settings_sub_directory.png)

[create project]:
  /doc/studio/user-guide/projects-and-experiments/create-a-project#create-multiple-projects-from-a-single-git-repository

### Data remotes / cloud storage credentials

If you need to provide credentials for [data remotes], you will need to do it
after your project has been created. First, create your project without
specifying the data remotes. Then, open project settings and go to the
`Data remotes / cloud storage credentials` section. The data remotes that are
used in your DVC repo will be listed.

![](https://static.iterative.ai/img/studio/view_settings_credentials.png)

Click on `Add new credentials`. In the form that opens up, select the provider
(Amazon S3, GCP, etc.). For details on what types of remote storage (protocols)
are supported, refer to the DVC documentation on [supported storage types].

Depending on the provider, you will be asked for more details such as the
credentials name, username, password etc. Note that for each supported storage
type, the required details may be different.

![](https://static.iterative.ai/img/studio/s3_remote_settings_v2.png)

You will also have to ensure that the credentials you enter have the required
permissions on the cloud / remote storage. Refer to the [DVC Remote config
parameters] for more details about this.

Any credentials that you
[add in your profile page](/doc/studio/user-guide/account-management#cloud-credentials)
are also available in your project settings page.

Note that Iterative Studio uses the credentials only to read plots/metrics files
if they are not saved in Git. It does not access any other data in your remote
storage. And you do not need to provide the credentials if any DVC data remote
is not used in your Git repository.

[supported storage types]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types
[dvc remote config parameters]:
  /doc/command-reference/remote/modify#available-parameters-per-storage-type

### Columns

You can specify which columns should be imported from your Git repository to
your project in Iterative Studio. Any unselected column cannot be displayed in
your project table.

![](https://static.iterative.ai/img/studio/project_settings_columns.png)

If you would like to hide imported columns from your project, you can do so in
the project's [Display preferences].

If your project is missing some required columns, then it is likely that
[they have not been imported or are hidden](/doc/studio/troubleshooting#project-does-not-contain-the-columns-that-i-want).

<admon type="warn">

The **Columns** setting was earlier called **Tracking scope** or **Mandatory
columns** and behaved slightly differently. Iterative Studio would always import
up to 200 columns. This meant that if you selected only 5 columns, Iterative
Studio would still import another 195 columns, unless your repository did not
have so many columns. This behavior is now obsolete, and only selected columns
are imported.

</admon>

[display preferences]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#columns

### Custom metrics and parameters

If you want to connect custom files, you can add them by clicking the `Add file`
button. Enter the full file path within your Git repository, and specify whether
the file is for `Metrics` or `Parameters`.

![](https://static.iterative.ai/img/studio/project_settings_custom_files.png)
