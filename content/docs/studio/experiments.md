# Run experiments

You can also run your ML experiments directly from DVC Studio. Your regular
CI/CD set-up is used to run the experiments. For instance, Github Actions can be
defined for your Github repositories, to run the ML experiment on any new
commit.

DVC Studio provides you a simple user interface to specify all the changes that
you want to make to your input datasets and hyperparameters. Once you have made
all the necessary changes, you can commit the changes to your Git repository
directly from Studio and invoke your CI/CD pipeline.

You can use DVC Studio along with CML for running experiments.
[CML](/doc/cml/index) is an open-source library for implementing continuous
integration & delivery (CI/CD) in machine learning projects. You can run CML
experiments on top of any one of all the listed commits.

To run experiments from DVC Studio, select the commit that you want to use and
click on the Run button. An input form will be generated for you to enter all
the input files and parameters that you want to use in your experiment.

<img src="/img/studio/cml.png" alt="drawing" width="300"/>

The values listed in this form by default are extracted from your selected
commit. Change the input files or parameters according to what experiment you
want to run. For instance, in the given example, you can increase `max_features`
to 4000 or decrease `ngrams` to 1.

After making all the necessary input changes, click on Start commit. Enter your
commit messages, select the branch you want to commit to (the same branch as the
base branch or a new branch), and click on Commit changes.

Now, if your refresh the View details page, the experiment (ie, the commit that
you just pushed) will be included in the list of all commits, along with the
results (metrics) of the experiment.
