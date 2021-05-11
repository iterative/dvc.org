# Get Started with DVC Studio

Here, we will walk you through a tutorial to use DVC Studio for collaboration on
your ML projects. You will need access to a Github, Gitlab or Bitbucket account
which has access to the Git repositories you want to connect to from DVC Studio.
DVC Studio creates views from repositories when you connect to them.

## What is a view?

A _view_ is an interactive representation of the experiments run in your ML
project. DVC Studio automatically identifies datasets, metrics and
hyperparameters in your ML experiments. You can also add custom files with the
required data (more on this later). Using this data, DVC Studio creates a
summary view. This includes tables of all the metrics across all your
experiments. You can also generate plots and compare experiments here.

## Access your first view

In your browser, open <https://viewer.iterative.ai>. Sign in with your Github,
Gitlab, or Bitbucket account.

![](/img/studio/login_home.png) _When you first login, an example view is
already created for you to explore, and you can add more views._

When you first login, you will find that there already exists a view connecting
to an example DVC project. Use this view to explore the features that DVC Studio
has to offer.

DVC Studio automatically identifies datasets, metrics and hyperparameters in
your ML experiments. Each view on the dashboard displays the metrics. In the
figure above, you can see that `avg_prec` and `roc_auc` metrics are displayed.

## Components of a view

You can dive deep into all the experiments committed to the repo. For this, open
the view by clicking on the view name (in this case, `example-get-started`).

A table will be generated as shown below. This includes metrics, hyperparameters
and information about the datasets. All the data is flattened and neatly
presented for you to evaluate and compare the experiments.

![](/img/studio/main.png)

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
  - **Compare:** Compare different experiements
  - **Run:** Run experiments by selecting any one commit (Refer
    [here](/doc/studio/run-experiments) for how to run experiments)
  - **Trends:** Generate trend charts to show metric evolution over time
  - **Delta mode:** Toggle between absolute values and difference from the first
    row

You can connect to additional repositories and add more views as needed. You can
find out how to do this in the next section.
