<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Visualize and Compare Experiments

You can visualize and compare experiments using plots, images, charts, etc. You
can also
[export the project table as CSV](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#export-project-data),
so that you can use the data with any external reporting or visualization tool
of your choice.

## Display plots and images

You can visualize certain metrics of machine learning experiments as plots.
Usual plot examples are AUC curves, loss functions, and confusion matrices,
among others. For DVC repositories, the plots are defined in `dvc.yaml` (plots
field). Refer to the [DVC plots documentation](/doc/command-reference/plots) for
details on how to add plots to your repositories.

### Types of plots

Iterative Studio can work with two types of plots files in your repository:

1. Data series files, which can be JSON, YAML, CSV or TSV. Data from these files
   will populate your AUC curves, loss functions, confusion matrices and other
   metric plots.
2. Image files in JPEG, GIF, or PNG format. These images will be displayed as-is
   in Iterative Studio.

Plots can be
[pipeline outputs](/doc/user-guide/experiment-management/visualizing-plots#plot-outputs)
or
[top-level](/doc/user-guide/experiment-management/visualizing-plots#top-level-plots).
Below is a sample `dvc.yaml` file with 2 plots in the `evaluate` stage and a
top-level plot using data from `runtime_logs/logs.csv`.

```yaml
stages:
  evaluate:
    cmd: python src/evaluate.py
    deps: ...
    plots:
      - output/predictions.json:
          template: confusion
          x: actual
          y: predicted
      - output/misclassified_samples/:
          cache: false
plots: runtime_logs/logs.csv
```

As you can see,

- metrics from `output/predictions.json` will be plotted in a confusion matrix,
- images in the `output/misclassified_samples/` directory will be displayed
  directly,
- data from `runtime_logs/logs.json` will be rendered using the default (linear)
  template.

For images, you can also specify a single image file (eg,
`output/misclassified_sample1.png`) instead of a directory.

### How to generate plots

To generate the plots, select one or more experiments (represented by the
commits), and click on the `Show plots` button.

The plots will appear in the plots pane. If you have selected more than one
experiment, you can use the plots to compare them.

![](https://static.iterative.ai/img/studio/plots.png)

### Live plots

You can [send live updates to your plots][live-metrics-and-plots] by using
[DVCLive]. The number of recent updates to the live metrics are displayed in the
`Live` icon as shown
[here](/doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#git-history-and-live-metrics).

Live plots are also shown in the plots pane, just like all other plots.

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
