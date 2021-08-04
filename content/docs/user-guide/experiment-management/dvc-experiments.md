## DVC Experiments

_New in DVC 2.0_

`dvc exp` commands let you automatically track a variation to an established
[data pipeline](/doc/command-reference/dag). You can create multiple isolated
experiments this way, as well as review, compare, and restore them later, or
roll back to the baseline. The basic workflow goes like this:

- Modify stage <abbr>parameters</abbr> or other dependencies (e.g. input data,
  source code) of committed stages.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline. The results
  are reflected in your <abbr>workspace</abbr>, and tracked automatically.
- Use `dvc metrics` to identify the best experiment(s).
- Visualize, compare experiments with `dvc exp show` or `dvc exp diff`. Repeat
  🔄
- Use `dvc exp apply` to roll back to the best one.
- Make the selected experiment persistent by committing its results to Git. This
  cleans the slate so you can repeat the process.

## Persistent Experiments

When your experiments are good enough to save or share, you may want to store
them persistently as Git commits in your <abbr>repository</abbr>.

Whether the results were produced with `dvc repro` directly, or after a
`dvc exp` workflow, `dvc.yaml` and `dvc.lock` will define the experiment as a
new project version. The right <abbr>outputs</abbr> (including
[metrics](/doc/command-reference/metrics)) should also be present, or available
via `dvc checkout`.

Use `dvc exp apply` and `dvc exp branch` to persist experiments in your Git
history.
