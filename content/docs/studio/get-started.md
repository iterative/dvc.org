# Get Started with Iterative Studio

<admon>

We have renamed DVC Studio to Iterative Studio.

</admon>

First, sign in to your [Iterative Studio](https://studio.iterative.ai/)
dashboard using your GitHub.com, GitLab.com, or Bitbucket.org account, or with
your email address.

<admon type="tip">

When you sign up, you're on the **Free plan**. To switch to the **Basic plan**
[create a team] first, then go to the _Team settings_ to [change the plan]. To
sign up for the **Teams** or **Enterprise** plan, please [schedule a call] (see
[pricing details]).

</admon>

[create a team]: /doc/studio/user-guide/teams
[change the plan]:
  /doc/studio/user-guide/teams#change-your-team-plan-and-team-size
[schedule a call]: https://calendly.com/gtm-2/studio-introduction
[pricing details]: https://studio.iterative.ai/pricing

</admon>

## Explore demo project

1. If this is the first time you are signing in to Iterative Studio, you will
   see that there already exists a `Demo` project that connects to an example
   repository. Use this project to explore the features that Iterative Studio
   has to offer.

![](https://static.iterative.ai/img/studio/login_home_v3.png) _When you first
login, an example project is already created for you to explore, and you can add
more projects._

2. Each project on this dashboard displays the metrics that Iterative Studio
   identified in your Git repository. In the figure above, you can see that
   `avg_prec` and `roc_auc` metrics are displayed.

## Add your projects

1. To connect to a new repository, click on `Add a Project`. All the
   organizations that you have access to will be listed.

    <admon type="info">

   If you do not see your desired organizations or Git repositories, make sure
   that
   [the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

   To connect to your GitHub repositories, you must install the Iterative Studio
   GitHub app. Refer to the section on
   [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
   details.

   To connect to repositories on your self-hosted GitLab server, you must first
   add a connection to this server and create a team. Refer to the section on
   [self-hosted GitLab server support](/doc/studio/user-guide/teams#manage-connections-to-self-hosted-gitlab-servers)
   for more details.

    </admon>

2. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo_v3.png)

3. Specify additional connection settings if required.

   ![](https://static.iterative.ai/img/studio/project_settings.png)

> Project settings must be configured if you are connecting to a non-DVC
> repository, if your metrics are in some custom files, if you are connecting to
> a monorepo, or if your metrics are in cloud or other remote storage. However,
> you can configure the project settings after the project has been created. So
> you can `Skip and Continue` now. Refer to the [Project Settings] section for
> more details.

You should now see that a project has been added in your dashboard.

4. If your project requires any of the additional settings, then remember to
   configure them by opening the [project settings]. Otherwise, your project may
   not work as expected. To go to project settings, click on the
   ![](https://static.iterative.ai/img/studio/view_open_settings_icon.png) icon
   in the project. In the menu that opens up, click on `Settings`.

![](https://static.iterative.ai/img/studio/project_open_settings.png)

5. You can also [create multiple projects from a single Git repository].

## Explore and share your projects

1. You can use the project to [explore ML experiments].

2. You can [create a team] and invite collaborators. Each team will have its own
   projects dashboard. To create teams with more than 2 team members, [sign up
   for the **Basic**, **Teams** or **Enterprise** plan].

3. You can also [make your projects public].

## Run experiments and get live updates

1. You can use your project to [submit new experiments] from Iterative Studio.

2. For the experiments that you submit from Iterative Studio, you can [track
   live metrics and plots][live-metrics-and-plots] by using [DVCLive].

## Use model registry

1. Click on the `Models` tab to open the central [Models dashboard]. If any of
   your projects contain [GTO-annotated models], they will be listed here
   automatically.

   [models dashboard]:
     /doc/studio/user-guide/model-registry/view-models#models-dashboard
   [gto-annotated models]: /doc/studio/user-guide/model-registry/add-a-model

2. You can [add new models](/doc/studio/user-guide/model-registry/add-a-model)
   to the model registry by clicking on the `Add a model` button and following
   on-screen instructions. Models that are already in the repository as well as
   models stored in remote (cloud) storages can be registered in this way.

3. To
   [view the details](/doc/studio/user-guide/model-registry/view-models#model-details-page)
   of a model, click on the name of the model.

4. You can
   [register new versions](/doc/studio/user-guide/model-registry/register-version)
   of the models and
   [assign stages to them](/doc/studio/user-guide/model-registry/assign-stage)
   (e.g., development, staging, production).

[project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project
[create multiple projects from a single git repository]:
  /doc/studio/user-guide/projects-and-experiments/create-a-project#create-multiple-projects-from-a-single-git-repository
[explore ml experiments]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments
[create a team]: /doc/studio/user-guide/teams
[sign up for the **basic**, **teams** or **enterprise** plan]:
  /doc/studio/user-guide/change-team-plan-and-size
[make your projects public]:
  /doc/studio/user-guide/projects-and-experiments/share-a-project
[submit new experiments]:
  /doc/studio/user-guide/projects-and-experiments/run-experiments
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
