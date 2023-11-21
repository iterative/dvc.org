# Experiment tracking and management

You can submit your experiments from your favorite interface - whether it is
Jupyter Notebooks, a code editor or IDE like [VS Code](/doc/vs-code-extension),
the Python cli, the bash terminal, etc.

You can track live as well as completed experiments in DVC Studio. First, click
on `Add a project` to connect DVC Studio to your ML project's Git repository.
Then, follow the instructions presented below.

## Track experiments in real-time

To quickly start tracking your experiments with DVC Studio:

- In your model training environment, install [DVCLive]:

  ```cli
  pip install dvclive
  ```

- Copy your
  [DVC Studio token](/doc/studio/user-guide/account-and-billing#studio-access-token)
  and configure your model training environment to use the token:

  ```cli
  dvc config --global studio.token ***
  ```

- Use the DVCLive [`log_metric()`](/doc/dvclive/live/log_metric#livelog_metric)
  method in your model training code:

  ```python
  from dvclive import Live
  with Live(save_dvc_exp=True) as live:
    for epoch in range(epochs):
      live.log_metric("accuracy", accuracy)
      live.log_metric("loss", loss)
      live.next_step()
  ```

  <admon type="tip">

  DVCLive has implemented
  [callbacks for several popular ML frameworks](/doc/dvclive/ml-frameworks)
  which simplify adding experiment tracking capabilities to your projects.

  </admon>

- Run the training job:

  ```cli
  python train.py
  ```

- The metrics and plots will be [tracked live][live-metrics-and-plots] in the
  project in DVC Studio.

## Track reproducible pipelines

To set up, run and track
[reproducible pipelines](/doc/start/experiments/experiment-pipelines):

- In your model training environment, install [DVC](https://dvc.org/):

  ```cli
  pip install dvc
  ```

- Initialize DVC in your Git repository:

  ```cli
  dvc init
  ```

  This will create a `dvc.yaml` file in the Git repository.

- Copy your
  [DVC Studio token](/doc/studio/user-guide/account-and-billing#studio-access-token)
  and
  [configure your model training environment to use the token](/doc/studio/user-guide/experiments/live-metrics-and-plots#set-up-an-access-token):

  ```cli
  dvc config --global studio.token ***
  ```

- [Set up the DVC pipeline](/doc/start/experiments/experiment-pipelines#creating-the-experiment-pipeline)
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

- DVC Studio reads the values of metrics, plots and other details from your
  project's `dvc.yaml` file, and displays them in an experiment row in the
  project table. The experiment row will appear nested within the parent Git
  commit row.

- From here, you can
  [persist the experiments](/doc/start/experiments/experiment-collaboration#persisting)
  as Git commits and PRs as well as
  [remove unnecessary experiments](/doc/start/experiments/experiment-collaboration#removing).

## Visualize, compare and run experiments

Within a project, you can:

- [Explore all the details of the experiments][explore-ml-experiments] that you
  have pushed to your Git repository.
- [Visualize the experiments][visualize] using plots and trend charts.
- [Compare experiments][compare].
- [Track live metrics and plots][live-metrics-and-plots] by sending them to DVC
  Studio by using [DVCLive].

[explore-ml-experiments]:
  /doc/studio/user-guide/experiments/explore-ml-experiments
[visualize]: /doc/studio/user-guide/experiments/visualize-and-compare
[compare]:
  /doc/studio/user-guide/experiments/visualize-and-compare#compare-experiments
[live-metrics-and-plots]:
  /doc/studio/user-guide/experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
