## DVC Experiments Overview

`dvc exp` commands let you automatically track a variation to a committed
project version (baseline). You can create independent groups of experiments
this way, as well as review, compare, and restore them later. The basic workflow
goes like this:

- Modify <abbr>parameters</abbr> or other dependencies (input data, source code,
  stage definitions, etc.) of committed stages.
- [Run experiments] with `dvc exp run` (instead of `repro`) to execute the
  pipeline. The results are reflected in your <abbr>workspace</abbr>, and
  tracked automatically.
- Use [metrics](/doc/command-reference/metrics) to identify the best
  experiment(s).
- Visualize and compare experiments with `dvc exp show` or `dvc exp diff`.
  Repeat 🔄
- Make certain experiments [persistent](#persistent-experiments) by committing
  their results to Git. This cleans the slate so you can repeat the process
  later.

[run experiments]: /doc/user-guide/experiment-management/running-experiments
[persistent]: /doc/user-guide/experiment-management/persisting-experiments

## Persistent Experiments

📖 See [full guide][persistent].

When your experiments are good enough to save or share, you may want to store
them persistently as Git commits in your <abbr>repository</abbr>.

Whether the results were produced with `dvc repro` directly, or after a
`dvc exp` workflow, `dvc.yaml` and `dvc.lock` will define the experiment as a
new project version. The right <abbr>outputs</abbr> (including
[metrics](/doc/command-reference/metrics)) should also be present, or available
via `dvc checkout`.

Use `dvc exp apply` and `dvc exp branch` to persist experiments in your Git
history.
