# exp run

Run or resume a [DVC experiment] based on a [DVC pipeline].

[dvc experiment]: /doc/user-guide/experiment-management
[dvc pipeline]: /doc/user-guide/pipelines

<admon type="info">

When called with no arguments, this is equivalent to `dvc repro` followed by
`dvc exp save`.

</admon>

## Synopsis

```usage
usage: dvc exp run [-h] [-q | -v] [-f]
                   { repro options ... } [-n <name>]
                   [-S [<filename>:]<override_pattern>]
                   [--queue] [--run-all] [-j <number>] [--temp]
                   [-r <experiment_rev>] [--reset] [-C <path>]
                   [-m <message>]
                   [targets [targets ...]]

positional arguments:
  targets               Stages to reproduce. 'dvc.yaml' by default
```

## Description

Executes and tracks <abbr>experiments</abbr> in your <abbr>repository</abbr>
without polluting it with unnecessary Git commits, branches, directories, etc.

<admon type="info">

Only files tracked by either Git or DVC are saved to the experiment. See
`dvc exp save --include-untracked` for an alternative.

</admon>

`dvc exp run` has the same general behavior as `dvc repro` when it comes to
`targets` and stage execution (restores the dependency graph, etc.).

<admon type="info">

This includes committing any changed data <abbr>dependencies</abbr> to the
<abbr>DVC cache</abbr> when preparing the experiment, which can take some time.

</admon>

Use the `--set-param` (`-S`) option as a shortcut to change
<abbr>parameter</abbr> values [on-the-fly] before running the experiment.

It's possible to [queue experiments] for later execution with the `--queue`
flag. Queued experiments can be run with `dvc queue start` and managed with
other `dvc queue` commands.

It's also possible to run special [checkpoint experiments] that log the
execution progress (useful for deep learning ML). The `--rev` and `--reset`
options have special uses for these.

<admon icon="book">

See the [Running Experiments] guide for more details on these features and more.

</admon>

[Review] your experiments with `dvc exp show`. Successful ones can be [made
persistent] by restoring them via `dvc exp branch` or `dvc exp apply` and
committing them to the Git repo. Unnecessary ones can be [cleared] with
`dvc exp remove`.

[on-the-fly]: #example-modify-parameters-on-the-fly
[queue experiments]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue
[checkpoint experiments]: /doc/user-guide/experiment-management/checkpoints
[running experiments]: /doc/user-guide/experiment-management/running-experiments
[review]: /doc/user-guide/experiment-management/comparing-experiments
[made persistent]: /doc/user-guide/experiment-management/persisting-experiments
[cleared]: /doc/user-guide/experiment-management/cleaning-experiments

## Options

> In addition to the following, `dvc exp run` accepts the options in `dvc repro`
> except for `--glob`, `--no-commit`, and `--no-run-cache`.

