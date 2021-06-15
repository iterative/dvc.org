# Run Experiments

You can run your ML experiments directly from DVC Studio.

## Section outline

In this section, you will:

- [Understand how DVC Studio runs your ML experiments](#how-dvc-studio-runs-ml-experiments)
- [Learn how to submit new experiments](#submit-a-new-experiment)

Then, in the [next section](/doc/studio/view-settings), you will learn about
additional settings that you can configure for your views.

## How DVC Studio runs ML experiments

If your Git repository is To run experiments from DVC Studio, you need to set up
your regular your regular CI/CD set-up is used to run the experiments. You will

If your Git repository is integrated with a CI/CD setup (e.g. GitHub Actions),
then on each Git commit, the CI/CD setup will get invoked. If this setup
includes a model training process, it will be triggered, which means that your
ML experiment will run automatically. You simply submit the data and
hyperparameter changes for your new experiment using the DVC Studio UI, and your
regular CI/CD setup will get invoked to run the experiments.

The model training can happen on any cloud or Kubernetes. For more details on
how to set up CI/CD pipelines for your ML project, refer to
[CML](https://cml.dev).

> Note that due to access restrictions, you cannot run experiments on the demo
> view (`example-get-started`) that is provided to you by default. Once you
> create views for your ML project repositories, you can follow the instructions
> given below to run experiments directly from DVC Studio.

## Submit a new experiment

Watch this video for an overview of how you can run experiments from DVC Studio,
or read below for details.

https://www.youtube.com/watch?v=nXJXR-zBvHQ

To run experiments from DVC Studio, select the commit that you want to use and
click the `Run` button. A form will let you specify all the changes that you
want to make to your experiment. On this form, there are 2 types of inputs that
you can change:

1. **Input data files**: You can change datasets as well as metrics and model
   files. The list of files that you can change will depend on your ML project.
   For instance, in the `example-get-started` project, you can change the
   `data.xml` file. If you select the
   `Show all input parameters (including hidden)` option, then you can also
   change the hidden files such as the `model.pkl` model file and the
   `scores.json` metrics file. You can also choose not to change any input data
   files if you only wish to change the values of one or more hyperparameters.
2. **Hyperparameters**: You can change the values of the hyperparameters that
   are defined in your ML project. For instance, in the `example-get-started`
   project, you can change `max_features` (the maximum number of features that
   the model uses), `ngrams`, etc. You can also choose not to change any
   hyperparameters if you only wish to change one or more input data files.

The default values of the input data files and hyperparameters in this form are
extracted from your selected commit.

![](https://static.iterative.ai/img/studio/cml_changes_v2.png)

Once you have made all the required changes, enter your Git commit message and
description. Then, select the branch to commit to. You can commit to either the
base branch or a new branch. If you commit to a new branch, a Git pull request
will automatically be created from the new branch to the base branch. Now, click
on `Commit changes`.

![](https://static.iterative.ai/img/studio/cml_commit_v2.png)

At this point, the new experiment appears in the view table. If you just
committed to a new branch, then a new pull request will also have been created
from the new branch to the base branch.

If your project is integrated with a CI/CD setup (e.g. GitHub Actions), the
CI/CD setup will get invoked. If this setup includes a model training process,
it will be triggered, which means that your ML experiment will run
automatically. The model training can happen on any cloud or Kubernetes. For
more details on how to set up CI/CD pipelines for your ML project, refer to
[CML](https://cml.dev).

Once the experiment completes, its metrics will be available in the view table.
You can then generate plots and trend charts for it, or compare it with the
other experiments.
