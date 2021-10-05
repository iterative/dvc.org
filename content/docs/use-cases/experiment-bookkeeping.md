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

`dvc experiments` automatically captures all the changes to your project (code,
data, parameters, etc.), as well as its artifacts and other results (ML models,
metrics, etc.). This is possible by the codification of your data pipelines,
which enables DVC to
[track and version](/doc/use-cases/versioning-data-and-model-files) all this
data.

You can enjoy the full power of `dvc experiments` on any machine without need
for special infrastructure or servers. The only other software required is Git,
which is used internally for these features. No need to worry about Git during
experimentation though! Everything your team may need for a regular version
control workflow later will still be available.

On top od that, every DVC feature is language agnostic and Experiments is no
exception. You can expect the same convenience and performance whether you are
using Jupyter Notebooks or Scala, CSV dataframes or HDFS file partitions.
