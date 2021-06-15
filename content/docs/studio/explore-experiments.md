# Explore ML Experiments

You can dive deep into the views shown in your DVC Studio dashboard to explore
all the ML experiments, visualize and compare them, and run new experiments.

## Section outline

In this section, you will:

- [Learn how to open the details of a view](#open-a-view)
- [Understand the different components of a view](#components-of-a-view)

Then, in the [next section](/doc/studio/visualize-experiments), you will explore
the different tools that you can use to visualize and compare experiments.

## Open a view

When you create a view by connecting to a Git repository, the view is added to
your DVC Studio dashboard. You can dive deep into all the experiments committed
to the repository. For this, open the view by clicking the view name (in this
case, `example-get-started`).

A table will be generated as shown below. This includes metrics, hyperparameters
and information about the datasets. All these values are flattened and neatly
presented for you.

In this tabular display, you will not only see your complete experiment history,
you can also generate plots, visualize trends, compare experiments, and even run
new experiments.

![](https://static.iterative.ai/img/studio/view_components_v2.png)

## Components of a view

The tabular display has the following components:

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
