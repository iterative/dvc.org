# Explore ML Experiments

The projects dashboard in Iterative Studio contains all your projects. Open a
project by clicking on its name. An experiments table for the project will be
generated as shown below. This includes metrics, hyperparameters, and
information about datasets and models.

![](https://static.iterative.ai/img/studio/view_components.png)

The major components of a project table are:

- [Git history and live experiments](#git-history-and-live-metrics) that show
  you the complete experimentation history as well as live metrics of running
  experiments.
- [Display preferences](#display-preferences) that let you show/hide branches,
  commits and columns, and re-arrange the table.
- Buttons to
  [visualize, compare, and run experiments](#visualize-compare-and-run-experiments).
- Button to [export project data](#export-project-data).

## Git history and live experiments

The branches and commits in your Git repository are displayed along with the
corresponding models, metrics, hyperparameters, and DVC-tracked files.

[New experiments submitted from Iterative Studio][run experiments] appear as
experiment commits, which are eventually pushed to Git. Experiments that you
push using the `dvc exp push` command as well as any live experiments that you
send using [DVCLive] are displayed in a special experiment row nested under the
parent Git commit. More details of how live experiments are displayed can be
found
[here](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots#view-live-metrics-and-plots).

To manually check for updates in your repository, use the `Reload` button 🔄
located above the project table.

<!-- To do: Replace the following image with one that contains dvc exp and live experiment rows.-->

![](https://static.iterative.ai/img/studio/view_components_1.gif)

## Display preferences

The table contains buttons to specify filters and other preferences regarding
which commits and columns to display.

![](https://static.iterative.ai/img/studio/view_components_2.gif)

### Filters:

You can filter the commits that you want to display by the following fields:

- **Branch:** The Git branch
- **Tag:** The Git tag
- **Author:** Author of the Git commit
- **Metric:** Values of different metrics. For instance, you can display only
  those experiments for which the value of `avg_prec` is greater than `0.9`.
- **Metric delta:** Change in the value of the metric. For instance, you can use
  this filter to only display those experiments for which the value of
  `avg_prec` changed by more than `0.1` compared to the baseline experiment.
- **Param:** Values of different parameters
- **File size:** Size of the data, model and other files corresponding to your
  experiments
- **File changed:** Whether or not any given file changed in the experiment

### Columns:

Select the columns you want to display and hide the rest.
![Showing and hiding columns](https://static.iterative.ai/img/studio/show_hide_columns.gif)

You can also click and drag the columns in the table to rearrange them.

If your project is missing some required columns or includes columns that you do
not want, refer to the following troubleshooting sections:

- [Project does not contain the columns that I want](/doc/studio/troubleshooting#project-does-not-contain-the-columns-that-i-want)
- [Project contains columns that I did not import](/doc/studio/troubleshooting#project-contains-columns-that-i-did-not-import)

### Hide commits:

Commits can be hidden from the project table in the following ways:

- **Iterative Studio auto-hides irrelevant commits:** Iterative Studio
  identifies commits where metrics, files and hyperparameters did not change and
  hides them automatically.
- **Iterative Studio auto-hides commits that contain `[skip studio]` in the
  commit message:** This is particularly useful if your workflow creates
  multiple commits per experiment and you would like to hide all those commits
  except the final one.

  For example, suppose you create a Git commit with hyper-parameter changes for
  running a new experiment, and your training CI job creates a new Git commit
  with the experiment results (metrics and plots). You may want to hide the
  first commit and only display the second commit, which has the new values for
  the hyper-parameters as well as experiment results. For this, you can use the
  string `[skip studio]` in the commit message of the first commit.

- **Hide commits and branches manually:** This can be useful if there are
  commits that do not add much value in your project. To hide a commit or
  branch, click on the 3-dot menu next to the commit or branch name and click on
  `Hide commit` or `Hide branch`.
- **Unhide commits:** You can unhide commits as needed, so that you don't lose
  any experimentation history. To display all hidden commits, click on the
  `Show hidden commits` toggle (refer [the above gif](#display-preferences)).
  This will display all hidden commits, with a `hidden` (closed eye) indicator.
  To unhide any commit, click on the 3-dot menu for that commit and click on
  `Show commit`.

### Selected only:

Toggle between showing and hiding experiments that you have not selected.

### Delta mode:

Toggle between absolute values and difference from the baseline row.

### Save changes:

Save your filters or column display preferences so that these preferences remain
intact even after you log out of Iterative Studio and log back in later.

## Visualize, compare and run experiments

Use the following buttons to visualize, compare and run experiments:

- **Plots:** Open the `Plots` pane and [display plots] for the selected commits.
- **Trends:** [Generate trend charts] to see how the metrics have changed over
  time.
- **Compare:** [Compare experiments] side by side.
- **Run:** [Run experiments] and [track results in real
  time][live-metrics-and-plots].

These buttons appear above your project table as shown below.
![example export to csv](https://static.iterative.ai/img/studio/project_action_buttons_big_screen.png)

On smaller screens, the buttons might appear without text labels, as shown
below.

![example export to csv](https://static.iterative.ai/img/studio/project_action_buttons_small_screen.png)

## Export project data

The button to export data from the project table to CSV is present next to the
[`Delta mode`](#delta-mode) button.

![export to csv](https://static.iterative.ai/img/studio/project_export_to_csv.png)

Below is an example of the downloaded CSV file.

![example export to csv](https://static.iterative.ai/img/studio/project_export_to_csv_example.png)

[display plots]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#display-plots-and-images
[Compare experiments]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#compare-experiments
[run experiments]:
  /doc/studio/user-guide/projects-and-experiments/run-experiments
[live-metrics-and-plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[Generate trend charts]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#generate-trend-charts
