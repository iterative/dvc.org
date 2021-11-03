# Machine Learning Experiment Tracking

Iterating on data science implies a large number of attempts at tuning
parameters, improving code, trying different data, and collecting metrics, for
example to optimize an ML model's accuracy. Keeping track of all these
<abbr>experiments</abbr> is challenging but essential, as we'll need to compare,
visualize, reproduce, share, and _productionize_ the results. We also want to be
able to reconnect the lineage of recorded metrics back to their original setup.

![](/img/natural-experimentation.png) _Loose experimentation_

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

DVC Experiments can capture all the relevant changes to your project
automatically (code, data, parameters, ML models, metrics, etc.) because your
data processes are codified with DVC, which enables
[tracking & versioning](/doc/use-cases/versioning-data-and-model-files) all of
this information.

Unlike tools that focus on experiment navigation, DVC's approach also guarantees
reproducibility by integrating with Git directly (instead of saving fragile
versioning metadata). This enables distributed collaboration along the way, via
optional hosting like GitHub or GitLab.

|                   | DVC Experiments               | MLFlow                | Weights & Biases            | Neptune            |
| ----------------- | ----------------------------- | --------------------- | --------------------------- | ------------------ |
| UI                | Terminal<br/>+ [Web][studio]  | Web (local or hosted) | Web                         | Web                |
| Infrastructure    | None (just Git)               | Web server            | SaaS                        | SaaS               |
| Versioning        | Git (standard, robust)        | Metadata (fragile)    | Metadata (fragile)          | Metadata (fragile) |
| Language Support  | Any<br/>(agnostic)            | Several (REST)        | Python only                 | Python only        |
| Compute & Storage | User (yours)                  | User (yours)          | Theirs                      | Theirs             |
| Collaboration     | Distributed<br/>(Git hosting) | Centralized           | Centralized                 | Centralized        |
| Licensing         | Open Source                   | Open Source           | Proprietary<br/>+ OS client | Proprietary        |
| Cost              | Free + [storage]              | Free [+ cloud][mp]    | [$$$][np]                   | [$$][wp]           |

> \* All of DVC features are free to use on terminal. The [Studio] (web UI) is
> free for individuals.

[studio]: https://studio.iterative.ai/
[storage]: /doc/command-reference/remote/add#supported-storage-types
[np]: https://neptune.ai/pricing
[wp]: https://wandb.ai/site/pricing
[mp]: https://databricks.com/product/pricing

DVC projects are lightweight and local-first (no need for special servers or
services). This means you control where and how your data is saved and shared.
They can also make more efficient use of storage via <abbr>caching</abbr>, which
prevents repetitive data transfers for every experiment run.

On top of all that, DVC is completely language agnostic. You can expect the same
convenience and performance whether you are using Jupyter Notebooks or Scala,
CSV data frames or HDFS partitions.

💡 Note that other experiment tracking tools can be complementary with DVC, for
example as more detailed experiment logging systems with built-in analytics and
visualizations.

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).
