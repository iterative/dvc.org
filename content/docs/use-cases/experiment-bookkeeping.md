# Data Science Experiment Bookkeeping

Iterating on data science implies a large number of attempts at tuning
parameters, improving code, trying different data, and collecting metrics, for
example when optimizing a machine learning model's accuracy. Keeping track of
all these <abbr>experiments</abbr> is challenging but essential, as we'll need
to compare, visualize, share, and _productionize_ the results. We also want to
be able to reconnect any metrics snapshot back to their original setup.

DVC provides a layer of
[experiment management](/doc/user-guide/experiment-management) features to take
automatic snapshots of any variations in your project, and handle them with
simple terminal commands. This is made possible by DVC's inherent codification
of your project, which enables
[tracking and versioning](/doc/use-cases/versioning-data-and-model-files) its
data & ML models while capturing their provenance.

![]() _Figure_

Some things you can do with `dvc experiments`:

- Automatic bookkeeping of changes to data dependencies, code, parameters,
  artifacts and metrics when you run each experiment.
- Queue experiments for future execution, and run in parallel if needed.
- List and compare previous experiments in a consolidated way (order and filter
  by <abbr>parameters</abbr> or <abbr>metrics</abbr>).
- Restore any experiment results from the <abbr>cache</abbr>, or reproduce them
  from source.
- Discard project variations that are no longer useful, either individually or
  in bulk.
