# How Iterative Studio Works

[Iterative Studio](https://studio.iterative.ai/) works closely with your Git
ecosystem. Once you connect Iterative Studio to your ML project Git
repositories, Iterative Studio parses specific files and Git tags as listed
below:

- `dvc.yaml` file is used to identify data, metrics, plots and hyperparameters
- `artifacts.yaml` file is used to identify ML models
- specially formatted Git tags are used to identify model versions and stage
  assignments
- data sent to the live metrics end-point are used to identify live metrics and
  plots (in real-time)

<admon type='info'>

If you are not using DVC, you can separately
[indicate which files contain metrics and hyperparameters](/doc/studio/user-guide/projects-and-experiments/configure-a-project#custom-metrics-and-parameters).
However, we strongly recommend using DVC to avail of all the features of
Iterative Studio.

</admon>

Iterative Studio presents parsed data in the following pages:

- All connected projects are included in a central projects dashboard.
- Each project has a separate
  [project details page (also called experiment table)](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#components-of-a-project)
- All identified models are included in a
  [models dashboard](/doc/studio/user-guide/model-registry/view-models#models-dashboard)
- Each model has a separate
  [model details page](/doc/studio/user-guide/model-registry/view-models#model-details-page).

## How Iterative Studio runs experiments and model actions

- When you [run new experiments] or
  [add models to your model registry](/doc/studio/user-guide/model-registry/add-a-model)
  in Iterative Studio, it creates Git commits and pull requests with the
  changes.
- You can set up your CI/CD actions (e.g. GitHub Actions) to run model training
  upon the creation of Git commits, tags or pull requests. You can use [CML] in
  your CI/CD actions for continuous machine learning. And you can use [DVCLive]
  to [send live updates for training metrics and plots to Iterative
  Studio][live-metrics-and-plots].
- When you
  [register new versions](/doc/studio/user-guide/model-registry/register-version)
  of your ML models or
  [assign stages](/doc/studio/user-guide/model-registry/assign-stage) to them,
  Iterative Studio creates annotated Git tags representing the actions.

The following video illustrates how Iterative Studio works with data from your
ML projects and experiments.

https://www.youtube.com/watch?v=5xM5az78Lrg

_Note that we have renamed DVC Studio mentioned in the above video to Iterative
Studio and Views to Projects._

[dvc]: https://dvc.org/
[cml]: https://cml.dev
[mlem]: https://mlem.ai/
[gto]: https://mlem.ai/doc/gto
[git]: https://git-scm.com/
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[run new experiments]:
  /doc/studio/user-guide/projects-and-experiments/run-experiments
[dvclive]: /doc/dvclive
