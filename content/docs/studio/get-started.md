# Get Started with Iterative Studio

The following video provides you a quick overview of how to use Iterative
Studio.

https://www.youtube.com/watch?v=hKf4twg832g

1. Sign in to your [Iterative Studio](https://studio.iterative.ai/) dashboard
   using your GitHub.com, GitLab.com or Bitbucket.org account, or your email
   address.

<admon type="info">

When you sign up, you're on the **Free plan** by default. To sign up for the
**Team plan**, you should first [create a team](/doc/studio/user-guide/teams).
Then go to the [team's settings page](/doc/studio/user-guide/teams#settings) and
in the `Plan and billing` section, click on `Change plan`. To sign up for the
**Enterprise plan**,
[contact us](https://calendly.com/gtm-2/studio-introduction). To compare the
different plans, check out our
[pricing details](https://studio.iterative.ai/pricing).

</admon>

2. If this is the first time you are signing in to Iterative Studio, you will
   see that there already exists a `Demo` project that connects to an example
   DVC project. Use this project to explore the features that Iterative Studio
   has to offer.

![](https://static.iterative.ai/img/studio/login_home.png) _When you first
login, an example project is already created for you to explore, and you can add
more projects._

3. Each project on this dashboard displays the metrics that Iterative Studio
   identified in your Git repository. In the figure above, you can see that
   `avg_prec` and `roc_auc` metrics are displayed.

4. To create a new project, click on `Add a Project`. All the organizations that
   you have access to will be listed.

    <admon type="info">

   If you do not see your desired organizations or Git repositories, make sure
   that
   [the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

   To create projects from your GitHub repositories, you must install the
   Iterative Studio GitHub app. Refer to the section on
   [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
   details.

   To create projects from repositories on your self-hosted GitLab server, you
   must first add a connection to this server and create a team. Refer to the
   section on
   [self-hosted GitLab server support](/doc/studio/user-guide/install-github-app)
   for more details.

    </admon>

5. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo.png)

6. Specify additional connection settings if required.

   ![](https://static.iterative.ai/img/studio/view_settings.png)

> Project settings must be configured if you are connecting to a non-DVC
> repository, if your metrics are in some custom files, if you are connecting to
> a monorepo, or if your metrics are in cloud or other remote storage. However,
> you can configure the project settings after the project has been created. So,
> you can `Skip and Continue` now. Refer to the
> [Project Settings](/doc/studio/user-guide/projects/project-settings) section
> for more details.

You should now see that a project has been added in your dashboard.

7. If your project requires any of the additional settings, then remember to
   configure them by opening the
   [project settings](/doc/studio/user-guide/projects/project-settings).
   Otherwise, your project may not work as expected. To go to project settings,
   click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the project. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/view_open_settings.png)

8. You can also
   [create multiple projects from a single Git repository](/doc/studio/user-guide/projects/create-project#create-multiple-projects-from-a-single-git-repository).

9. After creating a project, you can use it to
   [explore the ML experiments](/doc/studio/user-guide/explore-experiments) as
   well as
   [submit new experiments from Iterative Studio](/doc/studio/user-guide/run-experiments).

10. You can also make the project public by
    [sharing it on the web](/doc/studio/user-guide/projects/share-project).

11. You can [create a team](/doc/studio/user-guide/teams) and invite
    collaborators. Each team will have its own projects dashboard. To create
    teams with more than 2 team members,
    [sign up for the **Team** plan or **Enterprise** plan](/doc/studio/user-guide/change-team-plan-and-size).
