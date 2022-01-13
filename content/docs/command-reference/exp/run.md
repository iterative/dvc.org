# exp run

Run or resume a
[DVC Experiment](/doc/user-guide/experiment-management/experiments-overview).

## Synopsis

```usage
usage: dvc exp run [-h] [-q | -v] [-f]
                   [repro_options ...]
                   [-S [<filename>:]<params_list>]
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

> 📖 See full [Running Experiments] guide for more information.

Before running an experiment, you'll probably want to make modifications such as
<abbr>parameter</abbr> tuning. You can use the `--set-param` (`-S`) option to
change param values on-the fly.

> `dvc exp run` has the same behavior as `dvc repro` when it comes to `targets`
> and stage execution (restores the dependency graph, etc.). See the command
> [options](#options) for more on the differences.

Successful experiments can be [made persistent] by committing them to the Git
repo. Unnecessary ones can be [cleared].

It's possible to schedule experiments for later execution with
`dvc exp run --queue`. To actually run them, use `dvc exp run --run-all`. This
can execute them one by one (default) or in parallel (using the `--jobs`
option).

> 📖 Learn more about the [experiments queue].

It's also possible to run special [checkpoint experiments] for deep learning ML.

> 📖 See [Running checkpoint experiments].

[running experiments]: /doc/user-guide/experiment-management/running-experiments
[made persistent]: /doc/user-guide/experiment-management/persisting-experiments
[cleared]: /doc/user-guide/experiment-management/cleaning-experiments
[checkpoint experiments]: /doc/user-guide/experiment-management/checkpoints
[running checkpoint experiments]:
  /doc/user-guide/experiment-management/running-experiments#checkpoint-experiments
[experiments queue]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue

## Options

> In addition to the following, `dvc exp run` accepts all the options in
> `dvc repro`, with the exception that `--no-commit` has no effect.

- `-S [<filename>:]<param_name>=<param_value>`,
  `--set-param [<filename>:]<param_name>=<param_value>` - set the value of
  existing `dvc params` for this experiment. `filename` can be any valid params
  file (`params.yaml` by default). This will override the param values coming
  from the params file.

- `-n <name>`, `--name <name>` - specify a unique name for this experiment. A
  default one will generated otherwise, such as `exp-f80g4` (based on the
  experiment's hash).

- `--temp` - run this experiment outside your workspace (in `.dvc/tmp/exps`).
  Useful to continue working (e.g. in another terminal) while a long experiment
  runs.

- `--queue` - place this experiment at the end of a line for future execution,
  but don't actually run it yet. Use `dvc exp run --run-all` to process the
  queue.

  > For checkpoint experiments, this implies `--reset` unless a `--rev` is
  > provided.

- `--run-all` - run all queued experiments (see `--queue`) and outside your
  workspace (in `.dvc/tmp/exps`). Use `-j` to execute them
  [in parallel](#queueing-and-parallel-execution).

- `-j <number>`, `--jobs <number>` - run this `number` of queued experiments in
  parallel. Only has an effect along with `--run-all`. Defaults to 1 (the queue
  is processed serially).

- `-r <commit>`, `--rev <commit>` - continue an experiment from a specific
  checkpoint name or hash (`commit`) in `--queue` or `--temp` runs.

- `--reset` - deletes `checkpoint: true` outputs before running this experiment
  (regardless of `dvc.lock`). Useful for ML model re-training.

- `-f`, `--force` - reproduce pipelines even if no changes were found (same as
  `dvc repro -f`).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

> These examples are based on our [Get Started](/doc/start/experiments), where
> you can find the actual source code.

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

You could modify a params file just like any other <abbr>dependency</abbr> and
run an experiment on that basis. Since this is a common need, `dvc exp run`
comes with the `--set-param` (`-S`) option built-in to update existing
parameters. This saves you the need to manually edit the params file.

```dvc
$ dvc exp run -S prepare.split=0.25 -S featurize.max_features=2000
...
Reproduced experiment(s): exp-18bf6
Experiment results have been applied to your workspace.
```

To see the results, we can use `dvc exp diff` which compares both params and
metrics to the previous project version:

```dvc
$ dvc exp diff
Path         Metric    Value    Change
scores.json  avg_prec  0.58187  -0.022184
scores.json  roc_auc   0.93634  -0.024464

Path         Param                   Value    Change
params.yaml  featurize.max_features  2000     -1000
params.yaml  prepare.split           0.25     0.05
```

> Notice that experiments run as a series don't build up on each other. They are
> all based on `HEAD`.
