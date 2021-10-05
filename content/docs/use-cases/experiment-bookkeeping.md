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

- Rapid iteration on experiment ideas by capturing project baseline variations
  with a simple command (`dvc exp run`).
- Automatic bookkeeping of changes to data dependencies, code,
  <abbr>parameters</abbr>, artifacts and <abbr>metrics</abbr> when you run each
  experiment.
- Queue experiments for future execution, and run them in parallel if needed.
- List and compare previous experiments in a consolidated way (order and filter
  by parameters or metrics).
- Restore any experiment results from <abbr>cache</abbr>, or reproduce them from
  scratch.
- Promote, save, share, or discard experiments individually or in bulk.

![]() _Figure_

DVC Experiments automatically capture all the changes to your project (code,
data, parameters, etc.), as well as its results (ML models, metrics, other
artifacts). This is possible because DVC helps you codify data pipelines, which
enables [tracking & versioning](/doc/use-cases/versioning-data-and-model-files)
all this data.

You can enjoy the full power of `dvc experiments` on any machine, without need
for special infrastructure or servers. The only other software required is Git,
but you don't need to worry about how it's used internally! Everything your team
may need for a regular version control workflow later will still be available.

On top of that, DVC Experiment features are language agnostic. You can expect
the same convenience and performance whether you are using Jupyter Notebooks or
Scala, CSV dataframes or HDFS file partitions, JSON or YAML config files.

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).
