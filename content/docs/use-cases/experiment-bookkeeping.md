# Data Science Experiment Bookkeeping

Mature data science required constant research and improvement. This implies
continuous experimentation on any stage of the data lifecycle, from acquisition
to processing and usage, for example to retrain machine learning models for
better accuracy. Keeping track of all these experiments is challenging, not to
mention being able to find and reproduce them again in the future.

The core of DVC lets you codify your project's
[data pipelines](/doc/user-guide/project-structure/pipelines-files) in order to
track and version your data and models while capturing their provenance. On top
of that, DVC provides a layer of
[experiment management](/doc/user-guide/experiment-management) features to take
automatic snapshots of any relevant variations in your project. These
<abbr>experiments</abbr> can then be handled with simple commands. Some things
you can do with `dvc experiments`:

- Automatic bookkeeping of all changes to the project before you run each
  experiment.
- Define one or more experiments for future execution (locally or on a remote
  machine).
- List and compare previous experiments in a consolidated way (order and filter
  by <abbr>parameters</abbr> or <abbr>metrics</abbr>).
- Restore experimental results instantly to continue working on that idea.
- Reproduce any experiment in other environments or in the future if needed.
- Discard project variations that are no longer useful, either individually or
  in bulk.
