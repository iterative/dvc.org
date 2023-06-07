<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Visualize and Compare Experiments

You can visualize and compare experiments using plots, images, metrics, etc. You
can also
[export the project table as CSV](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#export-project-data),
so that you can use the data with any external reporting or visualization tool
of your choice.

## Display plots and images

You can visualize certain metrics of machine learning experiments as plots.
Usual plot examples are AUC curves, loss functions, and confusion matrices,
among others. The easiest way to start is with [DVCLive], which will
automatically generate plots data and configure them to be visualized. Iterative
Studio supports all [DVC plots], which can plot two types of files in your
repository:

1. Data series files, which can be JSON, YAML, CSV or TSV. Data from these files
   will populate your AUC curves, loss functions, confusion matrices and other
   metric plots.
2. Image files in JPEG, GIF, or PNG format. These images will be displayed as-is
   in Iterative Studio.

To display the plots, select one or more experiments (represented by the
commits), and click on the `Show plots` button.

The plots will appear in the plots pane. If you have selected more than one
experiment, you can use the plots to compare them.

![](https://static.iterative.ai/img/studio/plots.png)

## Live plots

You can [send live updates to your plots][live-metrics-and-plots] with
[DVCLive]. The number of recent updates to the live metrics are
[displayed](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#git-history-and-live-metrics)
in the `Live` icon. Live plots are also shown and updated in real-time in the
plots pane along with all other plots.

## Generate trend charts

Click on the `Trends` button to generate a plot of how the metrics changed over
the course of the different experiments. For each metric, the trend charts show
how the metric changed from one commit to another. You can include one or more
branches in the trend chart.

![](https://static.iterative.ai/img/studio/trends.png)

## Compare experiments

To compare different experiments, select two experiments (represented by the
commits), and click on the `Compare` button. The metrics, parameters and files
in the selected experiments will be displayed side by side for easy comparison.

![](https://static.iterative.ai/img/studio/compare.png)

[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvclive]: /doc/dvclive
[dvc plots]: /doc/user-guide/experiment-management/visualizing-plots
