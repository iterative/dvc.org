# Run Experiments

You can also run your ML experiments directly from DVC Studio. Your regular
CI/CD set-up is used to run the experiments. For instance, Github Actions can be
used to run ML experiments on each new commit.

To run experiments from DVC Studio, select the commit that you want to use and
click the `Run` button. A form will let you to specify all the changes that
you want to make to your experiment input files/dirs and parameters.

<img src="/img/studio/cml.png" alt="drawing" width="300"/>

The default values in this form are extracted from your selected commit. For
instance, in the given example, you can increase `max_features` to 4000 or
decrease `ngrams` to 1. Enter your commit message and
description, select the branch to commit to (either the base branch or a new
branch), and click on `Commit changes`.

Now, the CI/CD pipeline that you have set up (eg, Github Actions) will be
invokved to run the experiment. If your refresh the view (reload the page), the
experiment (i.e. the commit that you just pushed) along with its results
(metrics) will be included in the list of all commits.
