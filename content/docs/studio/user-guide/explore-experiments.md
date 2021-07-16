# Explore ML Experiments

When you create a view by connecting to a Git repository, the view is added to
your DVC Studio dashboard. You can dive deep into the views shown in your DVC
Studio dashboard to explore all the ML experiments, visualize and compare them,
and run new experiments. For this, open the view by clicking the view name (in
this case, `example-get-started`).

A table will be generated as shown below. This includes metrics, hyperparameters
and information about the datasets. All these values are flattened and neatly
presented for you.

![](https://static.iterative.ai/img/studio/view_components.png)

## Components of a view

The tabular display has different components that show you the complete
experiment history as well as enable to you to generate plots, compare
experiments, run new experiments, etc.

### Git history

The branches and commits in your Git repository are displayed along with the
corresponding metrics, files and hyperparameters.

![](https://static.iterative.ai/img/studio/view_components_1.gif)

### Display preferences

The table contains buttons to specify filters and other preferences regarding
what columns and values to display.

![](https://static.iterative.ai/img/studio/view_components_2.gif)

- **Filters:** You can filter the commits that you want to display by the
  following fields:
  - **Branch:** The Git branch
  - **Tag:** The Git tag
  - **Author:** Author of the Git commit
  - **Metric:** Values of different metrics. For instance, you can display only
    those experiments for which the value of `avg_prec` is greater than `0.9`.
  - **Metric delta:** Change in the value of the metric. For instance, you can
    use this filter to only display those experiments for which the value of
    `avg_prec` changed by more than `0.1` compared to the baseline experiment.
  - **Param:** Values of different parameters
  - **File size:** Size of the data, model and other files corresponding to your
    experiments
  - **File changed:** Whether or not any given file changed in the experiment
- **Columns:** Select the columns you want to display and hide the rest.
  Additionally, you can click and drag the columns in the table to rearrange
  them as per your preferences.
- **Selected only:** Use this toggle switch to show/hide experiments that you
  have not selected.
- **Delta mode:** Toggle between absolute values and difference from the first
  row.
- **Save changes:** Save your filters or column display preferences so that
  these preferences remain intact even after you log out of DVC Studio and log
  back in later.

### Visualize, compare and run experiments.

The table also contains buttons to visualize, compare and run experiments.

![](https://static.iterative.ai/img/studio/view_components_3.gif)

- **Show plots:** Show plots for the selected commits. When you click on this
  button, plots for the selected commits are displayed in the bottom half of
  your browser window.
- **Compare:** Compare different experiments side by side.
- **Run:** Run experiments by selecting any one commit. Refer
  [here](/doc/studio/user-guide/run-experiments) for details on how to run
  experiments.
- **Trends:** Generate trend charts to show metric evolution over time.
