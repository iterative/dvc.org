# Experiment Management

Data science and ML are iterative processes that tend to require a large number
of attempts during their course, for example to develop data features,
hyperspace exploration, deep learning optimization, etc. DVC helps you codify
and manage all of your <abbr>experiments</abbr>, considering the following
levels at which they may exist:

0. Tests you do on you own (without DVC knowing) — that's all you!
1. DVC enters the scene with an automatic log of every stage `dvc repro` runs.
2. Create [ephemeral experiments](#ephemeral-experiments) that virtually branch
   off your current workspace. You can start **automating** them at this point,
   and quickly visualize and compare them from terminal. The best ones can be
   promoted to the next level, and the rest archived.
3. [Persistent experiments](#persistent-experiments) have their results
   **committed** to Git. They can be selected from previous levels, or created
   from scratch. This is where you may want to consider the different
   [ways to organize](#organizing-experimentats) them in your project (as
   branches, folders, etc.).

> Note that DVC assumes that all experiments are deterministic (see **Avoiding
> unexpected behavior** in `dvc run`).

## Automatic log of stage runs (run-cache)

Every time you `dvc repro` stages, DVC logs the unique signature of that "run"
(to `.dvc/cache/runs` by default). If it never happened before, the stage
command(s) are executed normally. Every subsequent time the
[stage](/doc/command-reference/run) runs under the same conditions, the previous
results can be restored instantly, without wasting time or computing resources.

✅ This mechanism can dramatically improve performance, and it's a built-in
feature, enabled out-of-the-box (it can be disabled via the `--no-run-cache`
option).

## Ephemeral experiments

...

## Persistent experiments

...

## Organizing experiments

...
