# Configure a Project

You can configure additional settings for your projects. Some of these settings,
such as project name, are optional. Some other settings, such as data remotes,
may be required depending on how your Git repository has been set up.

## Scenarios where project settings are required

If you are connecting to a DVC repo which is at the root of the Git repository
and does not reference remote/cloud storage, then you can successfully visualize
it without configuring additional settings.

If you are connecting to a non-DVC repository, if your metrics are in some
custom files, if you are connecting to a monorepo, or if your metrics are in
cloud or other remote storage, you will need to configure project settings.

In each of these scenarios, you will need to configure additional settings for
Iterative Studio to be able to access the data required for visualization.

Additionally, you can also configure project settings to
[change the name](#project-name) of your project and to
[select columns](#columns) to import in your project.

To go to project settings, click on the
![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon in
the project. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/project_open_settings.png)

### Non-DVC repositories

In the section on [preparing your repositories], you saw that you can use
Iterative Studio with DVC as well as non-DVC repositories. If you are connecting
to a non-DVC repository, then you will need to [specify the custom files] that
contain the metrics and hyperparameters that you want to visualize.

[preparing your repositories]: /doc/studio/user-guide/prepare-your-repositories
[specify the custom files]: #custom-metrics-and-parameters

### Monorepo

Depending on how you have set up your Git repositories, your DVC repo (to which
you are trying to connect from Iterative Studio) may not be in the root of your
Git repo. Instead, it could be in a [sub-directory] of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). If this is the case, you
will need to specify the full path to the sub-directory that contains the data
you want to visualize in Iterative Studio.

[sub-directory]: /doc/command-reference/init#initializing-dvc-in-subdirectories

### Data remotes (cloud/remote storage)

The metrics and parameters that you want to include in the project may also be
present in a [data remote] (cloud storage or another location outside the Git
repo). If you want to include such data in your projects, then you will have to
grant Iterative Studio access to the data remote.

[data remote]: /doc/user-guide/data-management/remote-storage

## Configuring project settings

You can configure a project's settings at any time after creating the project.
For this, click on the
![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon in
the project. In the menu that opens up, click on `Settings`.

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

If you need to provide credentials for a [data remote], you will need to do it
after your project has been created. First, create your project without
specifying the data remotes. Once your project is created, open its settings.
Open the `Data remotes / cloud storage credentials` section. The data remotes
that are used in your DVC repo will be listed.

![](https://static.iterative.ai/img/studio/view_settings_credentials.png)

Now, click on `Add new credentials`. In the form that opens up, select the
provider (Amazon S3, GCP, etc.). For details on what types of remote storage
(protocols) are supported, refer to the DVC documentation on [supported storage
types].

Depending on the provider, you will be asked for more details such as the
credentials name, username, password etc. Note that for each supported storage
type, the required details may be different.

![](https://static.iterative.ai/img/studio/s3_remote_settings_v2.png)

You will also have to ensure that the credentials you enter have the required
permissions on the cloud / remote storage. Refer to the [DVC Remote config
parameters] for more details about this.

Note that Iterative Studio uses the credentials only to read plots/metrics files
if they are not saved into Git. It does not access any other data in your remote
storage. And you do not need to provide the credentials if any DVC data remote
in not used in your Git repository.

[supported storage types]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types
[dvc remote config parameters]:
  /doc/command-reference/remote/modify#available-parameters-per-storage-type

### Columns

In the "Columns" setting, you can specify which columns should be imported from
your Git repository to your project in Iterative Studio. Any unselected column
cannot be displayed in your project table.

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
