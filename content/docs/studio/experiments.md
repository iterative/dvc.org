# Run and track experiments

1. A project displays your live and complete experiments, including Git commits
   and refs. For each experiment, you can compare metrics, parameters, plots,
   and other files.

   ![Project table with live plots](https://static.iterative.ai/img/studio/project-table-with-live-plots.gif)

2. Click on `Add a Project` and connect to the Git repository for your Machine
   Learning project.

3. Iterative Studio offers a
   [few different ways to track your experiments](/doc/studio/user-guide/experiments#different-ways-to-track-experiments).
   To get started quickly, you can track experiments in real-time using
   [DVCLive]:

   - Install DVCLive:

     `pip install dvclive`

   - Copy your DVC Studio token and configure your model training environment to
     use the token:

     `dvc config --global studio.token ***`

   - Add DVCLive to your model training code:

     ```python
     from dvclive import Live
     with Live(save_dvc_exp=True) as live:
       for epoch in range(epochs):
         live.log_metric("accuracy", accuracy)
         live.log_metric("loss", loss)
         live.next_step()
     ```

   - Run the training job:

     `python train.py`

4. The metrics will be updated in the project table in real-time.

5. Open the `Plots` pane to view the live updates to your plots.

For more details, check out the
[`experiment management user guide`](/doc/studio/user-guide/experiments).

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
