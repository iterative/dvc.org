# Manage Experiments

Data science process is inherently iterative and R&D like. Data scientist may
try many different approaches, different hyper-parameter values, and "fail" many
times before the required level of a metric is achieved. Even failed experiments
can be a useful source of information in ML.

DVC makes it easy to iterate on your project, providing ways to try different
ideas, keep track of them, switch back and forth, compare their performance
through metrics, and find the best experiment. It stores all the context
necessary to reproduce easily and efficiently an experiment: data, pipeline
stages, parameters, models, etc. That way, someone else (or you yourself 3
months from now) can check out and inspect all the details of an experiment.

You can use several ways to manage experiments, which are described on this
section. Which one is more suitable for you depends on your preferences and also
on the kind and complexity of your project.

- [Manage Experiments by Tags](/doc/user-guide/experiments/tags)
- [Manage Experiments by Branches](/doc/user-guide/experiments/branches)
- [Manage Experiments by Directories](/doc/user-guide/experiments/dirs)
- [Manage Experiments by Tags and Branches and Directories](/doc/user-guide/experiments/mixed)
