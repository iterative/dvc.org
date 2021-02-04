# Experiment Management

Data science and ML are iterative processes that tend to require a large number
of attempts during their course, for example to develop data features,
hyperspace exploration, deep learning optimization, etc. DVC is designed to help
you codify and manage all of your experiments.

DVC considers certain levels at which the variants of your work are considered
_experiments_:

0. Tests you do on you own without DVC knowing about them — we can't help with
   that!
1. An automatic log of every stage run through `dvc repro` is the entry point
   for DVC.
2. _Ephemeral experiments_ can be setup in virtual project branches. This is
   where you can start **automating** their execution and generate reports
   comparing many of them. At some point a few are selected/promoted, and the
   rest can be abandoned.
3. _Persistent experiments_ can be picked up from previous levels, or they can
   be registered manually by **committed** their results to Git. This is where
   you may want to start thinking about the different ways to
   [organize](#organizing-experimentats) them in your project (branches,
   folders, etc.).

## Automatic log of stage runs (run-cache)

Every time you `dvc repro` each stage [stages](/doc/command-reference/run), DVC
determines a unique identifier of each stage "run" (logged to `.dvc/cache/runs`
by default). If it never happened before, the stage command(s) are executed and
their <abbr>outputs</abbr> cached normally. Every subsequent time the stage runs
under the same conditions, those results can be restored instantly, without
wasting time or computing resources.

This mechanism can dramatically improve performance, and it's a built-in
feature, enabled out-of-the-box (it can be disabled via the `--no-run-cache`
option).

> Note that the run-cache assumes that stage commands are deterministic (see
> **Avoiding unexpected behavior** in `dvc run`).

## Ephemeral experiments

Unique stage runs can be identified by the combination of their dependencies
(including params) and the command(s) to execute.

Every run of a stage or pipeline can be considered an experiment. These are
identified by the exact combination of dependencies, , and

frequent, transient, brain storming

## Persistent experiments

selected, committed

## Organizing experiments

Implicit vs. Git branches/tags vs. file structures
