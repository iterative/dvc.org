# Machine Learning Experiment Tracking

Iterating on data science implies a large number of attempts involving tuning
parameters, improving code, trying different data, and collecting metrics; for
example to optimize the accuracy of an ML model. Keeping track of all these
changes is challenging but essential, as we may need to review, compare,
and share the <abbr>experiments</abbr>. We'll probably also want to
reconnect model metrics back to their original setup, and reproduce them if
needed.

![](/img/natural-experimentation.png) _Loose experimentation_

DVC provides a layer of
[experiment management](/doc/user-guide/experiment-management) features to
assist the full lifecycle of the ML modeling process. **DVC Experiments** can
run and capture all the relevant changes to your project automatically (code,
data, parameters, ML models, metrics, etc.) because your data processes are
codified with DVC, which enables
[tracking & versioning](/doc/use-cases/versioning-data-and-model-files) all this
information.

You can handle experiments them with simple terminal
[commands](/doc/command-reference/exp). What you can do includes:

- Rapid iteration on experiment ideas (variations from a baseline) with a
  controlled execution command (`dvc exp run`).
- Automatic bookkeeping of changes to data dependencies, code,
  <abbr>parameters</abbr>, artifacts and <abbr>metrics</abbr> on each experiment
  run.
- Queue experiments for future execution (and run them in parallel if needed).
- Create deep [checkpoints](/doc/user-guide/experiment-management/checkpoints)
  from your code, and track [live metrics](/doc/dvclive).
- Review and compare previous experiments or checkpoints based on params or
  metrics.
- Restore any experiment results from <abbr>cache</abbr>, or reproduce them from
  scratch.
- Save, share, or discard experiments individually or in bulk.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃ white:**Created**      ┃ yellow:**loss**    ┃ yellow:**acc**    ┃ blue:**train.epochs** ┃ blue:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.23508 │ 0.9151 │ 10           │ 24               │
│ 7317bc6                 │ Jul 18, 2021 │       - │      - │ 10           │ 16               │
│ ├── e2647ef [exp-ee8a4] │ 05:14 PM     │ 0.23146 │ 0.9145 │ 10           │ 64               │
│ ├── 15c9451 [exp-a9be6] │ 05:14 PM     │ 0.25231 │ 0.9102 │ 10           │ 32               │
│ ├── 9c32227 [exp-17dd9] │ 04:46 PM     │ 0.23687 │ 0.9167 │ 10           │ 256              │
│ ├── 8a9cb15 [exp-29d93] │ 04:46 PM     │ 0.24459 │ 0.9134 │ 10           │ 128              │
└─────────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘
```

![]() _Organized experiments in DVC_

Unlike tools that focus on experiment navigation, DVC's approach guarantees
reproducibility by integrating with Git directly (instead of saving fragile
versioning metadata). This enables distributed collaboration along the way, via
optional hosting like GitHub or GitLab.

DVC projects are lightweight and local-first (no need for special servers or
services). This means you control where and how your data is saved and shared.
They can also make more efficient use of storage via <abbr>caching</abbr>, which
prevents repetitive data transfers for every experiment run.

On top of all that, DVC is completely language agnostic. You can expect the same
convenience and performance whether you are using Jupyter Notebooks or Scala,
CSV data frames or HDFS.

|                   | DVC Experiments               | MLFlow                | Weights & Biases            | Neptune            |
| ----------------- | ----------------------------- | --------------------- | --------------------------- | ------------------ |
| UI                | Terminal<br/>+ [Web][studio]  | Web (local or hosted) | Web                         | Web                |
| Infrastructure    | None (just Git)               | Web server            | SaaS                        | SaaS               |
| Versioning        | Git (standard, robust)        | Proprietary metadata | Proprietary metadata | Proprietary metadata |
| Language Support  | Any<br/>(agnostic)            | Several (REST)        | Python only                 | Python only        |
| Compute & Storage | User (yours)                  | User (yours)          | Hosted (theirs)             | Hosted (theirs)    |
| Collaboration     | Distributed<br/>(Git hosting) | Centralized           | Centralized                 | Centralized        |
| Licensing         | Open Source                   | Open Source           | Proprietary<br/>+ OS client | Proprietary        |
| Cost              | Free + [storage]              | Free [+ cloud][mp]    | [$$$][np]                   | [$$][wp]           |

[studio]: https://studio.iterative.ai/
[storage]: /doc/command-reference/remote/add#supported-storage-types
[np]: https://neptune.ai/pricing
[wp]: https://wandb.ai/site/pricing
[mp]: https://databricks.com/product/pricing

💡 Note that other experiment tracking tools can be complementary with DVC, for
example as more detailed experiment logging systems with specialized analytics
and visualizations.

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).
