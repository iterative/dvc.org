# exp run

Run or resume a [DVC experiment].

[dvc experiment]: /doc/user-guide/experiment-management/experiments-overview

## Synopsis

```usage
usage: dvc exp run [-h] [-q | -v] [-f]
                   { repro options ... } [-n <name>]
                   [-S [<filename>:]<override_pattern>]
                   [--queue] [--run-all] [-j <number>] [--temp]
                   [-r <experiment_rev>] [--reset]
                   [targets [targets ...]]

positional arguments:
  targets               Stages to reproduce. 'dvc.yaml' by default
```

## Description

Provides a way to execute and track <abbr>experiments</abbr> in your
<abbr>project</abbr> without polluting it with unnecessary commits, branches,
directories, etc.

`dvc exp run` has the same general behavior as `dvc repro` when it comes to
`targets` and stage execution (restores the dependency graph, etc.).

<admon type="info">

This includes committing any changed data <abbr>dependencies</abbr> to the
<abbr>DVC cache</abbr> when preparing the experiment, which can take some time.
See the [Options](#options) section for the differences.

</admon>

Use the `--set-param` (`-S`) option as a shortcut to change
<abbr>parameter</abbr> values [on-the-fly] before running the experiment. See
the [option description](#-S) for details regarding the syntax.

It's possible to [queue experiments] for later execution with the `--queue`
flag. Queued experiments can be run with `dvc queue start` and managed with
other `dvc queue` commands.

It's also possible to run special [checkpoint experiments] that log the
execution progress (useful for deep learning ML). The `--rev` and `--reset`
options have special uses for these.

<admon type="info">

See the [Running Experiments] guide for more details on all these features.

</admon>

[Review] your experiments with `dvc exp show`. Successful ones can be [made
persistent] by restoring them via `dvc exp branch` or `dvc exp apply` and
committing them to the Git repo. Unnecessary ones can be [cleared] with
`dvc exp gc`.

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
  for this experiment.

  This will update the param file **before** running the experiment.

  Valid `<override_pattern>` values are defined in Hydra's [Basic Override
  syntax]. In addition to the basic override syntax, the
  [Choice](https://hydra.cc/docs/advanced/override_grammar/extended/#choice-sweep)
  and
  [Range](https://hydra.cc/docs/advanced/override_grammar/extended/#range-sweep)
  syntax are supported for defining sweeps, but both require the `--queue`
  option to be also provided.

  You can optionally provide a prefix `[<filename>:]` to edit a specific
  `dvc params` file. If not provided, `params.yaml` will be used as default.

- `-n <name>`, `--name <name>` - specify a [unique name] for this experiment. A
  default one will be generated otherwise, such as `exp-f80g4` (based on the
  experiment's hash).

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

- `-h`, `--help` - prints the usage/help message, and exits.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

[unique name]:
  https://dvc.org/doc/user-guide/experiment-management/experiments-overview#how-does-dvc-track-experiments
[run-cache]: /doc/user-guide/project-structure/internal-files#run-cache

## Examples

> This is based on our [Get Started](/doc/start/experiments), where you can find
> the actual source code.

<details>

### Expand to prepare the example ML project

Clone the DVC repo and download the data it <abbr>depends</abbr> on:

```dvc
$ git clone git@github.com:iterative/example-get-started.git
$ cd example-get-started
$ dvc pull
```

Let's also install the Python requirements:

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> first.

```dvc
$ pip install -r src/requirements.txt
```

</details>

Let's check the latest metrics of the project:

```dvc
$ dvc metrics show
Path         avg_prec    roc_auc
scores.json  0.60405     0.9608
```

For this experiment, we want to see the results for a smaller dataset input, so
let's limit the data to 20 MB and reproduce the pipeline with `dvc exp run`:

```dvc
$ truncate --size=20M data/data.xml
$ dvc exp run
...
Reproduced experiment(s): exp-44136
Experiment results have been applied to your workspace.

$ dvc metrics diff
Path         Metric    HEAD     workspace  Change
scores.json  avg_prec  0.60405  0.56103    -0.04302
scores.json  roc_auc   0.9608   0.94003    -0.02077
```

The `dvc metrics diff` command shows the difference in performance for the
experiment we just ran (`exp-44136`).

## Example: Modify parameters on-the-fly

`dvc exp run --set-param` (`-S`) saves you the need to manually edit the params
file before running an experiment.

It can override (`train.epochs=10`), append (`+train.weight_decay=0.01`), or
remove (`~model.dropout`) parameters.

You can modify multiple parameters at the same time:

```dvc
dvc exp run -S 'prepare.split=0.1' -S 'featurize.max_features=100'
...
```

## Example: Grid Search

Combining `--set-param` and `--queue`, we can perform a
[Grid search](https://en.wikipedia.org/wiki/Hyperparameter_optimization#Grid_search)
for tuning hyperparameters.

DVC supports Hydra's
[Choice](https://hydra.cc/docs/advanced/override_grammar/extended/#choice-sweep)
and
[Range](https://hydra.cc/docs/advanced/override_grammar/extended/#range-sweep)
syntax for adding multiple experiments to the queue.

This syntax can be used for multiple parameters at the same time, adding all
combinations to the queue:

```dvc
$ dvc exp run -S 'train.min_split=2,8,64' -S 'train.n_est=100,200' --queue
Queueing with overrides '{'params.yaml': ['train.min_split=2', 'train.n_est=100']}'.
Queued experiment 'ed3b4ef' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=8', 'train.n_est=100']}'.
Queued experiment '7a10d54' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=64', 'train.n_est=100']}'.
Queued experiment '0b443d8' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=2', 'train.n_est=200']}'.
Queued experiment '0a5f20e' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=8', 'train.n_est=200']}'.
Queued experiment '0a5f20e' for future execution.
Queueing with overrides '{'params.yaml': ['train.min_split=64', 'train.n_est=200']}'.
Queued experiment '0a5f20e' for future execution.
$ dvc queue start
...
```

We can then find and apply the best experiment:

```dvc
$ dvc exp apply $(dvc exp show --no-pager --sort-by avg_prec | tail -n 2 | head -n 1 | grep -o 'exp-\w*')
```

<admon type="tip">

See more in `dvc exp apply` and `dvc exp show`

</admon>

## Example: Append parameters from custom files

Given a `dvc.yaml` that uses a custom parameters file:

```yaml
stages:
  train:
    cmd: python train.py
    params:
      - train_config.json: # tracks all params in this file
```

We can add the `[<filename>:]` prefix to modify the parameters of arbitrary
files. For example, to append a new parameter to`train_config.json`:

```dvc
$ dvc exp run -S 'train_config.json:+train.weight_decay=0.001'
...

$ dvc params diff
Path               Param                HEAD    workspace
train_config.json  train.weight_decay   -       0.001
```

<admon type="warn">

Note that `exp run --set-param` (`-S`) doesn't update your `dvc.yaml`. When
appending or removing <abbr>parameters</abbr>, make sure to update the
[`params` section](https://dvc.org/doc/user-guide/project-structure/dvcyaml-files#parameters)
of your `dvc.yaml` accordingly.

Alternatively, you can track all the parameters in the file being modified, as
shown in the `dvc.yaml` above.

</admon>

[basic override syntax]: https://hydra.cc/docs/advanced/override_grammar/basic/
