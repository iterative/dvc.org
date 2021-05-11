# Get Started with DVC Studio

Here, we will walk you through a tutorial to use DVC Studio for collaboration on
your ML projects. You will need access to a Github, Gitlab or Bitbucket account
which has access to the Git repositories you want to connect to from DVC Studio.
DVC Studio creates views from repositories when you connect to them.

## What is a view?

A *view* is an interactive representation of the experiments run in your ML
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

## Components of a view

DVC Studio automatically identifies datasets, metrics and hyperparameters in
your ML experiments. Each view on the dashboard displays the metrics. In the
example view shown above, you can see that `avg_prec` and `roc_auc` metrics are
displayed.

You can dive deep into all the experiments committed to the repo. For this, open
the view by clicking on the view name (in this case, `example-get-started`).

A table will be generated as shown below. This includes metrics, hyperparameters
and information about the datasets. All the data is flattened and neatly
presented for your to evaluate and compare the experiments.

![](/img/studio/main.png) _Replace this image with an image that has labels for
the individual sections._

This tabular display has the following components:

1. The branches on your Git repository.
2. All the commits in the branches. Each commit represents an experiment. Each
   commit is on a single row in the table.
3. Values of all the metrics, files and parameters in the given commits. The
   different types of values are presented in different columns in the table.
4. Following buttons for performing actions:
   - **Filters:** Filter commits
   - **Columns:** Select columns to display
   - **Show plots:** Show plots, by selecting one or more commits that have
     plots
   - **Compare:** Compare different experiements
   - **Run:** Run experiments, by selecting any one commit (Refer here for how
     to run experiments)
   - **Trends:** Generate trend charts to show how the metrics eveolved over
     time
   - **Delta mode:** Change the displayed values to be differentials over the
     values in the first row

You can connect to additional repositories and add more views as needed. You can
find out how to do this in the next section.
