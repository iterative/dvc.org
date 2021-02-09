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

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (but can be
disabled with the `--no-run-cache` command option).

## Ephemeral experiments

⚠️ This feature is only available in DVC 2.0, and for Git-enabled
<abbr>repositories</abbr> ⚠️

`dvc experiments` commands let you work on DVC
[pipelines](/doc/command-reference/dag) in a virtual branch, so that each
experiment is captured automatically in a way that you can review and roll back
later. The <abbr>workspace</abbr> may reflect each experiment's results for you
to check, but there's no need to save them manually. The base workflow goes like
this:

- Modify <abbr>dependencies</abbr> (e.g. input data or source code),
  <abbr>parameters</abbr>, or commands (`cmd` field of `dvc.yaml`) of a
  committed stage.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline, which creates
  a transient commit that records this experiment.
- Visualize the experiments statistics with `dvc exp show`. Repeat.
- Use [metrics](/doc/command-reference/metrics) in your pipeline to identify the
  best experiment(s), and promote them to persistent experiments (regular
  commits) with `dvc exp apply`.

<details>

### What are _virtual branches_ and _transient commits_?

DVC uses actual commits under custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) to keep track of `dvc exp run` branches. These are
not pushed to the Git remote by default (see `dvc exp push`).

The first transient commits has the Git repo's `HEAD` as parent, and the rest
branch off there. Each reference has a unique signature similar to the
[entries in the run-cache](/doc/user-guide/project-structure/internal-files#run-cache).

</details>

Note that `dvc exp run` also logs and reuses
[stage runs](#automatic-log-of-stage-runs-run-cache) in the
<abbr>run-cache</abbr> by default.

> See `dvc exp` for more details and other commands.

## Persistent experiments

When your experiments are good enough to save or share, you may want to store
them persistently as commits in your (Git-enabled) <abbr>repository</abbr>.

The results may have been produced with `dvc repro` directly, or after an
[ephemeral workflow](#ephemeral-experiments). In any case the workspace will
have the right `dvc.yaml` and `dvc.lock` file pair, as well as the corresponding
<abbr>outputs</abbr> (via `dvc checkout`).

See [Get Started: Experiments](/doc/start/experiments) for a hands-on intro
guide on regular experiments.

## Organizing experiments

Automatic [stage run logs](#automatic-log-of-stage-runs-run-cache) are dumped
without a structure in the <abbr>run-cache</abbr>.
[Ephemeral experiments](#ephemeral-experiments) always have a linear branch
structure (a queue) based on current `HEAD` commit. But when it comes to
full-blown [persistent experiments](#persistent-experiments), it's up to you to
decide how to organize them in your project. These are the main alternatives:

- Branches
- Tags
- Directories
- Hybrid
