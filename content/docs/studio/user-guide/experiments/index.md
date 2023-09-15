# Experiment tracking and management

You can submit your experiments from your favorite interface - whether it is
Jupyter Notebooks, a code editor or IDE like [VS Code](/doc/vs-code-extension),
the Python cli, the bash terminal, etc. You can also [submit new experiments
from Iterative Studio][run-experiments].

You can track live as well as completed experiments in Iterative Studio. First,
click on `Add a project` to connect Iterative Studio to your ML project's Git
repository. Then, follow the instructions presented below.

## Track experiments in real-time

To quickly start tracking your experiments with Iterative Studio:

- In your model training environment, install [DVCLive]:

  ```cli
  pip install dvclive
  ```

- Copy your
  [DVC Studio token](/doc/studio/user-guice/account-and-billing#studio-access-token)
  and configure your model training environment to use the token:

  ```cli
  dvc config --global studio.token ***
  ```

- Use the DVCLive log_metric() method in your model training code:

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

- The metrics and plots will be [tracked live][live-metrics-and-plots] in the
  project in Iterative Studio.

## Track reproducible pipelines

To set up, run and track
[reproducible pipelines](/doc/start/experiments/experiment-pipelines):

- In your model training environment, install [DVC]:

  ```cli
  pip install dvc
  ```

- Initialize DVC in your Git repository:

  ```cli
  dvc init
  ```

  This will create a `dvc.yaml` file in the Git repository.

- Copy your
  [DVC Studio token](/doc/studio/user-guice/account-and-billing#studio-access-token)
  and
  [configure your model training environment to use the token](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots#set-up-an-access-token):

  ```cli
  dvc config --global studio.token ***
  ```

- [Set up the DVC
  pipeline]/doc/start/experiments/experiment-pipelines#creating-the-experiment-pipeline
  for model training.

- [Run an experiment](/doc/start/experiments/experiment-pipelines#modifying-parameters):

  ```cli
  dvc exp run
  ```

  Metrics, plots and other details of your experiment get saved in your
  project's `dvc.yaml` file.

- When the experiment completes,
  [push the results](/doc/start/experiments/experiment-collaboration#sharing):

  ```cli
  dvc exp push origin <exp_name>
  ```

- Iterative Studio reads the values of metrics, plots and other details from
  your project's `dvc.yaml` file, and displays them in an experiment row in the
  project table. The experiment row will appear nested within the parent Git
  commit row.

- From here, you can
  [persist the experiments](/doc/start/experiments/experiment-collaboration#persisting)
  as Git commits and PRs as well as
  [remove unnecessary experiments](/doc/start/experiments/experiment-collaboration#removing).

<admon type="tip">

If you are working with a **non-DVC repository**, you can
[indicate which files contain metrics and hyperparameters](/doc/studio/user-guide/projects-and-experiments/configure-a-project#custom-metrics-and-parameters)
that Iterative Studio should display in the project. However, we strongly
recommend using DVC to avail of all the features of Iterative Studio.

</admon>

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

## Visualize, compare and run experiments

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
