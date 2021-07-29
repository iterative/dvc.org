## Experiments

_New in DVC 2.0_

`dvc exp` commands let you automatically track a variation to an established
[data pipeline](/doc/command-reference/dag). You can create multiple isolated
experiments this way, as well as review, compare, and restore them later, or
roll back to the baseline. The basic workflow goes like this:

- Modify stage <abbr>parameters</abbr> or other dependencies (e.g. input data,
  source code) of committed stages.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline. The results
  are reflected in your <abbr>workspace</abbr>, and tracked automatically.
- Use [metrics](/doc/command-reference/metrics) to identify the best
  experiment(s).
- Visualize, compare experiments with `dvc exp show` or `dvc exp diff`. Repeat
  🔄
- Use `dvc exp apply` to roll back to the best one.
- Make the selected experiment persistent by committing its results to Git. This
  cleans the slate so you can repeat the process.

## Persistent Experiments

When your experiments are good enough to save or share, you may want to store
them persistently as Git commits in your <abbr>repository</abbr>.

Whether the results were produced with `dvc repro` directly, or after a
`dvc exp` workflow (refer to previous sections), the `dvc.yaml` and `dvc.lock`
pair in the <abbr>workspace</abbr> will codify the experiment as a new project
version. The right <abbr>outputs</abbr> (including
[metrics](/doc/command-reference/metrics)) should also be present, or available
via `dvc checkout`.

## Run Cache: Automatic Log of Stage Runs

Every time you `dvc repro` pipelines or `dvc exp run` experiments, DVC logs the
unique signature of each stage run (to `.dvc/cache/runs` by default). If it
never happened before, the stage command(s) are executed normally. Every
subsequent time a [stage](/doc/command-reference/run) runs under the same
conditions, the previous results can be restored instantly, without wasting time
or computing resources.

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (but can be
disabled with the `--no-run-cache` command option).