- `-S [<filename>:]<override_pattern>`,
  `--set-param [<filename>:]<override_pattern>` - set the value of `dvc params`
  for this experiment. This will update the parameters file (`params.yaml` by
  default) before running the experiment. Use the optional `[<filename>:]`
  prefix to use a custom params file.

  Valid `<override_pattern>` values can be defined in Hydra's [basic override]
  syntax (see [example](#example-modify-parameters-on-the-fly)). Hydra's
  [choice] and [range] sweep overrides are also supported, but these require the
  `--queue` flag to be provided as well (see
  [example](#example-run-a-grid-search)).

- `-n <name>`, `--name <name>` - specify a [unique name] for this experiment. A
  default one will be generated otherwise, such as `puffy-daks`.

  <admon type="tip">

  The name of the experiment is exposed in env var `DVC_EXP_NAME`.

  </admon>

- `--temp` - run this experiment outside your workspace (in `.dvc/tmp/exps`).
  Useful to continue working (e.g. in another terminal) while a long experiment
  runs.

- `--queue` - place this experiment at the end of a line for future execution,
  but don't run it yet. Use `dvc queue start` to process the queue.

  > For checkpoint experiments, this implies `--reset` unless a `--rev` is
  > provided.

- `--run-all` - run all queued experiments (see `--queue`) and outside your
  workspace (in `.dvc/tmp/exps`). Use `-j` to execute them
  [in parallel](#queueing-and-parallel-execution).

  <admon type="warn">

  `dvc exp run --run-all [--jobs]` is now a shortcut for
  `dvc queue start [--jobs]` followed by `dvc queue logs -f`. The `--run-all`
  and `--jobs` options will be deprecated in a future DVC release.

  </admon>

- `-j <number>`, `--jobs <number>` - run this `number` of queued experiments in
  parallel. Only has an effect along with `--run-all`. Defaults to 1 (the queue
  is processed serially).

- `-r <commit>`, `--rev <commit>` - resume an experiment from a specific
  checkpoint name or hash (`commit`) in `--queue` or `--temp` runs.

- `--reset` - deletes `checkpoint: true` outputs before running this experiment
  (regardless of `dvc.lock`). Useful for ML model re-training.

- `-f`, `--force` - reproduce pipelines even if no changes were found (same as
  `dvc repro -f`).

- `-C <path>`, `--copy-paths <path>` - list of ignored or untracked paths to
  copy into the temp directory. Only used if `--temp` or `--queue` is specified.

- `-m <message>`, `--message <message>` - custom message to use when saving the
  experiment. If not provided, `dvc: commit experiment {hash}` will be used.

- `-h`, `--help` - prints the usage/help message, and exits.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

[basic override]: https://hydra.cc/docs/advanced/override_grammar/basic/
[choice]: https://hydra.cc/docs/advanced/override_grammar/extended/#choice-sweep
[range]: https://hydra.cc/docs/advanced/override_grammar/extended/#range-sweep
[unique name]:
  https://dvc.org/doc/user-guide/experiment-management#how-does-dvc-track-experiments

## Examples

<admon type="info">

This example is based on [our Get Started], where you can find the actual source
code.

[our get started]: /doc/start/experiments

</admon>

<details>

### Expand to prepare the example ML project

Clone the DVC repo and download the data it <abbr>depends</abbr> on:

```cli
$ git clone git@github.com:iterative/example-get-started.git
$ cd example-get-started
$ dvc pull
```

Let's also install the Python requirements:

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> first.

```cli
$ pip install -r src/requirements.txt
```

</details>

Let's check the latest metrics of the project:

```cli
$ dvc metrics show
Path         avg_prec    roc_auc
scores.json  0.60405     0.9608
```

For this experiment, we want to see the results for a smaller dataset input, so
let's limit the data to 20 MB and reproduce the pipeline with `dvc exp run`:

```cli
$ truncate --size=20M data/data.xml
$ dvc exp run
...
Reproduced experiment(s): puffy-daks
Experiment results have been applied to your workspace.

$ dvc metrics diff
Path         Metric    HEAD     workspace  Change
scores.json  avg_prec  0.60405  0.56103    -0.04302
scores.json  roc_auc   0.9608   0.94003    -0.02077
```

The `dvc metrics diff` command shows the difference in performance for the
experiment we just ran (`puffy-daks`).

## Example: Modify parameters on-the-fly

`dvc exp run --set-param` (`-S`) saves you the need to manually edit a params
file (see `dvc params`) before running an experiment.

This option accepts Hydra's [basic override] syntax. For example, it can
override (`train.epochs=10`), append (`+train.weight_decay=0.01`), or remove
(`~model.dropout`) <abbr>parameters</abbr>:

```cli
dvc exp run -S 'prepare.split=0.1' -S 'featurize.max_features=100'
...
```

<admon type="tip">

Note that you can modify multiple parameters at once in the same command.

</admon>

By default, `-S` overwrites the values in `params.yaml`. To use another params
file, add a `<filename>:` prefix. For example, let's append a new parameter to
`train_config.json`:

```cli
$ dvc exp run -S 'train_config.json:+train.weight_decay=0.001'
...

$ dvc params diff --targets train_config.json
Path               Param                HEAD    workspace
train_config.json  train.weight_decay   -       0.001
```

<admon type="warn" title="Warnings">

`exp run --set-param` (`-S`) doesn't update your `dvc.yaml` to start or stop
tracking parameters. When appending or removing params, check if you need to
update the [`params` section] accordingly.

Similarly, when using custom param files, check that these are defined in
`dvc.yaml`.

[`params` section]: /doc/user-guide/project-structure/dvcyaml-files#parameters

</admon>

## Example: Run a grid search

Combining `--set-param` and `--queue`, we can perform a [grid search] for tuning
hyperparameters.

DVC supports Hydra's syntax for [choice] and [range] sweeps to add multiple
experiments to the queue. These can be used for multiple parameters at the same
time, adding all combinations to the queue:

```cli

$ dvc exp run -S 'train.min_split=8,64' -S 'train.n_est=range(100,500,100)' --queue
Queueing with overrides '{'params.yaml': ['train.min_split=8', 'train.n_est=100']}'.
Queued experiment 'azure-ices' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=8', 'train.n_est=200']}'.
Queued experiment 'zingy-peri' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=8', 'train.n_est=300']}'.
Queued experiment 'jammy-feds' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=8', 'train.n_est=400']}'.
Queued experiment 'lowse-shay' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=64', 'train.n_est=100']}'.
Queued experiment 'brown-hugs' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=64', 'train.n_est=200']}'.
Queued experiment 'local-scud' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=64', 'train.n_est=300']}'.
Queued experiment 'alpha-neck' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=64', 'train.n_est=400']}'.
Queued experiment 'algal-hood' for future execution.
$ dvc queue start
...
```

[grid search]:
  https://en.wikipedia.org/wiki/Hyperparameter_optimization#Grid_search

## Example: Include untracked or ignored paths

If your code relies on some paths that are intentionally untracked or ignored by
Git, you can use `-C/--copy-paths` to ensure those files are accessible when you
use the `--temp` or `--queue` flags:

```cli
$ dvc exp run --temp -C secrets.txt -C symlinked-directory
```

The paths will be copied to the temporary directory but will _not_ be tracked,
to prevent unintentional leaks.
