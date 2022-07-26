<admon type="info">

We have renamed Views to Projects in Iterative Studio.

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Projects in Iterative Studio

A **Project** is an interactive representation of the information stored in your
project repository. When you connect to a Git repo from Iterative Studio, the ML
experiments committed in it are parsed. These are then presented in a table,
with each experiment in a row, and their data, metrics, and hyperparameter
values in the columns.

![](https://static.iterative.ai/img/studio/view_components.png) _A project
presents information stored in your Git repository in an interactive table._

All the projects that you have created are presented in a central dashboard.
This dashboard opens up whenever you login to Iterative Studio.

![](https://static.iterative.ai/img/studio/projects_dashboard.png) _All the
projects that you create are presented in a projects dashboard for easy access._

Within a project, you can:

- Explore all the details of the experiments that you have pushed to your Git
  repository.
- Visualize the experiments using plots and trend charts.
- Compare experiments.
- Run new experiments by submitting new Git commits directly from Iterative
  Studio.

## Create a Project

In this section, you will learn how to:

- [Connect to a Git repository and add a project](#connect-to-a-git-repository-and-add-a-project)
- [Create multiple projects from a single Git repository](#create-multiple-projects-from-a-single-git-repository)
- [Create projects shared across a team](#create-projects-shared-across-a-team)

### Connect to a Git repository and add a project

To add a new project, follow these steps.

1. Sign in to your [Iterative Studio](https://studio.iterative.ai/) dashboard
   using your GitHub.com, GitLab.com or Bitbucket.org account, or your email
   address.

2. Click on `Add a Project`. All the organizations that you have access to will
   be listed.

<admon type="info">

If you do not see your desired organizations or Git repositories, make sure that
[the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

To connect to your GitHub repositories, you must install the Iterative Studio
GitHub app. Refer to the section on
[GitHub app installation](/doc/studio/user-guide/install-github-app) for more
details.

To connect to repositories on your self-hosted GitLab server, you must first add
a connection to this server and create a team. Refer to the section on
[self-hosted GitLab server support](/doc/studio/user-guide/install-github-app)
for more details.

</admon>

3. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo_v3.png)

4. Specify additional connection settings if required.

   ![](https://static.iterative.ai/img/studio/project_settings.png)

> Project settings must be configured if you are connecting to a non-DVC
> repository, if your metrics are in some custom files, if you are connecting to
> a monorepo, or if your metrics are in cloud or other remote storage. However,
> you can configure the project settings after the project has been created. So,
> you can `Skip and Continue` now. Refer to the [Project Settings] section for
> more details.

You should now see that a project has been added in your dashboard.

5. If your project requires any of the additional settings, then remember to
   configure them by opening the [project settings]. Otherwise, your project may
   not work as expected. To go to project settings, click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the project. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/project_open_settings.png)

[project settings]: /doc/studio/user-guide/projects#configuration

### Create multiple projects from a single Git repository

You can also create multiple projects in Iterative Studio from a single Git
repository and apply different settings to them.

One use case for this is if you have a
[monorepo](https://en.wikipedia.org/wiki/Monorepo) with multiple ML projects,
each one in a different sub-directory.

For each ML project in the monorepo, follow the
[above process](#connect-to-a-git-repository-and-add-a-project) to connect to
the Git repository. Then go to the project settings, and [specify the
sub-directory] in which the desired ML project resides.

This way, you will have multiple Iterative Studio projects for your single Git
repository, with each project presenting values from a different sub-directory.

[specify the sub-directory]: /doc/studio/user-guide/projects#project-directory

### Create projects shared across a team

You can [create teams](/doc/studio/user-guide/teams) with one or more team
members, also called collaborators.

Each team will have its own projects dashboard, and the projects that you create
in the team's dashboard will be accessible to all members of the team.

To add more than 2 collaborators in your team, you can
[upgrade it to the **Team** or **Enterprise** plan](/doc/studio/user-guide/change-team-plan-and-size).

## Sharing

You can [share a project within a team](#share-a-project-within-a-team). You can
also [make a project public](#make-a-project-public) to share it on the web.

### Share a project within a team

Each team that you [create in Iterative Studio](/doc/studio/user-guide/teams)
will have its own projects dashboard. All the projects that you create in the
team's dashboard will be accessible to all members (collaborators) of the team.

To add more than 2 collaborators in your team, you can
[upgrade it to the **Team** or **Enterprise** plan](/doc/studio/user-guide/change-team-plan-and-size).

### Make a project public

To share a project on the web (i.e., to make the project public), click on the
button labeled `Private` next to the name of the project. In the menu that pops
up, turn on `Share to Web`.

<admon>

This will not change the settings of your connected Git repository; if the Git
repository is private, it will continue to remain private.

</admon>

![](https://static.iterative.ai/img/studio/project_share.png)

A shared (public) project can be made private by turning off `Share to web`.

<admon>

This will not change the settings of your connected Git repository; if the Git
repository is public, it will continue to remain public.

</admon>

Projects that are shared on the web can be opened by anyone, including people
who are not logged in to Iterative Studio. These anonymous users have the
`Visitor` role. Their access is limited to opening the project's experiment
table, applying filters, and showing/hiding columns for themselves without
saving any changes permanently. Refer to the
[Roles](/doc/studio/user-guide/teams#roles) section for details on the features
available for different roles.

## Configuration

You can configure additional settings for your projects. Some of these settings,
such as project name, are optional. Some other settings, such as data remotes,
may be required depending on how your Git repository has been set up.

### Scenarios where projects settings are required

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

#### Non-DVC repositories

In the section on [preparing your repositories], you saw that you can use
Iterative Studio with DVC as well as non-DVC repositories. If you are connecting
to a non-DVC repository, then you will need to [specify the custom files] that
contain the metrics and hyperparameters that you want to visualize.

[preparing your repositories]: /doc/studio/user-guide/prepare-your-repositories
[specify the custom files]: #custom-metrics-and-parameters

#### Monorepo

Depending on how you have set up your Git repositories, your DVC repo (to which
you are trying to connect from Iterative Studio) may not be in the root of your
Git repo. Instead, it could be in a sub-directory of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). If this is the case, you
will need to specify the full path to the sub-directory that contains the data
you want to visualize in Iterative Studio.

#### Data remotes (cloud/remote storage)

The metrics and parameters that you want to include in the project may also be
present in a [data remote](/doc/command-reference/remote#description) (cloud
storage or another location outside the Git repo). If you want to include such
data in your projects, then you will have to grant Iterative Studio access to
the data remote.

### Configuring project settings

You can configure a project's settings at any time after creating the project.
For this, click on the
![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon in
the project. In the menu that opens up, click on `Settings`.

#### Project name

To change the project name, enter the new name for your project as shown below.

![](https://static.iterative.ai/img/studio/project_settings_view_name.png)

#### Project directory

If you have connected to a [monorepo](https://en.wikipedia.org/wiki/Monorepo),
then specify the full path to the sub-directory that contains the DVC repo to
which you are trying to connect.

![](https://static.iterative.ai/img/studio/project_settings_sub_directory.png)

#### Data remotes / cloud storage credentials

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

#### Mandatory columns

> Formerly **tracking scope**

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

[display preferences]:
  /doc/studio/user-guide/ml-experiments/explore-ml-experiments#columns

#### Custom metrics and parameters

If you want to connect custom files, you can add them by clicking the `Add file`
button. Enter the full file path within your Git repository, and specify whether
the file is for `Metrics` or `Parameters`.

![](https://static.iterative.ai/img/studio/project_settings_custom_files.png)
