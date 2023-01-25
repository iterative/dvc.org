<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Configure a Project

You can configure additional settings for your projects. Some of these settings,
such as project name, are optional. Some other settings, such as data remotes,
may be required depending on how your Git repository has been set up.

## Scenarios where projects settings are required

If you are connecting to a DVC repo which is at the root of the Git repository
and does not reference remote/cloud storage, then you can successfully visualize
it without configuring additional settings.

Alternatively, you could create projects from:

- Non-DVC repositories
- Sub-directories in a monorepo
- Custom files in your repository or remote/cloud storage

In each of these scenarios, you will need to configure additional settings for
Iterative Studio to be able to access the data required for visualization.

Additionally, you can also configure project settings to
[change the name](#project-name) of your project and to
[select mandatory columns](#mandatory-columns) to import in your project.

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
Git repo. Instead, it could be in a sub-directory of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). If this is the case, you
will need to specify the full path to the sub-directory that contains the data
you want to visualize in Iterative Studio.

### Data remotes (cloud/remote storage)

The metrics and parameters that you want to include in the project may also be
present in a [data remote](/doc/command-reference/remote#description) (cloud
storage or another location outside the Git repo). If you want to include such
data in your projects, then you will have to grant Iterative Studio access to
the data remote.

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

![](https://static.iterative.ai/img/studio/project_settings_sub_directory.png)

### Data remotes / cloud storage credentials

If you need to provide credentials for
[DVC data remotes](/doc/command-reference/remote#description), you will need to
do it after your project has been created. First, create your project without
specifying the data remotes. Once your project is created, open its settings.
Open the `Data remotes / cloud storage credentials` section. The data remotes
that are used in your DVC repo will be listed.

![](https://static.iterative.ai/img/studio/view_settings_credentials.png)

Now, click on `Add new credentials`. In the form that opens up, select the
provider (Amazon S3, GCP, etc.). For details on what types of remote storage
(protocols) are supported, refer to the DVC documentation on
[supported storage types](/doc/command-reference/remote/add#supported-storage-types).

Depending on the provider, you will be asked for more details such as the
credentials name, username, password etc. Note that for each supported storage
type, the required details may be different.

![](https://static.iterative.ai/img/studio/s3_remote_settings_v2.png)

You will also have to ensure that the credentials you enter have the required
permissions on the cloud / remote storage. In the DVC documentation on
[supported storage types](/doc/command-reference/remote/add#supported-storage-types),
expand the section for the storage type you want to add. There, you will find
the details of the permissions that you need to grant to the account
(credentials) that you are configuring on Iterative Studio.

Note that Iterative Studio uses the credentials only to read plots/metrics files
if they are not saved into Git. It does not access any other data in your remote
storage. And you do not need to provide the credentials if any DVC data remote
in not used in your Git repository.

### Mandatory columns

##### (Tracking scope)

If your repository exceeds 200 columns, Iterative Studio will import a subset.
The columns that are not imported will not be available to display in your
project. In the settings for "Mandatory columns", You can select which columns
are mandatory to import. Iterative Studio will also import unselected columns up
to a maximum of 200.

![](https://static.iterative.ai/img/studio/project_settings_mandatory_columns.png)

Note that some non-mandatory columns will also be imported if there are less
than 200 mandatory columns. If you would like to hide specific columns from your
project, you can do so in the project's [Display preferences].

If your project is missing some required columns or includes columns that you do
not want, refer to the following troubleshooting sections to understand why this
may have happened.

- [Project does not contain the columns that I want](/doc/studio/troubleshooting#project-does-not-contain-the-columns-that-i-want)
- [Project contains columns that I did not import](/doc/studio/troubleshooting#project-contains-columns-that-i-did-not-import)

Note: The **Mandatory columns** section was earlier called **Tracking scope**.

[display preferences]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#columns

### Custom metrics and parameters

If you want to connect custom files, you can add them by clicking the `Add file`
button. Enter the full file path within your Git repository, and specify whether
the file is for `Metrics` or `Parameters`.

![](https://static.iterative.ai/img/studio/project_settings_custom_files.png)
