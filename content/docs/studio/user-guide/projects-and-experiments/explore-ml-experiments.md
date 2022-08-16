<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Explore ML Experiments

When you create a project by connecting to a Git repository, the project is
added to your Iterative Studio dashboard. You can dive deep into the projects
shown in your Iterative Studio dashboard to explore all the ML experiments,
visualize and compare them, and run new experiments. For this, open the project
by clicking the project name (in this case, `example-get-started`).

An experiments table for the project will be generated as shown below. This
includes metrics, hyperparameters, and information about datasets and models.

![](https://static.iterative.ai/img/studio/view_components.png)

## Components of a project

The experiments table of the project has different components that show you the
complete experiment history as well as enable to you to generate plots, compare
experiments, run new experiments, etc. The major components of the table are:

- [Git history](#git-history) - represents your experimentation history.
- [Display preferences](#display-preferences) - show/hide branches, commits and
  columns, and re-arrange the table.
- Buttons to
  [visualize, compare, and run experiments](#visualize-compare-and-run-experiments).

### Git history

The branches and commits in your Git repository are displayed along with the
corresponding models, metrics, hyperparameters, and DVC-tracked files.

![](https://static.iterative.ai/img/studio/view_components_1.gif)

### Display preferences

The table contains buttons to specify filters and other preferences regarding
which commits and columns to display.

![](https://static.iterative.ai/img/studio/view_components_2.gif)

#### Filters:

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

#### Columns:

Select the columns you want to display and hide the rest.
![Showing and hiding columns](https://static.iterative.ai/img/studio/show_hide_columns.gif)

Additionally, you can click and drag the columns in the table to rearrange them
as per your preferences.

If your project is missing some required columns or includes columns that you do
not want, refer to the following troubleshooting sections to understand why this
may have happened.

- [Project does not contain the columns that I want](/doc/studio/troubleshooting#project-does-not-contain-the-columns-that-i-want)
- [Project contains columns that I did not import](/doc/studio/troubleshooting#project-contains-columns-that-i-did-not-import)

#### Hide commits:

The following functionality are available for you to hide irrelevant commits
from the table.

- **Iterative Studio auto-hides irrelevant commits:** Iterative Studio
  identifies commits where metrics, files and hyperparameters did not change and
  hides them automatically.
- **Hide commits and branches manually:** You can selectively hide commits and
  branches. This can be useful if there are commits that do not add much value
  in your project. To hide a commit or branch, click on the 3-dot menu next to
  the commit or branch name and click on `Hide commit` or `Hide branch`.
- **Unhide commits:** You can unhide commits as needed, so that you don't lose
  any experimentation history. To display all hidden commits, click on the
  `Show hidden commits` toggle (refer [the above gif](#display-preferences)).
  This will display all hidden commits, with a `hidden` (closed eye) indicator.
  To unhide any commit, click on the 3-dot menu for that commit and click on
  `Show commit`.

#### Selected only:

Use this toggle switch to show/hide experiments that you have not selected.

#### Delta mode:

Toggle between absolute values and difference from the first row.

#### Save changes:

Save your filters or column display preferences so that these preferences remain
intact even after you log out of Iterative Studio and log back in later.

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
