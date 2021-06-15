# Get Started with DVC Studio

DVC Studio works with the data, metrics and hyperparameters that you add to your
ML project repositories. You will need access to a GitHub, GitLab or Bitbucket
account with the Git repositories you want to connect. Using DVC Studio, you
will connect to your Git repositories and create views, which are interactive,
tabular representations of all your ML experiments. All the views that you
create are included in a central dashboard for easy access.

## Section outline

In this section, you will learn how to:

- [Access your DVC Studio dashboard](#access-your-dvc-studio-views-dashboard)
- [Prepare your Git repositories for use with DVC Studio](#prepare-your-repositories)

Then, in the [next section](/doc/studio/create-view), you will learn how to
create and share your own views by connecting to the Git repositories.

## Access your DVC Studio views dashboard

To open the DVC Studio dashboard, in your browser, open
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

You can dive deep into all the experiments committed to the repo. For this, open
the view by clicking the view name (in this case, `example-get-started`). An
experiements table will be generated for you to visualize and interact with your
ML experiments. The [Components of a View](/doc/studio/components-of-a-view)
section provides details on what is displayed in this table and how you can
interact with it.

## Prepare your repositories

DVC Studio creates views by identifying datasets, metrics and hyperparameters
defined in your Git repositories. These values are stored in your Git
repositories as CSV, JSON or YAML files. You can add these values to your Git
repositories in two ways:

1. **Set up DVC repositories**: You can use [DVC](https://dvc.org/) and Git to
   version your code, data and models all within your Git repositories. By using
   DVC, you can be sure not to bloat your repositories with large volumes of
   data or huge models. These large assets reside in the cloud or other remote
   storage locations. You will simply track their version info in Git.

   DVC also enables you to
   [share your data and model files](/doc/use-cases/sharing-data-and-model-files),
   [create data registries](/doc/use-cases/data-registries),
   [create data pipelines](/doc/start/data-pipelines), connect them with
   [CML](/doc/cml) for CI/CD in machine learning, and so on. Find more about the
   features and benefits of DVC [here](/doc/start).

   Refer to the [DVC documentation](https://dvc.org/doc) to initialize a DVC
   repository.

2. **Specify custom files with your metrics and parameters**: If you are working
   with a non-DVC repository, you can still create views for it provided that
   the metrics and hyperparameters are stored in CSV, JSON or YAML files. For
   instance, if you have an ML project for which you generate and save metrics
   either manually or using some ML tracking tools, then you can create a view
   for this project by specifying the file (within your Git repo) which contains
   your saved metrics.

   So as you can see, DVC Studio simply requires your metrics and
   hyperparameters to be available in data files in your Git repositories. This
   video further illustrates this concept.

   https://www.youtube.com/watch?v=5xM5az78Lrg
