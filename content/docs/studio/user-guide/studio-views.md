# Studio Views

A View is an interactive representation of the information stored in your
project repository. When you connect to a Git repo from Iterative Studio, the ML
experiments committed in it are parsed. These are then presented in a table,
with each experiment in a row, and their data, metrics, and hyperparameter
values in the columns.

![](https://static.iterative.ai/img/studio/view_components.png) _Views present
your ML experiments in an interactive table._

All the views that you have created are presented in a central **dashboard**.
This is what opens up whenever you login to Studio.

![](https://static.iterative.ai/img/studio/views_dashboard.png) _All your views
are presented in the Studio dashboard._

In the view, you can:

- Explore all the details of the ML experiments committed to your project repo.
- Visualize the experiments using _plots_ and _trend_ charts.
- Compare experiments.
- Run new experiments (new Git commits) directly from Studio.

## Create a View

In this section, you will learn how to:

- [Connect to a Git repository](#connect-to-a-git-repository)
- [Create multiple views from a single Git repository)](#create-multiple-views-from-a-single-git-repository)
- [Create views shared across a team](#create-views-shared-across-a-team)

### Connect to a Git repository

To create a new view, follow these steps.

1. Sign in to your [Iterative Studio](https://studio.iterative.ai/) dashboard
   using your GitHub.com, GitLab.com or Bitbucket.org account, or your email
   address.

2. Click on `Add a View`. All the organizations that you have access to will be
   listed.

> If you do not see your desired organizations or Git repositories, make sure
> that
> [the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

> To create views from your GitHub repositories, you must install the Iterative
> Studio GitHub app. Refer to the section on
> [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
> details.

> To create views from repositories on your self-hosted GitLab server, you must
> first add a connection to this server and create a team. Refer to the section
> on
> [self-hosted GitLab server support](/doc/studio/user-guide/connect-custom-gitlab-server)
> for more details.

<admon type="info">

If you do not see your desired organizations or Git repositories, make sure that
[the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

To create views from your GitHub repositories, you must install the Iterative
Studio GitHub app. Refer to the section on
[GitHub app installation](/doc/studio/user-guide/install-github-app) for more
details.

To create views from repositories on your self-hosted GitLab server, you must
first add a connection to this server and create a team. Refer to the section on
[self-hosted GitLab server support](/doc/studio/user-guide/install-github-app)
for more details.

</admon>

3. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo.png)

4. Specify additional connection settings if required.

   ![](https://static.iterative.ai/img/studio/view_settings.png)

> View settings must be configured if you are connecting to a non-DVC
> repository, if your metrics are in some custom files, if you are connecting to
> a monorepo, or if your metrics are in cloud or other remote storage. However,
> you can configure the view settings after the view has been created. So, you
> can `Skip and Continue` now. Refer to the
> [View Settings](/doc/studio/user-guide/views-and-experiments/create-a-view)
> section for more details.

You should now see that a view has been added in your dashboard.

5. If your project requires any of the additional settings, then remember to
   configure them by opening the
   [view settings](/doc/studio/user-guide/views-and-experiments/create-a-view).
   Otherwise, your view may not work as expected. To go to view settings, click
   on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the view. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/view_open_settings.png)

### Create multiple views from a single Git repository

You can also create multiple views from a single Git repository and apply
different settings to them.

One use case for this is if you have a
[monorepo](https://en.wikipedia.org/wiki/Monorepo) that contains sub-directories
for multiple ML projects. If you want to create views for each of those ML
projects, simply create multiple views for this monorepo, and for each view,
specify a different sub-directory.

Refer to the
[View Settings](/doc/studio/user-guide/views-and-experiments/create-a-view)
section for more details on how to configure different settings (and
sub-directories) for the views.

### Create views shared across a team

You can [create teams](/doc/studio/user-guide/teams) with one or more team
members, also called collaborators.

Each team will have its own views dashboard, and the views that you create in
the team's dashboard will be accessible to all members of the team.

To add more than 2 collaborators in your team, you can
[upgrade it to the **Team** or **Enterprise** plan](/doc/studio/user-guide/change-team-plan-and-size).

## Sharing

You can [share a view within a team](#share-a-view-within-a-team). You can also
[make a view public](#make-a-view-public) to share it on the web.

### Share a view within a team

Each team that you [create in Iterative Studio](/doc/studio/user-guide/teams)
will have its own views dashboard. All the views that you create in the team's
dashboard will be accessible to all members (collaborators) of the team.

To add more than 2 collaborators in your team, you can
[upgrade it to the **Team** or **Enterprise** plan](/doc/studio/user-guide/change-team-plan-and-size).

### Make a view public

To share a view on the web (i.e., to make the view public), click on the button
labelled `Private` next to the name of the view. In the menu that pops up, turn
on `Share to Web`.

![](https://static.iterative.ai/img/studio/view_share.png)

You can change a shared (public) view and make it private by turning off
`Share to web`.

Views that are shared on the web can be opened by anyone, including people who
are not logged in to Iterative Studio. These anonymous users have the `Visitor`
role. Their access is limited to opening the view, applying filters, and
showing/hiding columns for themselves without making permanent changes to the
view. Refer to the [Roles](/doc/studio/user-guide/teams#roles) section for
details on the features available for different roles.

## Configuration

You can configure additional settings for your views. Some of these settings,
such as view name, are optional. Some other settings, such as data remotes, may
be required depending on how your Git repository has been set up.

### Scenarios when views settings are required

If you are connecting to a DVC repo which is at the root of the Git repository
and does not reference remote/cloud storage, then you can successfully visualize
it without configuring additional settings.

Alternatively, you could create views from:

- Non-DVC repositories
- Project sub-directories in a monorepo
- Custom files in your repository or remote/cloud storage

In each of these scenarios, you will need to configure additional settings for
Iterative Studio to be able to access the data required for visualization.

Additionally, you can also configure view settings to
[change the name](#view-name) of your view and to
[select mandatory columns](#mandatory-columns) to import in your view.

#### Non-DVC repositories

In the section on [preparing your repositories], you saw that you can use
Iterative Studio with DVC as well as non-DVC repositories. If you are connecting
to a non-DVC repository, then you will need to [specify the custom files] that
contain the metrics and hyperparameters that you want to visualize.

[preparing your repositories]: /doc/studio/user-guide/prepare-your-repositories
[specify the custom files]: #custom-metrics-and-parameters

#### Monorepo

Depending on how you have set up your Git repositories, your DVC repo (for which
you are trying to create the view) may not be in the root of your Git repo.
Instead, it could be in a sub-directory of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). If this is the case, you
will need to specify the full path to the sub-directory that you want to use
with your view.

#### Data remotes (cloud/remote storage)

The metrics and parameters that you want to include in the view may also be
present in a [data remote](/doc/command-reference/remote#description) (cloud
storage or another location outside the Git repo). If you want to include such
data in your views, then you will have to grant Iterative Studio access to the
data remote.

### Configuring view settings

You can configure a view's settings at any time after creating the view. For
this, click on the
![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon in
the view. In the menu that opens up, click on `Settings`.

#### View name

To change the view name, enter the new name for your view as shown below.

![](https://static.iterative.ai/img/studio/view_settings_view_name.png)

#### Project directory

If you have connected to a [monorepo](https://en.wikipedia.org/wiki/Monorepo),
then specify the full path to the sub-directory that contains the DVC repo for
which you want to create the view.

![](https://static.iterative.ai/img/studio/view_settings_sub_directory.png)

#### Data remotes / cloud storage credentials

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
(credentials) that you are configuring on Iterative Studio.

Note that Iterative Studio uses the credentials only to read plots/metrics files
if they are not saved into Git. It does not access any other data in your remote
storage. And you do not need to provide the credentials if any DVC data remote
in not used in your Git repository.

#### Mandatory columns

##### (Tracking scope)

If your repository exceeds 200 columns, Iterative Studio will import a subset.
The columns that are not imported will not be available to display in your view.
In the settings for "Mandatory columns", You can select which columns are
mandatory to import. Iterative Studio will also import unselected columns up to
a maximum of 200.

![](https://static.iterative.ai/img/studio/view_settings_mandatory_columns.png)

Note that some non-mandatory columns will also be imported if there are less
than 200 mandatory columns. If you would like to hide specific columns from your
view, you can do so in the view itself. For this, refer to
[Display preferences -> Columns](/doc/studio/user-guide/views-and-experiments/explore-ml-experiments#columns).

If your view is missing some required columns or includes columns that you do
not want, refer to the following troubleshooting sections to understand why this
may have happened.

- [View does not contain the columns that I want](/doc/studio/troubleshooting#view-does-not-contain-the-columns-that-i-want)
- [View contains columns that I did not import](/doc/studio/troubleshooting#view-contains-columns-that-i-did-not-import)

Note: The **Mandatory columns** section was earlier called **Tracking scope**.

#### Custom metrics and parameters

If you want to connect custom files, you can add them by clicking the `Add file`
button. Enter the full file path within your Git repository, and specify whether
the file is for `Metrics` or `Parameters`.

![](https://static.iterative.ai/img/studio/view_settings_custom_files.png)
