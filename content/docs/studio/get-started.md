# Get Started with DVC Studio

Here, we will walk you through a tutorial to use DVC Studio for collaboration on
your ML projects. You will need access to a GitHub, GitLab or Bitbucket account
with the Git repositories you want to connect. Using DVC Studio, you will
connect to your Git repositories and create views, which are interactive,
tabular representations of all your ML experiments.

The following video provides you a quick overview of DVC Studio.

https://www.youtube.com/watch?v=hKf4twg832g

In the rest of this section, you will:

- [Learn how to prepare your Git repositories for use with DVC Studio](#preparing-your-repositories)
- [Understand the DVC Studio views dashboard](#dvc-studio-views-dashboard)
- [Explore the different components of a view](#components-of-a-view)

## Preparing your repositories

DVC Studio identifies datasets, metrics and hyperparameters in your Git
repositories. These values can either be in DVC repositories or you can add
custom files with the required values. Read more about the different ways in
which you can prepare your Git repository for use with DVC Studio
[here](/doc/studio/view-settings#non-dvc-repositories).

## DVC Studio Views dashboard

By identifying the datasets, metrics and hyperparameters in your Git
repositories, DVC Studio creates a view, which is an interactive, tabular
representation of all your ML experiments.

All the views that you create are included in a central dashboard for easy
access. To open this dashboard, in your browser, open
<https://studio.iterative.ai>. Sign in with your Github, GitLab, or Bitbucket
account. The DVC Studio views dashboard opens. If this is the first time you are
signing in to DVC Studio, you will see that there already exists a `Demo` view
that connects to an example DVC project. Use this view to explore the features
that DVC Studio has to offer.

![](https://static.iterative.ai/img/studio/login_home_v2.png) _When you first
login, an example view is already created for you to explore, and you can add
more views._

Each view on this dashboard displays the metrics that DVC Studio identified in
your Git repository. In the figure above, you can see that `avg_prec` and
`roc_auc` metrics are displayed.

## Components of a view

You can dive deep into all the experiments committed to the repo. For this, open
the view by clicking the view name (in this case, `example-get-started`).

A table will be generated as shown below. This includes metrics, hyperparameters
and information about the datasets. All these values are flattened and neatly
presented for you.

In this tabular display, you will not only see your complete experiment history,
you can also generate plots, visualize trends, compare experiments, and even run
new experiments.

![](https://static.iterative.ai/img/studio/view_components_v2.png)

This tabular display has the following components:

- The branches in your Git repository.
- All commits in each branch. Each commit, corresponding to a single row in the
  table, represents an experiment.
- Values of all the metrics, files and parameters in the given commits;
  corresponding to the table columns.
- Various buttons for performing actions:
  - **Filters:** Filter commits
  - **Columns:** Select columns to display
  - **Show plots:** Show plots for the selected commits
  - **Compare:** Compare different experiments
  - **Run:** Run experiments by selecting any one commit (Refer
    [here](/doc/studio/run-experiments) for how to run experiments)
  - **Trends:** Generate trend charts to show metric evolution over time
  - **Delta mode:** Toggle between absolute values and difference from the first
    row

You can connect to additional repositories and add more views as needed. You'll
find out how to do this in the next section.
