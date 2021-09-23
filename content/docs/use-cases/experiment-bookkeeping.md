# Data Science Experiment Bookkeeping

Iterating on data science implies a large number of attempts at tuning
parameters, improving code, trying different data, and collecting metrics, for
example when optimizing a machine learning model's accuracy. Keeping track of
all these <abbr>experiments</abbr> is challenging but essential, as we'll need
to compare, visualize, share, and _productionize_ the results. We also want to
be able to reconnect any metrics snapshot back to their original setup.

![]() _Figure_

DVC provides a layer of
[experiment management](/doc/user-guide/experiment-management) features to take
automatic snapshots of any variations in your project, and handle them with
simple terminal [commands](/doc/command-reference/exp). Some things you can do
include:

- Automatic bookkeeping of changes to data dependencies, code,
  <abbr>parameters</abbr>, artifacts and <abbr>metrics</abbr> when you run each
  experiment.
- Queue experiments for future execution, and run in parallel if needed.
- List and compare previous experiments in a consolidated way (order and filter
  by parameters or metrics).
- Restore any experiment results from the <abbr>cache</abbr>, or reproduce them
  from source.
- Save, share, or discard experiments individually or in bulk.

![]() _Figure_

This is made possible by the inherent codification of your data pipelines in
DVC, which enables
[tracking and versioning](/doc/use-cases/versioning-data-and-model-files) their
data & ML models while capturing their provenance. `dvc experiments` use the
same process, but do all the versioning for you, so there's no need to worry
about things like Git during experimentation phases. Everything you need for a
regular version control workflow will still be available later.
