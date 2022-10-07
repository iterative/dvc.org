<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# What is a Project in Iterative Studio

A project in Iterative Studio is an interactive representation of the
information that your Git repository stores about your ML experiments and
models.

When you connect to your Git repository from Iterative Studio, the Git commits
and tags in the repository are parsed to identify all the data, metrics,
hyperparameters and models. These values are then presented in an experiment
table with each experiment (Git commit) in a row and the corresponding values
for the data, metrics, hyperparameters and models in columns.

Live metrics that you [send to Iterative Studio][live-metrics-and-plots] using
[DVCLive] are also included in the project table.

<admon>

For Iterative Studio to extract the required values from your Git repositories,
the values must be stored as described in the section about
[preparing your repositories](/doc/studio/user-guide/prepare-your-repositories).

</admon>

![](https://static.iterative.ai/img/studio/view_components.png) _A project
presents information stored in your Git repository and live metrics in an
interactive table._

All the projects that you have created are presented in a central projects
dashboard. This dashboard opens up whenever you login to Iterative Studio.

![](https://static.iterative.ai/img/studio/projects_dashboard.png) _All the
projects that you create are presented in a projects dashboard for easy access._

<admon type="tip">

ML models across all your projects are presented in a [Model Registry].

[model registry]: /doc/studio/user-guide/model-registry/

</admon>

Within a project, you can:

- [Explore all the details of the experiments][explore-ml-experiments] that you
  have pushed to your Git repository.
- [Visualize the experiments][visualize] using plots and trend charts.
- [Compare experiments][compare].
- [Run new experiments][run-experiments] by submitting new Git commits directly
  from Iterative Studio.
- [Track live metrics and plots][live-metrics-and-plots] by sending them to
  Iterative Studio by using [DVCLive].

In the following sections, you will see how to create, configure and share
projects.

[explore-ml-experiments]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments
[visualize]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare
[compare]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#compare-experiments
[run-experiments]:
  /doc/studio/user-guide/projects-and-experiments/run-experiments
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
