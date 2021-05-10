# Run experiments

You can also run CML experiments directly from DVC Studio. CML is an open-source
library for implementing continuous integration & delivery (CI/CD) in machine
learning projects. You can learn more about CML here.

You can run CML experiments on top of any one of all the listed commits. When
you run a CML experiment, you are essentially making one more commits to the
connected Git repository, with all the changes to the parameters for the
experiment. As soon as the commit is made, Git flow will run the experiment.
Refer to the CML documentation here for more details on this.

To run CML experiments from DVC Studio, select the commit that you want to use
and click on the Run button.

An input form will be generated for you to enter all the input files and
parameters that you want to use in your experiment.

<img src="/img/studio/cml.png" alt="drawing" width="300"/>

The values listed in this form by default are extracted from your selected
commit. Change the input files or parameters according to what experiment you
want to run. For instance, in the given example, you can increase `max_features`
to 4000 or decrease `ngrams` to 1.

After making all the necessary input changes, click on Start commit. Enter your
commit messages, select the branch you want to commit to (the same branch as the
base branch or a new branch, and click on Commit changes.

Now, if your refresh the View details page, the experiment (ie, the commit that
you just pushed) will be included in the list of all commits, along with the
results (metrics) of the experiment.
