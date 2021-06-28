# Get Started with DVC Studio

The following video provides you a quick overview of how to use DVC Studio.

https://www.youtube.com/watch?v=hKf4twg832g

1. Sign in to your [DVC Studio](https://studio.iterative.ai/) dashboard using
   GitHub, GitLab or Bitbucket.

   The DVC Studio views dashboard opens.

2. If this is the first time you are signing in to DVC Studio, you will see that
   there already exists a `Demo` view that connects to an example DVC project.
   Use this view to explore the features that DVC Studio has to offer.

![](https://static.iterative.ai/img/studio/login_home.png) _When you first
login, an example view is already created for you to explore, and you can add
more views._

3. Each view on this dashboard displays the metrics that DVC Studio identified
   in your Git repository. In the figure above, you can see that `avg_prec` and
   `roc_auc` metrics are displayed.

4. To create a new view, click on `Add a View`. All the organizations that you
   have access to will be listed.

> To create views from your GitHub repositories, you must install the DVC Studio
> GitHub app. Refer to the section on
> [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
> details.

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
> [View Settings](/doc/studio/user-guide/view-settings) section for more
> details.

You should now see that a view has been added in your dashboard.

7. Configure [view settings](/doc/studio/user-guide/view-settings) if required.
   If your project requires any of the additional settings, then remember to
   configure them by opening the view settings. Otherwise, your view may not
   work as expected. To go to view settings, click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the view. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/view_open_settings.png)

8. You can also create multiple views from a single Git repository and apply
   different settings to them.

9. To share your views on the web, click on the button labelled `Private` next
   to the name of the view. In the menu that pops up, turn on `Share to Web`.

10. You can dive deep into all the experiments committed to the repo. For this,
    open the view by clicking the view name (in this case,
    `example-get-started`). An experiements table will be generated for you to
    visualize and interact with your ML experiments as well as submit new
    experiments. The
    [Components of a View](/doc/studio/user-guide/explore-experiments#components-of-a-view)
    section provides details on what is displayed in this table and how you can
    interact with it.
