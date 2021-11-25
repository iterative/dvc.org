# Machine Learning Experiment Tracking

Making progress on data science projects requires a large number of
<abbr>experiments</abbr> -- attempts at tuning parameters, trying different
data, improving code, collecting new metrics, etc. Keeping track of all these
changes is challenging but essential, as we may need to review, compare, and
share them. We also want to be able to recover the conditions that produced
certain results before, and reproduce them if needed.

![](/img/natural-experimentation.png) _Loose experimentation_

DVC provides a layer of [experiment management] features out-of-the-box (no need
for special services, servers, or websites). Running **DVC Experiments** in your
workspace captures all the relevant changes automatically (input data, code,
hyperparameters, artifacts, etc.) to be reviewed and restored later. This is
possible because the entire experimental process is [codified] with DVC.

Unlike tools that focus on experiment navigation (see a
[comparison](#comparison-of-popular-experiment-tracking-tools) below), DVC's
approach guarantees reproducibility by working on top of Git instead of as a
separate system with fragile revision links. Experiments are associated with the
project versions from which they came, and DVC stores their data efficiently for
you. This enables [distributed collaboration] along the way.

[experiment management]: /doc/user-guide/experiment-management
[codified]: /doc/user-guide/project-structure/pipelines-files
[versioning everything]: /doc/use-cases/versioning-data-and-model-files
[distributed collaboration]:
  /doc/user-guide/experiment-management/sharing-experiments

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃ yellow:**loss**    ┃ yellow:**acc**    ┃ blue:**epochs**       ┃ blue:**model.conv_u** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace               │ 0.23508 │ 0.9151 │ 10           │ 24           │
│ main                    │       - │      - │ 10           │ 16           │
│ ├── e2647ef [exp-ee8a4] │ 0.23146 │ 0.9145 │ 10           │ 64           │
│ ├── 15c9451 [exp-a9be6] │ 0.25231 │ 0.9102 │ 10           │ 32           │
│ └── 9c32227 [exp-17dd9] │ 0.23687 │ 0.9167 │ 10           │ 256          │
│ 7317bc6                 │       - │      - │ 100          │ 16           │
│ ├── 299dc5e [monograms] │ 0.24838 │ 0.9176 │ 100          │ 128          │
│ └── 8a9cb15 [bigrams]   │ 0.24459 │ 0.9134 │ 100          │ 64           │
└─────────────────────────┴─────────┴────────┴──────────────┴──────────────┘
```

![]() _DVC Experiments are organized along project versions._

DVC experiment tracking benefits:

- Quickly iterate on experiment ideas (variations from a baseline).
- Automatic bookkeeping of data dependencies, code, <abbr>parameters</abbr>,
  artifacts and <abbr>metrics</abbr>
- Queue experiments for future execution (and run them in parallel if needed).
- Create deep learning [checkpoints] from your code, and track
  [live metrics](/doc/dvclive).
- [Review and compare] results based on params or metrics; Restore them from
  <abbr>cache</abbr> or reproduce them from scratch.
- Share or discard experiments individually or in bulk.

[execution]: /doc/user-guide/experiment-management/running-experiments
[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[review and compare]:
  /doc/user-guide/experiment-management/comparing-experiments

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).

### Comparison of popular experiment tracking tools

DVC Experiments provide a seamless, local-first experience. You control where
and how your data is saved and shared. DVC also improves storage efficiency via
<abbr>caching</abbr>, preventing repetitive data transfers on every experiment.

Additionally, DVC is completely language agnostic. You can expect the same
convenience and performance whether you're using Jupyter Notebooks or Scala, CSV
data frames or HDFS.

|                       | DVC Experiments                         | MLFlow                                       | Weights & Biases          | TensorBoard             |
| --------------------- | --------------------------------------- | -------------------------------------------- | ------------------------- | ----------------------- |
| Experiment definition | `dvc.yaml` metafiles                    | Implicit (in code)                           | Implicit                  | Implicit                |
| How to run it         | `dvc exp run` any terminal command      | Code integration                             | Code (Python only)        | Code (Python)           |
| Data storage          | [User][storage] (yours e.g. cloud)      | User (yours)                                 | Hosted (theirs)           | Limited hosted (theirs) |
| Compute               | User (e.g. [CI/CD][cml])                | User or [hosted][dbricks]                    | User                      | User                    |
| What can be tracked   | code & data, params, metrics, artifacts | data, params, metrics                        | data, params, environment | params and metrics      |
| Visualization         | Terminal + [web][dvc studio]            | Web app                                      | Website                   | Website                 |
| How it's captured     | Custom Git commit                       | Database                                     | Database                  | Metadata files          |
| What you pay for      | Your resources + optional [web UI]      | Your resources + optional [hosting][dbricks] | [Subscription][wandb]     | Your resources          |

[storage]: /doc/command-reference/remote/add#supported-storage-types
[dbricks]: https://databricks.com/product/pricing
[web ui]: https://studio.iterative.ai/#pricing
[wandb]: https://wandb.ai/site/pricing

> 💡 Note that other experiment tracking tools can be complementary with DVC,
> for example for more detailed experiment logging with specialized analytics
> and visualizations.

To complete your stack, we also offer [DVC Studio], an advanced web interface to
collaborate on DVC projects online, including full experiment management
support. You can also integrate with CI/CD using [CML], and run experiments
straight from Studio!

[dvc studio]: /doc/studio
[cml]: https://cml.dev/
