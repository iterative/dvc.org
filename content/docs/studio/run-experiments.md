# Run Experiments

You can also run your ML experiments directly from DVC Studio. Your regular
CI/CD set-up is used to run the experiments. For instance,
[CML](https://dvc.org/doc/cml) Github Actions can be used to run ML experiments
on each new commit.

> Note that you cannot run experiments on the demo view (`example-get-started`)
> that is provided to you by default. Once you create views for your ML project
> repositories, you can follow the instructions given below and run experiments
> directly from DVC Studio.

To run experiments from DVC Studio, select the commit that you want to use and
click the `Run` button. A form will let you to specify all the changes that you
want to make to your experiment input files/dirs and parameters.

<img src="https://static.iterative.ai/img/studio/cml.png" alt="drawing" width="300"/>

The default values in this form are extracted from your selected commit. For
instance, in the given example, `max_features` can be increased to 4000,
`ngrams` can be changed to 2, and so on. Enter your commit message and
description, select the branch to commit to (either the base branch or a new
branch), and click on `Commit changes`.

Now, the CI/CD pipeline that you have set up (eg, Github Actions) will be
invoked to run the experiment. If you refresh the view (reload the page), the
experiment (i.e. the commit that you just pushed) along with its results
(metrics) will be included in the list of all commits.
