# Get Started with DVC Studio

Here, we will walk you through a tutorial to use DVC Studio for collaboration on
your ML projects. You will need access to a GitHub, GitLab or Bitbucket account
with the Git repositories you want to connect. Using DVC Studio, you will
connect to your Git repositories and create views, which are interactive,
tabular representations of all your ML experiments.

In the rest of this section, you will:

- [Learn how to prepare your Git repositories for use with DVC Studio](#preparing-your-repositories)
- [Understand the DVC Studio views dashboard](#dvc-studio-views-dashboard)
- [Explore the different components of a view](#components-of-a-view)

## Preparing your repositories

DVC Studio creates views by identifying datasets, metrics and hyperparameters
defined in your Git repositories. These values are stored in your Git
repositories as CSV, JSON or YAML files. You can add these values to your Git
repositories in two ways:

1. **Set up DVC repositories**: You can use [DVC](https://dvc.org/) and Git to
   version your code, data and models all within your Git repositories. By using
   DVC, you can be sure not to bloat your repositories with large volumes of
   data or huge models. These large assets reside in the cloud or other remote
   storage locations. You will simply track their version info in Git. DVC also
   enables you to
   [share your data and model files](/doc/use-cases/sharing-data-and-model-files),
   [create data registries](/doc/use-cases/data-registries),
   [create data pipelines](/doc/start/data-pipelines), connect them with
   [CML](/doc/cml) for CI/CD in machine learning, and so on. Find more about the
   features and benefits of DVC [here](/doc/start).

   Refer to the [DVC documentation](https://dvc.org/doc) to initialize a DVC
   repository. You can then connect to this DVC repository and create a view as
   described in the [Create View](/doc/studio/create-view) section later. DVC
   Studio automatically detects metrics, plots, and hyperparameters files
   specified in the project's `dvc.yaml`. Each time you push a commit to this
   DVC repository, your view will reflect the new changes.

2. **Specify custom files with your metrics and parameters**: If you are working
   with a non-DVC repository, you can still create views for it provided that
   metrics and hyperparameters are stored in CSV, JSON or YAML files. To
   visualize such custom data, simply
   [specify the custom files](/doc/studio/view-settings#configuring-view-settings)
   to use, and DVC Studio will efficiently generate tables and plots for your
   custom input. For instance, if you have an ML project for which you generate
   and save metrics either manually or using some ML tracking tools, then you
   can create a view for this project by specifying the file (within your Git
   repo) which contains your saved metrics.

   So as you can see, DVC Studio simply requires your metrics and
   hyperparameters to be available in data files in your Git repositories. This
   video further illustrates this concept.

   https://www.youtube.com/watch?v=5xM5az78Lrg

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
