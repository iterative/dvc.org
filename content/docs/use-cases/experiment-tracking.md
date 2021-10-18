# Machine Learning Experiment Tracking

Iterating on data science implies a large number of attempts at tuning
parameters, improving code, trying different data, and collecting metrics, for
example when optimizing a machine learning model's accuracy. Keeping track of
all these <abbr>experiments</abbr> is challenging but essential, as we'll need
to compare, visualize, share, and _productionize_ the results. We also want to
be able to reconnect any recorded metrics back to their original setup.

![](/img/lose-experimentation.png) _Loose experimentation_

DVC provides a layer of
[experiment management](/doc/user-guide/experiment-management) features to take
automatic snapshots of any variations in your project, and handle them with
simple terminal [commands](/doc/command-reference/exp). Some things you can do
include:

- Rapid iteration on experiment ideas by capturing variations from a baseline
  with a controlled execution command (`dvc exp run`).
- Automatic bookkeeping of changes to data dependencies, code,
  <abbr>parameters</abbr>, artifacts and <abbr>metrics</abbr> when you run each
  experiment.
- Queue experiments for future execution (and run them in parallel if needed).
- Create deep [checkpoints](/doc/user-guide/experiment-management/checkpoints)
  from your code, and track [live metrics](/doc/dvclive).
- List and compare previous experiments in a consolidated way (order and filter
  by parameters or metrics).
- Restore any experiment results from <abbr>cache</abbr>, or reproduce them from
  scratch.
- Promote, save, share, or discard experiments individually or in bulk.

## Advantages of DVC's approach

DVC Experiments automatically capture all the changes to your project (code,
data, parameters, etc.), as well as to results (ML models, metrics, any
artifacts). This is possible because your data processes are codified with DVC,
which enables
[tracking & versioning](/doc/use-cases/versioning-data-and-model-files) all of
this data.

|           | DVC         | MLFlow      | Neptune     | wanDB       |
| --------- | ----------- | ----------- | ----------- | ----------- |
| Interface | CLI         | Web         | ???         | CLI         |
| Storage   | File-based  | Database    | Database    | Database    |
| Licensing | Open Source | Proprietary | Proprietary | Open Source |
| Support   | ✔️          | ✔️          | ✔️          | ❌          |
| Pricing?  | Free        | $$          | $           | Free        |

You can enjoy the full power of DVC Experiments on any machine, without need for
special infrastructure or servers. The only other software required is Git, but
you don't need to worry about how it's used internally! Everything your team may
need for a regular version control workflow later will still be available.

On top of that, DVC Experiment features are language agnostic. You can expect
the same convenience and performance whether you are using Jupyter Notebooks or
Scala, CSV data frames or HDFS partitions, JSON or YAML config files.

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).
