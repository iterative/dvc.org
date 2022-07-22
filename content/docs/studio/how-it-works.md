# How Iterative Studio Works

[Iterative Studio](https://studio.iterative.ai/) works with the data, metrics,
hyperparameters and model metadata that you add to your ML project Git
repositories. It works very closely with your Git ecosystem.

This video illustrates how Iterative Studio works closely with your Git
ecosystem.

> Note that we have renamed DVC Studio to Iterative Studio and Views to
> Projects.

https://www.youtube.com/watch?v=5xM5az78Lrg

## How your project data is saved

- Using [DVC] and [Git], you will push all your ML experiments to your GitHub,
  GitLab or Bitbucket repositories as Git commits.
- Using Iterative Studio, or using the command line interface (CLI) of [GTO],
  and possibly [MLEM], you will push all your ML model details to the Git
  repositories as Git commits and Git tags.

## How Iterative Studio extracts your project data

- When you connect to these Git repositories from Iterative Studio, the
  project's `dvc.yaml` is used to identify all the data, metrics and
  hyperparameters in your experiments.
- If you are not using DVC, you can
  [add the metrics and hyperparameters to your Git repositories manually](/doc/studio/user-guide/projects-and-experiments/configure-a-project#custom-metrics-and-parameters).
- Details of your ML models, including versions and stage assignments, are
  extracted from the Git commits and tags.

## How Iterative Studio presents your project data

- Iterative Studio creates an
  [interactive, tabular representation](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#components-of-a-project)
  of all the identified values.
- All the projects that you have created are presented in a central projects
  dashboard.
- All identified models are included in an interactive
  [models dashboard](/doc/studio/user-guide/model-registry/view-models#models-dashboard)
  and individual
  [model details pages](/doc/studio/user-guide/model-registry/view-models#model-details-page).

## How Iterative Studio saves updates to your ML projects

- When you
  [run new experiments](/doc/studio/user-guide/projects-and-experiments/run-experiments)
  or
  [add models to your model registry](/doc/studio/user-guide/model-registry/add-a-model)
  in Iterative Studio, it creates Git commits and pull requests with the
  changes.
- You can set up your CI/CD actions (e.g. GitHub Actions) to run model training
  upon the creation of Git commits, tags or pull requests. You can use [CML] in
  your CI/CD actions for continuous machine learning.
- When you
  [register new versions](/doc/studio/user-guide/model-registry/register-version)
  of your ML models or
  [assign stages](/doc/studio/user-guide/model-registry/assign-stage) to them,
  Iterative Studio creates annotated Git tags representing the actions.

[dvc]: https://dvc.org/
[cml]: https://cml.dev
[mlem]: https://mlem.ai/
[gto]: https://github.com/iterative/gto
[git]: https://git-scm.com/
