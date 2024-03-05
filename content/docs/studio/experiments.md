# Run and track experiments

You can submit your experiments from your favorite interface - whether it is
Jupyter Notebooks, a code editor or IDE like [VS Code](/doc/vs-code-extension),
the Python cli, the bash terminal, etc. To quickly start tracking your
experiments with DVC Studio:

- Click on `Add a project` to connect DVC Studio to your ML project's Git
  repository.

- In your model training environment, install [DVCLive]:

  ```cli
  $ pip install dvclive
  ```

- Set your
  [DVC Studio client access token](/doc/studio/user-guide/account-management#client-access-tokens):

  ```cli
  $ dvc studio login
  ```

- Use the DVCLive [`log_metric()`](/doc/dvclive/live/log_metric#livelog_metric)
  method in your model training code:

  ```python
  from dvclive import Live
  with Live() as live:
    for epoch in range(epochs):
      live.log_metric("accuracy", accuracy)
      live.log_metric("loss", loss)
      live.next_step()
  ```

- Run the training job:

  ```cli
  $ python train.py
  ```

- The metrics and plots will be [tracked live][live-metrics-and-plots] in the
  project in DVC Studio.

To walk through an example of how to get started with experiment tracking, see
[Get Started: Experiment Tracking](/doc/start/experiments/experiment-tracking).

## More ways to run and track experiments

DVC Studio offers more ways to run and track experiments - you can:

- set up reproducible pipelines with DVC,
- submit new experiments from the VS Code IDE.

For details on all these, check out the
[`experiment management user guide`](/doc/studio/user-guide/experiments).

[live-metrics-and-plots]:
  /doc/studio/user-guide/experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
