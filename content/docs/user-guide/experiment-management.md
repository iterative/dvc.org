# Experiment Management

Data science and ML are iterative processes that tend to require a large number
of attempts during their course, for example to develop data features,
hyperspace exploration, deep learning optimization, etc. DVC helps you codify
and manage all of your <abbr>experiments</abbr>, supporting these main
experimentation approaches:

1. Create [ephemeral experiments](#ephemeral-experiments) that derive from your
   latest project version, without having to keep track manually. DVC does that
   for you, letting you list and compare them. The best ones can be promoted,
   and the rest archived.
2. Place [in-code checkpoints](#checkpoints-in-source-code) that form series of
   (ephemeral) experiments. DVC helps you capture them at runtime, and manage
   them as batches.
3. [Persistent experiments](#persistent-experiments) have their results
   **committed** to Git. They can be selected from existing attempts, or created
   from scratch.

   At this point you may also want to consider the different
   [ways to organize](#organizing-experimentats) experiments in your project (as
   Git branches, as folders, etc.).

## Ephemeral experiments

⚠️ This feature is only available in DVC 2.0 ⚠️

`dvc exp` commands let you automatically track multiple variations to
established DVC [pipelines](/doc/command-reference/dag), so you can review,
compare, and restore them at any time, or roll back to the baseline. The basic
workflow goes like this:

- Modify <abbr>dependencies</abbr> (e.g. input data or source code),
  <abbr>parameters</abbr>, or commands (`cmd` field of `dvc.yaml`) of a
  committed stage.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline. This puts the
  experiment's results in your <abbr>workspace</abbr>, and records it under the
  hood.
- Visualize experiment configurations and results with `dvc exp show`. Repeat.
- Use [metrics](/doc/command-reference/metrics) in your pipeline to identify the
  best experiment(s), and promote them to persistent experiments (regular
  commits) with `dvc exp apply`.

<details>

### How does DVC capture these experiments?

DVC uses actual commits under custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) to keep track of ephemeral experiments. Each commit
has the repo `HEAD` as parent. These are not pushed to the Git remote by default
(see `dvc exp push`).

> References have a unique signature similar to the
> [entries in the run-cache](/doc/user-guide/project-structure/internal-files#run-cache).

</details>

## Checkpoints in source code

⚠️ This feature is only available in DVC 2.0 ⚠️

To track successive steps in a longer experiment, you can write your code so it
registers checkpoints with DVC at runtime. This allows you, for example, to
track the progress in deep learning techniques such as evolving neural networks.

This kind of experiment is also derived fom your latest project version, but it
can contain a series of variations (the checkpoints). You mainly interact with
them using `dvc exp run`, `dvc exp resume`, and `dvc exp reset`. See also the
`checkpoint` field of `dvc.yaml`.

<details>

### How are checkpoints captured by DVC?

When DVC runs a checkpoint-enabled pipeline, a custom Git branch (in
`.git/refs/exps`) is started off the repo `HEAD`. A new commit is appended each
time the code calls `dvc.api.make_checkpoint()` or writes a
`.dvc/tmp/DVC_CHECKPOINT` signal file. These are not pushed to the Git remote by
default (see `dvc exp push`).

</details>

## Persistent experiments

When your experiments are good enough to save or share, you may want to store
them persistently as commits in your <abbr>repository</abbr>.

The results may have been produced with `dvc repro` directly, or after an
[ephemeral workflow](#ephemeral-experiments). In any case the workspace will
have the right `dvc.yaml` and `dvc.lock` file pair, as well as the corresponding
<abbr>outputs</abbr> (via `dvc checkout`).

See [Get Started: Experiments](/doc/start/experiments) for a hands-on intro
guide on regular experiments.

## Automatic log of stage runs (run-cache)

Every time you `dvc repro` pipelines or `dvc exp run` experiments, DVC logs the
unique signature of each stage run (to `.dvc/cache/runs` by default). If it
never happened before, the stage command(s) are executed normally. Every
subsequent time a [stage](/doc/command-reference/run) runs under the same
conditions, the previous results can be restored instantly, without wasting time
or computing resources.

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (but can be
disabled with the `--no-run-cache` command option).

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
