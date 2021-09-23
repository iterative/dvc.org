# Data Science Experiment Bookkeeping

Iterating on data science implies a large number of attempts at tuning
parameters, improving code, trying different data, and collecting metrics.
Keeping track of all these experiments is challenging but essential, as we need
to compare, visualize, share, and _productionize_ the results. We also want to
be able to connect any captured metrics back to the experimental setup that
originated them.

The core of DVC lets you codify your project's
[data pipelines](/doc/user-guide/project-structure/pipelines-files) in order to
track and version your data and models while capturing their provenance. On top
of that, DVC provides a layer of
[experiment management features](/doc/user-guide/experiment-management) to take
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
