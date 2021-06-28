# How DVC Studio works

[`DVC Studio`](https://studio.iterative.ai/) works with the data, metrics and
hyperparameters that you add to your ML project Git repositories. It works very
closely with your Git ecosystem. Using DVC and Git, you will push all your ML
experiments to your GitHub, GitLab or Bitbucket repositories. When you connect
to these repositories from DVC Studio, the experiments are parsed to identify
all the data, metrics and hyperparameters. DVC Studio then creates a view, which
is an interactive, tabular representation of these values.

In the view, you can:

- Explore all the details of the experiments that you have pushed to your Git
  repository.
- Visualize the experiments using plots and trend charts.
- Compare experiments.
- Run new experiments by submitting new Git commits directly from DVC Studio.

If you are not using DVC, you can also add the metrics and hyperparameters to
your Git repositories manually. DVC Studio can parse such manually added content
as well.

You can connect to multiple Git repositories and create views for them. You can
also create multiple views from a single repository and apply different settings
to them. All the views that you create are presented in a central dashboard for
easy access.

To faciliate collaboration, DVC Studio enables you to create teams and add
collborators with different roles. The collborators can share views to work on
them together. You can even make your views public with read-only access.
