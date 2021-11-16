# Machine Learning Experiment Tracking

Making progress on data science projects implies a large number of
<abbr>experiments</abbr> -- attempts at tuning parameters, improving code,
trying different data, collecting new metrics, etc. Keeping track of all these
changes is challenging but essential, as we'll want to review, compare, and
share them. We'll probably also want to recover the condition that produced
certain model metrics, and reproduce them if needed.

![](/img/natural-experimentation.png) _Loose experimentation_

DVC provides a layer of [experiment management] features to simplify ML
modeling. Running **DVC Experiments** in your project automatically captures all
the relevant changes (to code, data, parameters, etc.) because your data
processes are [codified] with DVC, which enables tracking and [versioning
everything].

DVC experiment tracking features enable:

- Rapid iteration on experiment ideas (variations from a baseline) with
  controlled [execution]
- Automatic bookkeeping of changes to data dependencies, code,
  <abbr>parameters</abbr>, artifacts and <abbr>metrics</abbr> on each experiment
  run
- Queue experiments for future execution (and run them in parallel if needed).
- Create deep learning [checkpoints] from your code, and track
  [live metrics](/doc/dvclive).
- [Review and compare] experiments or checkpoints based on params or metrics.
- Restore experimental results from <abbr>cache</abbr>, or reproduce them from
  scratch.
- Save, share, or discard experiments individually or in bulk.

[experiment management]: /doc/user-guide/experiment-management
[codified]: /doc/user-guide/project-structure/pipelines-files
[versioning everything]: /doc/use-cases/versioning-data-and-model-files
[commands]: /doc/command-reference/exp
[execution]: /doc/user-guide/experiment-management/running-experiments
[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[review and compare]:
  /doc/user-guide/experiment-management/comparing-experiments

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
reproducibility by working on top of Git, instead of on being a side system with
fragile links to Git. This means that your [data is
tracked][versioning everything] from within project versions (without storing it
in Git). It also enables distributed collaboration along the way, via optional
hosting like GitHub or GitLab.

DVC projects provide a seamless, local-first experience (no need for running
servers, special services, or loading websites). You control where and how your
data is saved and shared. DVC also improves storage efficiency via
<abbr>caching</abbr>, preventing repetitive data transfers on every experiment.

On top of all that, DVC is completely language agnostic. You can expect the same
convenience and performance whether you're using Jupyter Notebooks or Scala, CSV
data frames or HDFS.

|                   | DVC Experiments               | MLFlow                | Weights & Biases            | Neptune              |
| ----------------- | ----------------------------- | --------------------- | --------------------------- | -------------------- |
| UI                | Terminal                      | Web (local or hosted) | Web                         | Web                  |
| Infrastructure    | None (just Git)               | Web server            | SaaS                        | SaaS                 |
| Versioning        | Git (standard, robust)        | Proprietary metadata  | Proprietary metadata        | Proprietary metadata |
| Language Support  | Any<br/>(agnostic)            | Several (REST)        | Python only                 | Python only          |
| Compute & Storage | User (yours)                  | User (yours)          | Hosted (theirs)             | Hosted (theirs)      |
| Collaboration     | Distributed<br/>(Git hosting) | Centralized           | Centralized                 | Centralized          |
| Licensing         | Open Source                   | Open Source           | Proprietary<br/>+ OS client | Proprietary          |
| Cost              | Free + [storage]              | Free [+ cloud][mp]    | [$$$][np]                   | [$$][wp]             |

[storage]: /doc/command-reference/remote/add#supported-storage-types
[np]: https://neptune.ai/pricing
[wp]: https://wandb.ai/site/pricing
[mp]: https://databricks.com/product/pricing

💡 Note that other experiment tracking tools can be complementary with DVC, for
example as more detailed experiment logging systems with specialized analytics
and visualizations.

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).
