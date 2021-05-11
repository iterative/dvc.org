# Run Experiments

You can also run your ML experiments directly from DVC Studio. Your regular
CI/CD set-up is used to run the experiments. For instance, Github Actions can be
used to run ML experiments on each new commit.

DVC Studio provides you a simple user interface to specify all the changes that
you want to make to your input datasets and hyperparameters. Once you have made
all the necessary changes, you can commit the changes to your Git repository
directly from Studio and invoke your CI/CD pipeline.

To run experiments from DVC Studio, select the commit that you want to use and
click on the `Run` button. An form will be generated for you to fill in all the
input files and parameters needed for your experiment.

<img src="/img/studio/cml.png" alt="drawing" width="300"/>

The default values in this form are extracted from your selected commit. Change
the input files or parameters according to what experiment you want to run. For
instance, in the given example, you can increase `max_features` to 4000 or
decrease `ngrams` to 1.

After making all the necessary input changes, click on `Start commit`. Enter
your commit messages, select the branch to commit to (either the base branch or
a new branch), and click on `Commit changes`.

If your refresh the `View details` page now, the experiment (i.e. the commit
that you just pushed) along with its results (metrics) will be included in the
list of all commits.
