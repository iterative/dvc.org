# Explore ML Experiments

The projects dashboard in Iterative Studio contains all your projects. Click on
a project name to open the project table, which contains:

- [Git history and live experiments](#git-history-and-live-metrics) of the
  project
- [Display preferences](#display-preferences)
- Buttons to
  [visualize, compare, and run experiments](#visualize-compare-and-run-experiments).
- Button to [export project data](#export-project-data).

## Git history and live experiments

Branches and commits in your Git repository are displayed along with the
corresponding models, metrics, hyperparameters, and DVC-tracked files.

Experiments that you push using the `dvc exp push` command as well as any live
experiments that you send using [DVCLive] are displayed in a special experiment
row nested under the parent Git commit. More details of how live experiments are
displayed can be found
[here](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots#view-live-metrics-and-plots).

To manually check for updates in your repository, use the `Reload` button 🔄
located above the project table.

<!-- To do: Replace the following image with one that contains dvc exp and live experiment rows.-->

![](https://static.iterative.ai/img/studio/view_components_1.gif)

### Nested branches

When a Git branch is merged into another branch (e.g., `main`), two
possibilities exist:

- The user continues to push more commits to the merged branch, which means that
  the merged branch contains some commits that are not present in `main`. In
  this scenario, the project table will display both the `main` branch and the
  merged branch.

- The user does NOT push any more commits to the merged branch, which means that
  the merged branch does NOT contain any commits that are not present in `main`.

  In this scenario, Iterative Studio considers the merged branch as **"nested"**
  and does not display it as a separate branch in the project table. This helps
  to keep the project table concise when there are many branches that get merged
  into `main` (or some other branch) over time; including all the merged
  branches in the project table would make the table very large without adding
  much informational value.

## Display preferences

The table contains buttons to specify filters and other preferences regarding
which commits and columns to display.

### Filters:

Click on the `Filters` button to specify which rows you want to show in the
project table.

![Project filters](https://static.iterative.ai/img/studio/project_filters.png)

There are two types of filters:

- **Quick filters** (highlighted in orange above): Use the quick filter buttons
  to

  - Show only DVC experiments
  - Show only selected experiments
  - Toggle hidden commits (include or exclude hidden commits in the project
    table)

- **Custom filters** (highlighted in purple above): Filter commits by one or
  more of the following fields:

  - Column values (values of metrics, hyperparameters, etc.) and their deltas
  - Git related fields such as Git branch, commit message, tag and author

    <admon type="info">

    The `Branch`filter displays only the specified branch and its commits.

    On the other hand, the `Commits on branch` filter will also display branches
    that contain any commits **in common** with the specified branch. This is
    useful when
    [some Git branches are nested inside other branches](#nested-branches),
    because of which the nested branches are not displayed in the project table.
    If you use the `Commits on branch = feature-branch-1` filter, commits from
    this branch are included in the result. These commits appear within the
    branch into which the nested branch was merged (e.g., `main`). A hint is
    present indicating that the commits are part of the nested branch
    `feature-branch-1`.

    ![Result of commits on branch filter](https://static.iterative.ai/img/studio/commits_on_branch_filter.png)

    </admon>

### Columns:

Select the columns you want to display and hide the rest.
![Showing and hiding columns](https://static.iterative.ai/img/studio/show_hide_columns.gif)

If your project is missing some required columns or includes columns that you do
not want, refer to the following troubleshooting sections:

- [Project does not contain the columns that I want](/doc/studio/troubleshooting#project-does-not-contain-the-columns-that-i-want)
- [Project contains columns that I did not import](/doc/studio/troubleshooting#project-contains-columns-that-i-did-not-import)

To reorder the columns, click and drag them in the table or from the Columns
dropdown.
![Showing and hiding columns](https://static.iterative.ai/img/studio/reorder_columns.gif)

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

  ![Hide commit](https://static.iterative.ai/img/studio/hide_commit.png)

- **Unhide commits:** You can unhide commits as needed, so that you don't lose
  any experimentation history. To display all hidden commits, click on the
  `Show hidden commits` toggle (refer [filters](#filters)). This will display
  all hidden commits, with a `hidden` (closed eye) indicator.

  ![Hidden commit indicator](https://static.iterative.ai/img/studio/hidden_commit_indicator.png)

  To unhide any commit, click on the 3-dot menu for that commit and click on
  `Show commit`.

  ![Show hidden commit](https://static.iterative.ai/img/studio/show_hidden_commit.png)

### Delta mode

You can display either the absolute values of the columns (metrics,
hyperparameters, etc) or their delta (difference) from the baseline row. To
toggle between these two options, use the `Delta mode` button.

![Delta mode](https://static.iterative.ai/img/studio/delta_mode.png)

### Save changes:

Whenever you make any changes to your project's columns, commits or filters, a
notification to save or discard your changes is displayed at the top of the
project table. Saved changes remain intact even after you log out of Iterative
Studio and log back in later.

![Save or discard changes](https://static.iterative.ai/img/studio/save_discard_changes.png)

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

[DVCLive]: /doc/dvclive
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
