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
hyperparameters, artifacts, etc.). This is possible because your entire ML
pipeline is [codified with DVC].

Other tools tend to focus on experiment navigation by saving metrics and
artifacts that result from your pipelines, along with fragile links to code
revisions. DVC's approach guarantees reproducibility by working on top of Git
instead, and not as a parallel system.

[experiment management]: /doc/user-guide/experiment-management
[codified with dvc]: /doc/user-guide/project-structure/pipelines-files
[versioning everything]: /doc/use-cases/versioning-data-and-model-files

```dvctable
 ────────────────────────────────────────────────────────────────────
  white:**Experiment**                yellow:**loss**      yellow:**acc**      blue:**epochs**   blue:**model.conv_u**
 ────────────────────────────────────────────────────────────────────
  workspace                 0.23508   0.9151   10       24
  main                            -        -   10       16
  ├── e2647ef [exp-ee8a4]   0.23146   0.9145   10       64
  ├── 15c9451 [exp-a9be6]   0.25231   0.9102   10       32
  └── 9c32227 [exp-17dd9]   0.23687   0.9167   10       256
  7317bc6                         -        -   100      16
  ├── 299dc5e [monograms]   0.24838   0.9176   100      128
  └── 8a9cb15 [bigrams]     0.24459   0.9134   100      64
 ────────────────────────────────────────────────────────────────────
```

<div style="position: relative; display: block; margin-left: auto; margin-right: auto; max-width: 700px; margin-bottom: 16px;">
  <em style="color: #6a737d; font-size: 0.9em; display: block; text-align: center;">
    _DVC Experiments are organized along project versions (Git commits,
    branches, tags, etc.)_
  </em>
</div>

Major benefits of tracking experiment with DVC:

- Quickly iterate on experiment ideas, with automatic bookkeeping of data
  dependencies, code, <abbr>parameters</abbr>, artifacts, ML models, and their
  <abbr>metrics</abbr>.
- Use a controlled [execution mechanism]; Run one or queue many experiments (and
  run them in parallel if needed).
- Create deep learning [checkpoints] from your code, and track
  [live metrics](/doc/dvclive).
- [Review and compare] results based on params or metrics; Restore them from
  <abbr>cache</abbr> or reproduce them from scratch.
- Adopt or stay on a Git workflow ([distributed collaboration][shared]) and
  services such as GitHub.
- Enable [Experiment Versioning] practices.

[execution mechanism]: /doc/user-guide/experiment-management/running-experiments
[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[review and compare]:
  /doc/user-guide/experiment-management/comparing-experiments
[experiment versioning]: /blog/ml-experiment-versioning

<br/>

> 📖 Ready to dive in? [Get started with experiments](/doc/start/experiments)!

Among other differentiators (below), DVC Experiments are unique in the space in
that they provides a simple yet flexible, local-first experience. Your code is
unchanged and you control where data is saved and [shared]. DVC also improves
storage efficiency and saves you time via <abbr>caching</abbr>, preventing
repetitive data transfers or having to retrain models on-the-fly.

|                   | DVC Experiments   | Existing tools                |
| ----------------- | ----------------- | ----------------------------- |
| **UI**            | Terminal + [web]  | Web (usually SaaS)            |
| **Logging**       | Git-based         | Custom formats                |
| **Storage**       | [Data versioning] | Logging artifacts and metrics |
| **Execution**     | `dvc exp run`     | Code API (usually Python)     |
| **Collaboration** | Distributed       | Centralized                   |

[data versioning]: /doc/use-cases/versioning-data-and-model-files
[web]: /doc/studio

> 💡 Note that other experiment tracking tools can be complementary to DVC, for
> example for detailed experiment environment logging with specialized
> visualizations.

Finally, DVC is completely language agnostic, offering the same functionality
whether you're using Jupyter notebooks or Scala, CSV data frames or HDFS.

---

To complete your stack, we also offer [DVC Studio], an advanced web interface to
collaborate on DVC projects online, including full experiment management
support. You can also integrate with CI/CD using [CML], and run your experiments
there straight from Studio!

[shared]: /doc/user-guide/experiment-management/sharing-experiments
[dvc studio]: /doc/studio
[cml]: https://cml.dev/
