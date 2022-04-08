# Create a View

To create a new view, follow these steps.

1. Sign in to your [Iterative Studio](https://studio.iterative.ai/) dashboard
   using your GitHub.com, GitLab.com or Bitbucket.org account, or your email
   address.

   <admon type="info">

   When you sign up with your email address, Studio will send you a verification
   email before you can login.

   </admon>

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
> [View Settings](/doc/studio/user-guide/views/view-settings) section for more
> details.

You should now see that a view has been added in your dashboard.

5. If your project requires any of the additional settings, then remember to
   configure them by opening the
   [view settings](/doc/studio/user-guide/views/view-settings). Otherwise, your
   view may not work as expected. To go to view settings, click on the
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

Refer to the [View Settings](/doc/studio/user-guide/views/view-settings) section
for more details on how to configure different settings (and sub-directories)
for the views.
