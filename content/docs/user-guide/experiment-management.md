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

Every time you `dvc repro` pipelines, DVC logs the unique signature of each
stage run (to `.dvc/cache/runs` by default). If it never happened before, the
stage command(s) are executed normally. Every subsequent time a
[stage](/doc/command-reference/run) runs under the same conditions, the previous
results can be restored instantly, without wasting time or computing resources.

✅ This mechanism can dramatically improve performance, and it's a built-in
feature, enabled out-of-the-box (it can be disabled via the `--no-run-cache`
option).

## Ephemeral experiments

⚠️ This feature is only available in DVC 2.0, and for Git-enabled
<abbr>repositories</abbr> ⚠️

`dvc experiments` commands let you run DVC
[pipelines](/doc/command-reference/dag) in a "virtual branch", so that each
experiment is captured automatically as a transient commit. Your parent Git repo
is not cluttered with all these commits. The base workflow goes like this:

- Establish or change the dependencies, parameters, or commands/source code of
  your stages.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline, which creates
  a transient commit that represents this experiment.
- Visualize the experiments statistics with `dvc exp show`. Repeat.
- Use metrics in your pipeline to help you identify the best experiment(s), and
  use `dvc exp apply` to promote them as persistent experiments (regular
  commits) to the project.

<details>

### What are virtual experiment branches?

DVC uses actual commits under custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) to keep track of `dvc exp run` branches. The first
run has the current Git repo's `HEAD` as parent.

</details>

> See `dvc exp` for more details.
