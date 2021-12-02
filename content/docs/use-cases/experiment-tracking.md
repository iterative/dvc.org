# Machine Learning Experiment Tracking

Making progress on data science projects requires a large number of
<abbr>experiments</abbr> -- attempts at tuning parameters, trying different
data, improving code, collecting new metrics, etc. Keeping track of all these
changes is essential, as we may need to review, compare, and share them; and to
recover the conditions that produced certain results before in order to
reproduce or update them.

Tracking experiments traditionally meant logging scalar values with generic
tools such as notebooks and spreadsheets. But as experiments evolve and many
more are recorded, they can easily become disconnected and impossible to go back
to.

![](/img/natural-experimentation.png) _Loose experimentation_

DVC provides a layer of [experiment management] features out-of-the-box (no need
for special services, servers, or websites). Running **DVC Experiments** in your
workspace captures relevant changesets automatically (input data, code,
hyperparameters, artifacts, etc.), which can be reviewed and restored later.
This is possible because your entire ML pipeline is [codified] with DVC.

Other tools (see a
[comparison](#comparison-of-popular-experiment-tracking-tools) below) tend to
focus on experiment navigation, mainly logging metrics and artifacts that result
from your pipelines, along with fragile links to code revisions. DVC's approach
guarantees reproducibility by working on top of Git instead of as a parallel
system.

[experiment management]: /doc/user-guide/experiment-management
[codified]: /doc/user-guide/project-structure/pipelines-files
[versioning everything]: /doc/use-cases/versioning-data-and-model-files

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃ yellow:**loss**    ┃ yellow:**acc**    ┃ blue:**epochs** ┃ blue:**model.conv_u** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace               │ 0.23508 │ 0.9151 │ 10     │ 24           │
│ main                    │       - │      - │ 10     │ 16           │
│ ├── e2647ef [exp-ee8a4] │ 0.23146 │ 0.9145 │ 10     │ 64           │
│ ├── 15c9451 [exp-a9be6] │ 0.25231 │ 0.9102 │ 10     │ 32           │
│ └── 9c32227 [exp-17dd9] │ 0.23687 │ 0.9167 │ 10     │ 256          │
│ 7317bc6                 │       - │      - │ 100    │ 16           │
│ ├── 299dc5e [monograms] │ 0.24838 │ 0.9176 │ 100    │ 128          │
│ └── 8a9cb15 [bigrams]   │ 0.24459 │ 0.9134 │ 100    │ 64           │
└─────────────────────────┴─────────┴────────┴────────┴──────────────┘
```

![]() _DVC Experiments are organized along project versions._

Some benefits of tracking experiment with DVC:

- Quickly iterate on experiment ideas, with automatic bookkeeping of data
  dependencies, code, <abbr>parameters</abbr>, artifacts, ML models, and their
  <abbr>metrics</abbr>.
- Use a controlled [execution mechanism]; Run one or queue many experiments (and
  run them in parallel if needed).
- Create deep learning [checkpoints] from your code, and track
  [live metrics](/doc/dvclive).
- [Review and compare] results based on params or metrics; Restore them from
  <abbr>cache</abbr> or reproduce them from scratch.
- Leverage Git's [distributed collaboration] and mature industry tools such as
  GitHub or GitLab.

[execution mechanism]: /doc/user-guide/experiment-management/running-experiments
[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[review and compare]:
  /doc/user-guide/experiment-management/comparing-experiments
[distributed collaboration]:
  /doc/user-guide/experiment-management/sharing-experiments

<br/>

> 📖 Ready to dive in? See [Get Started: Experiments](/doc/start/experiments).

## Comparison of popular experiment tracking tools

DVC Experiments provide a seamless, local-first experience. You control where
and how your data is saved and shared. DVC also improves storage efficiency via
<abbr>caching</abbr>, preventing repetitive data transfers. And DVC is
completely language agnostic: expect the same features whether you're using
Jupyter notebooks or Scala, CSV data frames or HDFS.

|                          | DVC Experiments                                           | MLFlow                                       | Weights & Biases               | TensorBoard                               |
| ------------------------ | --------------------------------------------------------- | -------------------------------------------- | ------------------------------ | ----------------------------------------- |
| How it's integrated      | Write `dvc.yaml` metafile(s)                              | Change your code                             | Change your code (Python only) | Change your code (Python only)            |
| How to run experiments   | `dvc exp run` any shell command                           | Run modified code                            | Run modified Python code       | Run modified Python code                  |
| How they're organized    | Git tree ([flexible][organization])                       | Labels                                       | Labels                         | Labels or file-based                      |
| What is recorded         | Changesets                                                | Artifacts                                    | Artifacts                      | Params and metrics                        |
| Where is data stored     | User-defined ([flexible][storage])                        | Usually hosted (yours)                       | Hosted (theirs)                | User or [limited hosting][tbdev] (theirs) |
| Where is the metadata    | Code repository (Git)                                     | User database                                | Proprietary database (SaaS)    | Metadata files                            |
| Who computes             | User or [hosted runners]                                  | User or [hosted][dbricks] runners            | User (local)                   | User (local)                              |
| How people interact with | Terminal + [web UI][dvc studio]                           | Web app                                      | Web UI                         | Web UI                                    |
| What you pay for         | Your resources + optional [web UI] (free for small teams) | Your resources + optional [hosting][dbricks] | [Subscription][wandb]          | Your resources                            |

[organization]: /doc/user-guide/experiment-management#organization-patterns
[storage]: /doc/command-reference/remote/add#supported-storage-types
[hosted runners]: https://cml.dev/doc/self-hosted-runners
[dbricks]: https://databricks.com/product/pricing
[web ui]: https://studio.iterative.ai/#pricing
[wandb]: https://wandb.ai/site/pricing
[tbdev]: https://tensorboard.dev/

> 💡 Note that other experiment tracking tools can be complementary with DVC,
> for example as detailed experiment logging with specialized visualizations.

To complete your stack, we also offer [DVC Studio], an advanced web interface to
collaborate on DVC projects online, including full experiment management
support. You can also integrate with CI/CD using [CML], and run your experiments
there straight from Studio!

[dvc studio]: /doc/studio
[cml]: https://cml.dev/
