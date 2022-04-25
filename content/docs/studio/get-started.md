# Get Started with Iterative Studio

The following video provides you a quick overview of how to use Iterative
Studio.

https://www.youtube.com/watch?v=hKf4twg832g

1. Sign in to your [Iterative Studio](https://studio.iterative.ai/) dashboard
   using your GitHub.com, GitLab.com or Bitbucket.org account, or your email
   address.

   <admon type="info">

   When you sign up with your email address, Studio will send you a verification
   email before you can login.

   </admon>

2. If this is the first time you are signing in to Iterative Studio, you will
   see that there already exists a `Demo` view that connects to an example DVC
   project. Use this view to explore the features that Iterative Studio has to
   offer.

![](https://static.iterative.ai/img/studio/login_home.png) _When you first
login, an example view is already created for you to explore, and you can add
more views._

3. Each view on this dashboard displays the metrics that Iterative Studio
   identified in your Git repository. In the figure above, you can see that
   `avg_prec` and `roc_auc` metrics are displayed.

4. To create a new view, click on `Add a View`. All the organizations that you
   have access to will be listed.

    <admon type="info">

   If you do not see your desired organizations or Git repositories, make sure
   that
   [the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

   To create views from your GitHub repositories, you must install the Iterative
   Studio GitHub app. Refer to the section on
   [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
   details.

   To create views from repositories on your self-hosted GitLab server, you must
   first add a connection to this server and create a team. Refer to the section
   on
   [self-hosted GitLab server support](/doc/studio/user-guide/install-github-app)
   for more details.

    </admon>

5. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo.png)

6. Specify additional connection settings if required.

   ![](https://static.iterative.ai/img/studio/view_settings.png)

> View settings must be configured if you are connecting to a non-DVC
> repository, if your metrics are in some custom files, if you are connecting to
> a monorepo, or if your metrics are in cloud or other remote storage. However,
> you can configure the view settings after the view has been created. So, you
> can `Skip and Continue` now. Refer to the
> [View Settings](/doc/studio/user-guide/views/view-settings) section for more
> details.

You should now see that a view has been added in your dashboard.

7. If your project requires any of the additional settings, then remember to
   configure them by opening the
   [view settings](/doc/studio/user-guide/views/view-settings). Otherwise, your
   view may not work as expected. To go to view settings, click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the view. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/view_open_settings.png)

8. You can also
   [create multiple views from a single Git repository](/doc/studio/user-guide/views/create-view#create-multiple-views-from-a-single-git-repository).

9. After creating a view, you can use it to
   [explore the ML experiments](/doc/studio/user-guide/explore-experiments) as
   well as
   [submit new experiments from Iterative Studio](/doc/studio/user-guide/run-experiments).

10. You can also make the view public by
    [sharing it on the web](/doc/studio/user-guide/views/share-view).
