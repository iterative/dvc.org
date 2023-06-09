# Machine Learning Experiment Tracking

Making progress on data science projects requires a large number of
<abbr>experiments</abbr> -- attempts at tuning parameters, trying different
data, improving code, collecting better metrics, etc. Keeping track of all these
changes is essential, as we may want to inspect them when comparing outcomes.
Recovering these conditions later will be necessary to reproduce results or
resume a line of work.

![](/img/natural-experimentation.png) _Difficulty tracking experiments manually
(usually with notebooks or speadsheets)_

DVC provides a layer of [experiment management] features out-of-the-box (no need
for special servers or websites). Running **DVC Experiments** in your workspace
captures relevant changesets automatically (input data, source code,
hyperparameters, artifacts, etc.).

Other tools tend to focus on experiment navigation by saving metrics and
artifacts that result from your experiments, along with fragile links to code
revisions. DVC's approach guarantees reproducibility by working on top of Git
instead, and not as a separate system.

[experiment management]: /doc/user-guide/experiment-management
[codified with dvc]: /doc/user-guide/project-structure/dvcyaml-files
[versioning everything]: /doc/use-cases/versioning-data-and-models

![](/img/vscode-live.gif) _DVC Experiments are organized along project versions
(Git commits, branches, tags, etc.), and can be compared in the terminal, the
[VS Code extension][ide] (shown) or [Studio]._

When you are ready to share, [Studio] can be the central hub for your team's
projects, experiments, and models. Studio also gives you the power to run
experiments in the cloud.

Major benefits of tracking experiments with DVC:

- Quickly iterate on experiment ideas, with automatic bookkeeping of data
  dependencies, code, <abbr>parameters</abbr>, artifacts, ML models, and their
  <abbr>metrics</abbr>.
- Use a controlled [execution mechanism]; Run one or queue many experiments (and
  run them in parallel if needed).
- Track [live metrics](/doc/dvclive).
- [Review and compare] results based on params or metrics; Restore them from
  <abbr>cache</abbr> or reproduce them from scratch.
- Adopt or stay on a Git workflow ([distributed collaboration][shared]) and
  services such as GitHub.
- Submit pull requests for your experiments, conduct reviews in services like
  GitHub, and otherwise collaborate on experiments like teams do for code.

[execution mechanism]: /doc/user-guide/experiment-management/running-experiments
[review and compare]:
  /doc/user-guide/experiment-management/comparing-experiments
[experiment versioning]: /blog/ml-experiment-versioning

<br/>

<admon icon="book">

Ready to dive in? [Get started with experiments]!

[get started with experiments]: /doc/start/experiments

</admon>

Among other differentiators (below), DVC Experiments are unique in the space in
that they provides a simple yet flexible, local-first experience. Your code is
unchanged and you control where data is saved and [shared]. DVC also improves
storage efficiency and saves you time via <abbr>caching</abbr>, preventing
repetitive data transfers or having to retrain models on-the-fly.

|                   | DVC Experiments              | Existing tools                |
| ----------------- | ---------------------------- | ----------------------------- |
| **UI**            | [Web], [IDE], and [terminal] | Web (usually SaaS)            |
| **Logging**       | Git-based                    | Custom formats                |
| **Storage**       | [Data versioning]            | Logging artifacts and metrics |
| **Execution**     | `dvc exp run`                | Code API (usually Python)     |
| **Collaboration** | Distributed                  | Centralized                   |

[data versioning]: /doc/use-cases/versioning-data-and-models
[web]: /doc/studio
[ide]: /doc/vs-code-extension
[terminal]: /doc/command-reference

> 💡 Note that other experiment tracking tools can be complementary to DVC, for
> example for detailed experiment environment logging with specialized
> visualizations.

Finally, DVC is completely language agnostic, offering the same functionality
whether you're using Jupyter notebooks or Scala, CSV data frames or HDFS.

[shared]: /doc/user-guide/experiment-management/sharing-experiments
[studio]: /doc/studio
