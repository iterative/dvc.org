# Experiment tracking and management

To track and manage experiments,
[create a project](/doc/studio/uer-guide/experiments/create-a-project) in
Iterative Studio. A project is an interactive representation of the ML datasets,
hyperparameters, models and metrics defined in your Git repositories. These
values are configured in your project's `dvc.yaml` file. Additionally, live
metrics that you [send to Iterative Studio][live-metrics-and-plots] using
[DVCLive] are also included in the project.

Within a project, you can:

- [Explore all the details of the experiments][explore-ml-experiments] that you
  have pushed to your Git repository.
- [Visualize the experiments][visualize] using plots and trend charts.
- [Compare experiments][compare].
- [Run new experiments][run-experiments], including on your own cloud instances,
  directly from Iterative Studio.
- [Track live metrics and plots][live-metrics-and-plots] by sending them to
  Iterative Studio by using [DVCLive].

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

## Different ways to track experiments

Iterative Studio offers a few different ways to track your experiments.

We recommend combining all these methods in a single project, so that you can
easily track live and completed experiments.

### 1. To track experiments in real-time, use [DVCLive]:

- Install [DVCLive]:

  ```cli
  pip install dvclive
  ```

- Copy your DVC Studio token and configure your model training environment to
  use the token:

  ```cli
  dvc config --global studio.token ***
  ```

- Add DVCLive to your model training code:

  ```python
  from dvclive import Live
  with Live(save_dvc_exp=True) as live:
    for epoch in range(epochs):
      live.log_metric("accuracy", accuracy)
      live.log_metric("loss", loss)
      live.next_step()
  ```

  Find the list of all supported frameworks [here](/doc/dvclive/ml-frameworks)

- Run the training job:

  ```cli
  python train.py
  ```

- The metrics and plots will be updated in the project in real-time. [Learn
  more][live-metrics-and-plots]

### 2. To track outputs of reproducible pipelines, [initialize DVC](https://dvc.org/doc):

- Install [DVC]:

  ```cli
  pip install dvc
  ```

- Initialize DVC in your Git repository:

  ```cli
  dvc init
  ```

  This will create a `dvc.yaml` file in the Git repository.

- When running your experiments, save your metrics, plots, models and other
  files to `dvc.yaml`. You can automate this by [setting up DVC pipelines].

- After the experiment completes, commit and push the `dvc.yaml` file to your
  Git remote.

- Studio reads the values of metrics, plots, models and other details from this
  `dvc.yaml`.

### 3. To avoid over-crowding your Git history, use `dvc exp push`

- Once you have initialized DVC, you can also use the `dvc exp push` command to
  **push experiments without creating separate Git commits** for them.

- To notify Iterative Studio when you push experiments using `dvc exp push`,
  [configure the `DVC_STUDIO_TOKEN` environment variable](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots#set-up-an-access-token).

If you are working with a **non-DVC repository**, you can
[indicate which files contain metrics and hyperparameters](/doc/studio/user-guide/projects-and-experiments/configure-a-project#custom-metrics-and-parameters)
that Iterative Studio should display in the project. However, we strongly
recommend using DVC to avail of all the features of Iterative Studio.

To **run new experiments** from Iterative Studio, add credentials with
sufficient access to your cloud. Optionally, set up Continuous Integration (CI)
to run experiments automatically on CI triggers. [Learn more][run-experiments]

[on project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#non-dvc-repositories
[projects]: /doc/studio/user-guide/projects-and-experiments/what-is-a-project
[explore-ml-experiments]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments
[visualize]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare
[compare]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#compare-experiments
[run-experiments]:
  /doc/studio/user-guide/projects-and-experiments/run-experiments
[model-registry]: /doc/studio/user-guide/model-registry/what-is-a-model-registry
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
[store and share your data and model files]:
  /doc/start/data-management/data-versioning#storing-and-sharing
[create data registries]: /doc/use-cases/data-registry
[create data pipelines]: /doc/start/data-management/data-pipelines
[ci/cd in machine learning]: /doc/use-cases/ci-cd-for-machine-learning
