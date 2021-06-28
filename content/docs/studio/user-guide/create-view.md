# Create and Share a View

Views are interactive representations of the information stored in your Git
repositories. In this section, you will learn how to:

- [Create a view](#create-a-view)
- [Create multiple views from a single Git repository](#create-multiple-views-from-a-single-git-repository)
- [Share a view](#share-a-view)

## Create a View

You can create views from your Git repositories. DVC Studio automatically
detects metrics, plots, and hyperparameters files specified in the project's
`dvc.yaml`. If you are working with a non-DVC repository, you will need to
specify the custom files with your metrics and parameters.

To create a new view, follow these steps.

1. Sign in to your [DVC Studio](https://studio.iterative.ai/) dashboard using
   GitHub, GitLab or Bitbucket.

2. Click on `Add a View`. All the organizations that you have access to will be
   listed.

> To create views from your GitHub repositories, you must install the DVC Studio
> GitHub app. Refer to the section on
> [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
> details.

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
> [View Settings](/doc/studio/user-guide/view-settings) section for more
> details.

You should now see that a view has been added in your dashboard.

5. Configure [view settings](/doc/studio/user-guide/view-settings) if required.
   If your project requires any of the additional settings, then remember to
   configure them by opening the view settings. Otherwise, your view may not
   work as expected. To go to view settings, click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the view. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/view_open_settings.png)

## Create multiple views from a single Git repository

You can also create multiple views from a single Git repository and apply
different settings to them.

One use case for this is if you have a
[monorepo](https://en.wikipedia.org/wiki/Monorepo) that contains sub-directories
for multiple ML projects. If you want to create views for each of those ML
projects, simply create multiple views for this monorepo, and for each view,
specify a different sub-directory.

Refer to the [View Settings](/doc/studio/user-guide/view-settings) section for
more details on how to configure different settings (and sub-directores) for the
views.

## Share a view

You can share your views on the web. Simply click on the button labelled
`Private` next to the name of the view. In the menu that pops up, turn on
`Share to Web`.

![](https://static.iterative.ai/img/studio/view_share.png)

You can change a shared (public) view and make it private by turning off
`Share to web`.

Views that are shared on the web can be opened by anyone, including people who
are not logged in to DVC Studio. These anonymous users have the `Visitor` role.
Their access is limited to opening the view, applying filters, and
showing/hiding columns for themselves without making permanent changes to the
view. Refer to the [Roles](/doc/studio/user-guide/teams#roles) section for
details on the features available for different roles.
