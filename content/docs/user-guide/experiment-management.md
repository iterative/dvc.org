# Experiment Management

Data science and ML are iterative processes that tend to require a large number
of attempts during their course, for example to develop data features,
hyperspace exploration, model accuracy optimization, etc. DVC is designed to
help you codify and manage all of your experiments.

Kinds of exps... With DVC, no variation of your code or data is left
hyperparameters

## Automatic log of stage runs

DVC already caches every change to <abbr>outputs</abbr> when it can (see also
`dvc status`). Additionally, `dvc repro` and `dvc run` by default populate and
reutilize a log of stages that have been run in the project, known as the
<abbr>run-cache</abbr>.

This means that every time you execute [stages](/doc/command-reference/run) with
DVC, the unique combination that identifies that "run" is saved internally (in
`.dvc/cache/runs` by default). The corresponding results (typically
<abbr>cached</abbr>) can later be retrieved in subsequent runs, even if you
didn't remember that the combination had been tried before!

When this happens, the results are restored instantly, without wasting time or
computing resources. This can dramatically improve performance, and it's a
built-in feature that just works out-of-the-box (it can be disabled via the
`--no-run-cache` option).

## Ephemeral experiments

frequent, transient, brain storming

## Persistent experiments

selected, committed

## Ways to organize experimentation

Implicit vs. Git branches/tags vs. file structures
