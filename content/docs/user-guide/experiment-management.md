# Experiment Management

Data science and ML are iterative processes that require a large number of
attempts to reach a certain level of a metric. Experimentation is part of the
development of data features, hyperspace exploration, deep learning
optimization, etc. DVC helps you codify and manage all of your
<abbr>experiments</abbr>, supporting these main approaches:

1. Create [experiments](#experiments) that derive from your latest project
   version without having to track them manually. DVC does that automatically,
   letting you list and compare them. The best ones can be promoted, and the
   rest archived.
2. Place in-code [checkpoints](#checkpoints-in-source-code) that mark a series
   of variations, forming an in-depth experiment. DVC helps you capture them at
   runtime, and manage them in batches.
3. Apply experiments or checkpoints as [persistent](#persistent-experiments)
   commits in your <abbr>repository</abbr>. Or create these versions from
   scratch like typical project changes.

   At this point you may also want to consider the different
   [ways to organize](#organization-patterns) experiments in your project (as
   Git branches, as folders, etc.).

DVC also provides specialized features to codify and analyze experiments.
[Parameters](/doc/command-reference/params) are simple values you can tweak in a
human-readable text file, which cause different behaviors in your code and
models. On the other end, [metrics](/doc/command-reference/metrics) (and
[plots](/doc/command-reference/plots)) let you define, visualize, and compare
meaningful measures for the experimental results.

## Experiments

⚠️ This feature is only available in DVC 2.0 ⚠️

`dvc exp` commands let you automatically track a variation to an established
[data pipeline](/doc/command-reference/dag). You can create multiple isolated
experiments this way, as well as review, compare, and restore them later, or
roll back to the baseline. The basic workflow goes like this:

- Modify <abbr>dependencies</abbr> (e.g. input data or source code),
  <abbr>hyperparameters</abbr>, or commands (`cmd` field of `dvc.yaml`) of
  committed stages.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline. This puts the
  experiment's results in your <abbr>workspace</abbr>, and tracks it under the
  hood.
- Visualize experiment configurations and results with `dvc exp show`. Repeat.
- Use [metrics](/doc/command-reference/metrics) in your pipeline to identify the
  best experiment(s), and promote them to persistent experiments (regular
  commits) with `dvc exp apply`.

<details>

### How does DVC track experiments?

DVC uses actual commits under custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) to keep track of experiments created with `dvc exp`.
Each commit has the repo `HEAD` as parent. These are not pushed to the Git
remote by default (see `dvc exp push`).

> References have a unique signature similar to the
> [entries in the run-cache](/doc/user-guide/project-structure/internal-files#run-cache).

</details>

## Checkpoints in source code

⚠️ This feature is only available in DVC 2.0 ⚠️

To track successive steps in a longer experiment, you can write your code so it
registers checkpoints with DVC at runtime. This allows you, for example, to
track the progress in deep learning techniques such as evolving neural networks.

This kind of experiment is also derived fom your latest project version, but it
tracks a series of variations (the checkpoints). You interact with them using
`dvc exp run`, `dvc exp resume`, and `dvc exp reset` (see also the `checkpoint`
field of `dvc.yaml`).

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

Whether the results were produced with `dvc repro` directly, or after a
`dvc exp` workflow (refer to previous sections), the `dvc.yaml` and `dvc.lock`
pair in the <abbr>workspace</abbr> will codify the experiment as a new project
version. The right <abbr>outputs</abbr> (including
[metrics](/doc/command-reference/metrics)) should also be present, or available
via `dvc checkout`.

> 👨‍💻 See [Get Started: Experiments](/doc/start/experiments) for a hands-on
> introduction to regular experiments.

### Organization patterns

DVC takes care of arranging `dvc exp` experiments and the data
<abbr>cache</abbr> under the hood. But when it comes to full-blown persistent
experiments, it's up to you to decide how to organize them in your project.
These are the main alternatives:

- **Git tags and branches** - use the repo's "time dimension" to distribute your
  experiments. This makes the most sense for experiments that build on each
  other. Helpful if the Git [revisions](https://git-scm.com/docs/revisions) can
  be easily visualized, for example with tools
  [like GitHub](https://docs.github.com/en/github/visualizing-repository-data-with-graphs/viewing-a-repositorys-network).
- **Directories** - the project's "space dimension" can be structured with
  directories (folders) to organize experiments. Useful when you want to see all
  your experiments at the same time (without switching versions) by just
  exploring the file system.
- **Hybrid** - combining an intuitive directory structure with a good repo
  branching strategy tends to be the best option for complex projects.
  Completely independent experiments live in separate directories, while their
  progress can be found in different branches.

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
