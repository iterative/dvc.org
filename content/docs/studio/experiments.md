# Run and track experiments

You can submit your experiments from your favorite interface - whether it is
Jupyter Notebooks, a code editor or IDE like VS Code, the Python cli, the bash
terminal, etc. To quickly start tracking your experiments with Iterative Studio:

- Click on `Add a project` to connect Iterative Studio to your ML project's Git
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

- Use the DVCLive log_metric() method in your model training code:

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
  project in Iterative Studio.

## More ways to run and track experiments

Iterative Studio offers more ways to run and track experiments - you can:

- set up reproducible pipelines with DVC,
- submit new experiments from the VS Code IDE,
- submit new experiments from Iterative Studio, and have them run in your own
  cloud infrastructure.

For details on all these, check out the
[`experiment management user guide`](/doc/studio/user-guide/experiments).

[project settings]: /doc/studio/user-guide/experiments/configure-a-project
[when do you need project settings]:
  /doc/studio/user-guide/experiments/configure-a-project#scenarios-where-project-settings-are-required
[create multiple projects from a single git repository]:
  /doc/studio/user-guide/experiments/create-a-project#create-multiple-projects-from-a-single-git-repository
[explore ml experiments]:
  /doc/studio/user-guide/experiments/explore-ml-experiments
[create a team]: /doc/studio/user-guide/team-collaboration
[sign up for the **basic** or **enterprise** plan]:
  /doc/studio/user-guide/change-team-plan-and-size
[make your projects public]: /doc/studio/user-guide/experiments/share-a-project
[train on the cloud, including on your own cloud infrastructure, and submit new experiments]:
  /doc/studio/user-guide/experiments/run-experiments
[live-metrics-and-plots]:
  /doc/studio/user-guide/experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
[monorepo]: /doc/studio/user-guide/experiments/configure-a-project#monorepo
