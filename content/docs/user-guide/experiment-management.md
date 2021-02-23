# Experiment Management

Data science and ML are iterative processes that require a large number of
attempts to reach a certain level of a metric. Experimentation is part of the
development of data features, hyperspace exploration, deep learning
optimization, etc. DVC helps you codify and manage all of your
<abbr>experiments</abbr>, supporting these main approaches:

1. Create [experiments](#experiments) that derive from your latest project
   version without having to track them manually. DVC does that automatically,
   letting you list and compare them. The best ones can be made persistent, and
   the rest archived.
2. Place in-code [checkpoints](#checkpoints-in-source-code) that mark a series
   of variations, forming a deep experiment. DVC helps you capture them at
   runtime, and manage them in batches.
3. Make experiments or checkpoints [persistent](#persistent-experiments) by
   committing them to your <abbr>repository</abbr>. Or create these versions
   from scratch like typical project changes.

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

- Modify stage <abbr>parameters</abbr> or other dependencies (e.g. input data,
  source code) of committed stages.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline. The results
  are reflected in your <abbr>workspace</abbr>, and tracked automatically.
- Use [metrics](/doc/command-reference/metrics) to identify the best
  experiment(s).
- Visualize and compare experiments with `dvc exp show` or `dvc exp diff`.
  Repeat.
- Use `dvc exp apply` to roll back to the best one.
- Make the selected experiment persistent by committing its results to Git. This
  cleans the slate so you can repeat the process.

## Checkpoints in source code

⚠️ This feature is only available in DVC 2.0 ⚠️

To track successive steps in a longer experiment, you can write your code so it
registers checkpoints with DVC at runtime. This allows you, for example, to
track the progress in deep learning techniques such as evolving neural networks.

This kind of experiment is also derived fom your latest project version, but it
tracks a series of variations (the checkpoints). You interact with them using
`dvc exp run`, `dvc exp resume`, and `dvc exp reset` (see also the `checkpoint`
field of `dvc.yaml` outputs).

## Persistent experiments

When your experiments are good enough to save or share, you may want to store
them persistently as Git commits in your <abbr>repository</abbr>.

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
