# How Iterative Studio Works

[Iterative Studio](https://studio.iterative.ai/) works very closely with your
Git ecosystem. It parses the metadata found in your ML project repositories to
present organized data, hyperparameters, models, and metrics on a web UI. It
also parses and displays live metrics and plots sent by [DVCLive]; these don't
need to be pushed to the Git repositories.

The following video illustrate how Iterative Studio works with data from your ML
projects and experiments.

<admon>

Note that we have renamed DVC Studio to Iterative Studio and Views to Projects.

</admon>

https://www.youtube.com/watch?v=5xM5az78Lrg

## How you save your project data

- Using [DVC] and [Git], you will push all your ML experiments to your GitHub,
  GitLab or Bitbucket repositories.
- Using Iterative Studio, or using [GTO] and possibly [MLEM], you will push
  information about your ML models as Git commits and tags.
- Using [DVCLive], you will push live metrics and plots from your experiments to
  Iterative Studio. Note that at the moment, live metrics are supported only for
  experiments that you [submit from the Iterative Studio
  UI][run new experiments].

## How Iterative Studio extracts your project data

- When you connect to the Git repositories from Iterative Studio, the project's
  `dvc.yaml` is used to identify all the data, metrics and hyperparameters in
  your experiments.
- If you are not using DVC, you can
  [add the metrics and hyperparameters to your Git repositories manually](/doc/studio/user-guide/projects-and-experiments/configure-a-project#custom-metrics-and-parameters).
- Details of your ML models, including versions and stage assignments, are
  extracted from the Git commits and tags.
- Live metrics and plots for experiments committed to Git are extracted from the
  data you send using [DVCLive].

## How Iterative Studio presents your project data

- Iterative Studio creates an
  [interactive, tabular representation](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#components-of-a-project)
  of all the identified values, including live metrics.
- All the projects that you have created are presented in a central projects
  dashboard.
- All identified models are included in an interactive
  [models dashboard](/doc/studio/user-guide/model-registry/view-models#models-dashboard)
  and individual
  [model details pages](/doc/studio/user-guide/model-registry/view-models#model-details-page).

## How Iterative Studio runs experiments and model actions

- When you [run new experiments] or
  [add models to your model registry](/doc/studio/user-guide/model-registry/add-a-model)
  in Iterative Studio, it creates Git commits and pull requests with the
  changes.
- You can set up your CI/CD actions (e.g. GitHub Actions) to run model training
  upon the creation of Git commits, tags or pull requests. You can use [CML] in
  your CI/CD actions for continuous machine learning. And you can use [DVCLive]
  to [send live metrics of model training to Iterative
  Studio][live-metrics-and-plots].
- When you
  [register new versions](/doc/studio/user-guide/model-registry/register-version)
  of your ML models or
  [assign stages](/doc/studio/user-guide/model-registry/assign-stage) to them,
  Iterative Studio creates annotated Git tags representing the actions.

[dvc]: https://dvc.org/
[cml]: https://cml.dev
[mlem]: https://mlem.ai/
[gto]: https://mlem.ai/doc/gto
[git]: https://git-scm.com/
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[run new experiments]:
  (/doc/studio/user-guide/projects-and-experiments/run-experiments)
[dvclive]: /doc/dvclive
