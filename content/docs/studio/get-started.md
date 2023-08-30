# Get Started with Iterative Studio

Sign in to [Iterative Studio](https://studio.iterative.ai/) using your
GitHub.com, GitLab.com, or Bitbucket.org account, or with your email address.
Upon sign-in, the Projects dashboard opens. It includes some `Demo` projects for
you to explore.

<admon type="tip">

When you sign up, you're on the **Free plan**. To switch to the **Basic plan**
[create a team] first, then go to the _Team settings_ to [change the plan]. To
sign up for the **Enterprise** plan, please [schedule a call] (see [pricing
details]).

</admon>

[create a team]: /doc/studio/user-guide/teams
[change the plan]:
  /doc/studio/user-guide/teams#change-your-team-plan-and-team-size
[schedule a call]: https://calendly.com/gtm-2/studio-introduction
[pricing details]: https://studio.iterative.ai/pricing

</admon>

## Run and track experiments

1. Iterative Studio works with Git repositories. So first, [prepare your Git
   repositories] and make sure that
   [the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

[prepare your git repositories]:
  /doc/studio/user-guide/projects-and-experiments/what-is-a-project#prepare-your-repositories

2. Click on `Add a Project` and follow the on-screen instructions to search and
   connect to the desired Git repository. Optionaly pass a sub-directory path
   (or up to 10 comma-separated values) on the settings screen if you use a
   [monorepo] setup.

   <admon type="info">

   Once the project is created, remember to [configure project
   settings][project settings] if [needed][when do you need project settings].

   </admon>

3. Iterative Studio identifies [experiments](/doc/start#experiment-management),
   which are Git commits or Git refs, and parses your project's `dvc.yaml` file
   as well as the experiments to identify hyperparameters, metrics, plots,
   models and other details.

4. Each project on the Projects dashboard displays the metrics of the first
   three columns in your project (such as `avg_prec` and `roc_auc` in the
   following project). You can change which metrics are shown here by reordering
   columns in the project table.

   ![](https://static.iterative.ai/img/studio/project_card.png)

5. Click on the project name to open the project table and [explore all your ML
   experiments][explore ML experiments].

   ![Project table with live plots](https://static.iterative.ai/img/studio/project-table-with-live-plots.gif)

6. You can [train on the cloud, including on your own cloud infrastructure, and
   submit new experiments] by changing hyperparameters and datasets.

7. To [track live metrics and plots][live-metrics-and-plots] of running
   experiments, set the `STUDIO_ACCESS_TOKEN` environment variable and use
   [DVCLive] in your training pipeline.

## Manage models

1. Click on the `Models` tab to open the central [Models dashboard]. Iterative
   Studio uses your project's `dvc.yaml` files to identify ML models and
   specially formatted Git tags to identify model versions and stage
   assignments.

   [models dashboard]:
     /doc/studio/user-guide/model-registry/view-and-compare-models#models-dashboard

2. Click on the model name to
   [open its details page](/doc/studio/user-guide/model-registry/view-and-compare-models#model-details-page).

3. You can perform the following actions to manage the lifecycle of models:
   - [Add models to the registry](/doc/studio/user-guide/model-registry/add-a-model)
   - [Register new versions of the models](/doc/studio/user-guide/model-registry/register-version)
     (like `v0.0.1` and `v1.0.0`)
   - [Assign stages to model versions](/doc/studio/user-guide/model-registry/assign-stage)
     (e.g. `dev`, `testing`, `prod`)
   - Use models:
     [download them](/doc/studio/user-guide/model-registry/use-models) or
     [set up CI/CD](/doc/studio/user-guide/model-registry/use-models) to publish
     or deploy models

Check out
[`What is a model registry?`](/doc/studio/user-guide/model-registry/what-is-a-model-registry)
to get started.

## Collaborate

1. You can [create a team] and invite collaborators. Each team will have its own
   projects dashboard. To create teams with more than 2 team members, [sign up
   for the **Basic** or **Enterprise** plan].

2. You can also [make your projects public].

[project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project
[when do you need project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#scenarios-where-project-settings-are-required
[create multiple projects from a single git repository]:
  /doc/studio/user-guide/projects-and-experiments/create-a-project#create-multiple-projects-from-a-single-git-repository
[explore ml experiments]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments
[create a team]: /doc/studio/user-guide/teams
[sign up for the **basic** or **enterprise** plan]:
  /doc/studio/user-guide/change-team-plan-and-size
[make your projects public]:
  /doc/studio/user-guide/projects-and-experiments/share-a-project
[train on the cloud, including on your own cloud infrastructure, and submit new experiments]:
  /doc/studio/user-guide/projects-and-experiments/run-experiments
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
[monorepo]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#monorepo
