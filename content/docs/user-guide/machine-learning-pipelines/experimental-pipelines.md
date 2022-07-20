# Experimental Pipelines

DVC 2.0 introduced experiment management with `dvc exp` set of commands. We have
a dedicated part in the user's guide for [experiment management]. Here, we
briefly touch the relationship between experiments and pipelines.

[experiment management]: /doc/user-guide/experiment-management

DVC uses pipelines machinery to run the experiments. Experiments have a special
mechanism to modify the hyperparameter dependencies with `--set-param` option.
After running them, experiment outputs are collected in a special Git commit.

If your workflow has more than one pipeline runs by modifying hyperparameters,
you're better served with [experiment][experiment management] features, which
automates most of the boilerplate.
