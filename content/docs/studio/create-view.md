# Create and Share a View

Views are interactive representations of the information stored in your Git
repositories.

## Section outline

In this section, you will learn how to:

- [Create a view](#create-a-view)
- [Create multiple views from a single Git repository](#create-multiple-views-from-a-single-git-repository)
- [Share a view](#share-a-view)
- [Install and authorize DVC Studio GitHub app](#dvc-studio-github-app-installation)

Then, in the [next section](/doc/studio/explore-experiments), you will dive deep
into a view to explore the ML experiments and their results.

## Create a View

You can create views from your Git repositories, just like the `Demo` view you
saw in the last section. To create a new view, follow these steps.

1. Sign in to your [DVC Studio](https://studio.iterative.ai/) dashboard using
   GitHub, GitLab or Bitbucket.

2. Click on `Add a View`. All the organizations that you have access to will be
   listed.

> To create views from your GitHub repositories, you must install the DVC Studio
> GitHub app. Refer to the section on
> [GitHub app installation](#dvc-studio-github-app-installation) for more
> details.

3. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo_v2.png)

4. Specify additional connection settings if required.

   ![](https://static.iterative.ai/img/studio/view_settings_v2.png)

> View settings must be configured if you are connecting to a non-DVC
> repository, if your metrics are in some custom files, if you are connecting to
> a monorepo, or if your metrics are in cloud or other remote storage. However,
> you can configure the view settings after the view has been created. So, you
> can `Skip and Continue` now. Refer to the
> [View Settings](/doc/studio/view-settings) section for more details.

You should now see that a view has been added in your dashboard.

5. Configure [view settings](/doc/studio/view-settings) if required. If your
   project requires any of the additional settings, then remember to configure
   them by opening the view settings. Otherwise, your view may not work as
   expected. To go to view settings, click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon_v2.png)
   icon in the view. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/view_open_settings_v2.png)

## Create multiple views from a single Git repository

You can also create multiple views from a single Git repository and apply
different settings to them.

One use case for this is if you have a
[monorepo](https://en.wikipedia.org/wiki/Monorepo) that contains sub-directories
for multiple ML projects. If you want to create views for each of those ML
projects, simply create multiple views for this monorepo, and for each view,
specify a different sub-directory.

Refer to the [View Settings](/doc/studio/view-settings) section for more details
on how to configure different settings (and sub-directores) for the views.

## Share a view

You can share your views on the web. Simply click on the button labelled
`Private` next to the name of the view. In the menu that pops up, turn on
`Share to Web`.

![](https://static.iterative.ai/img/studio/view_share_v2.png)

You can change a shared (public) view and make it private by turning off
`Share to web`.

Views that are shared on the web can be opened by anyone, including people who
are not logged in to DVC Studio. These anonymous users have the `Visitor` role.
Their access is limited to opening the view, applying filters, and
showing/hiding columns for themselves without making permanent changes to the
view. Refer to the [Roles](/doc/studio/teams#roles) section for details on the
features available for different roles.

## DVC Studio GitHub app installation

If you are using a GitHub account, you will have to install the DVC Studio
GitHub app on the GitHub repositories/organizations that you want to use with
DVC Studio. When you try to create a view, if the app is not already installed,
DVC Studio will not be able to fetch the list of your GitHub repositories. In
this case, you will be prompted to configure Git integrations as shown below.

![](https://static.iterative.ai/img/studio/configure_git_integrations.png)

Click on the link to `Configure Git integrations settings`. This will open the
`Git integrations` section of your profile page.

![](https://static.iterative.ai/img/studio/configure_github.png)

Click on the `Configure` button, and you will be redirected to the GitHub page
to install and authorize the DVC Studio GitHub app.

> Note that you do not have to authorize DVC Studio on all the repositories in
> your GitHub organization. You can limit access to only repositories that you
> want to use with DVC Studio.
