# Run and track experiments

You can submit your experiments from your favorite interface - whether it is
Jupyter Notebooks, a code editor or IDE like [VS Code](/doc/vs-code-extension),
the Python cli, the bash terminal, etc. To quickly start tracking your
experiments with DVC Studio:

- Click on `Add a project` to connect DVC Studio to your ML project's Git
  repository.

- In your model training environment, install [DVCLive]:

  ```cli
  pip install dvclive
  ```

- Copy your
  [DVC Studio token](/doc/studio/user-guide/account-and-billing#studio-access-token)
  and
  [configure your model training environment to use the token](/doc/studio/user-guide/experiments/live-metrics-and-plots#set-up-an-access-token):

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

- Run the training job:

  ```cli
  python train.py
  ```

- The metrics and plots will be [tracked live][live-metrics-and-plots] in the
  project in DVC Studio.

## More ways to run and track experiments

DVC Studio offers more ways to run and track experiments - you can:

- set up reproducible pipelines with DVC,
- submit new experiments from the VS Code IDE.

For details on all these, check out the
[`experiment management user guide`](/doc/studio/user-guide/experiments).

[live-metrics-and-plots]:
  /doc/studio/user-guide/experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
