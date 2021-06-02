# Get Started with DVC Studio

Here, we will walk you through a tutorial to use DVC Studio for collaboration on
your ML projects. You will need access to a GitHub, GitLab or Bitbucket account
which has access to the Git repositories you want to connect. DVC Studio creates
[views](#what-is-a-view) from repositories when you connect to them.

The following video provides you a quick overview of DVC Studio.

https://www.youtube.com/watch?v=hKf4twg832g

## What is a view?

A _view_ is an interactive representation of the experiments run in your ML
project. DVC Studio identifies datasets, metrics and hyperparameters in your ML
experiments. These values can either be in DVC repositories or you can add
custom files with the required data. Refer to
[View settings](/doc/studio/view-settings) to understand the different ways in
which you can prepare your Git repository for use with DVC Studio. Using these
values, DVC Studio creates a View, which is a tabular presentation of all your
experiments along with their datasets, metrics ad hyperparameters. You can also
generate plots and compare experiments here.

## DVC Studio Views page

In your browser, open <https://studio.iterative.ai>. Sign in with your Github,
GitLab, or Bitbucket account.

![](https://static.iterative.ai/img/studio/login_home_v2.png) _When you first
login, an example view is already created for you to explore, and you can add
more views._

When you first login, you will find that there already exists a `Demo` view
connecting to an example DVC project. Use this view to explore the features that
DVC Studio has to offer.

DVC Studio automatically identifies datasets, metrics and hyperparameters in
your ML experiments. Each view on the dashboard displays the metrics. In the
figure above, you can see that `avg_prec` and `roc_auc` metrics are displayed.

## Components of a view

You can dive deep into all the experiments committed to the repo. For this, open
the view by clicking the view name (in this case, `example-get-started`).

A table will be generated as shown below. This includes metrics, hyperparameters
and information about the datasets. All these values are flattened and neatly
presented for you to evaluate and compare the experiments.

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
