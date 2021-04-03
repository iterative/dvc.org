# exp run

Run an [experiment](/doc/command-reference/exp): reproduce a variation of a
committed [pipeline](/doc/command-reference/dag) in a hidden project branch.

> Similar to `dvc repro` but for
> [experimentation](/doc/user-guide/experiment-management).

## Synopsis

```usage
usage: dvc exp run [-h] [-q | -v] [-f]
                   [<repro_options> ...]
                   [--set-param [<filename>:]<params_list>]
                   [-n <name>] [--queue] [--run-all] [-j <number>]
                   [targets [targets ...]]

positional arguments:
  targets               Stages to reproduce. 'dvc.yaml' by default
```

## Description

Provides a way to execute and track `dvc experiments` in your
<abbr>project</abbr> without polluting it with unnecessary commits, branches,
directories, etc.

> `dvc exp run` is equivalent to `dvc repro` for <abbr>experiments</abbr>. It
> has the same behavior when it comes to `targets` and stage execution (restores
> the dependency graph, etc.). See the command [options](#options) for more the
> differences.

Before using this command, you'll probably want to make modifications such as
data and code updates, or <abbr>hyperparameter</abbr> tuning. You can use the
`--set-param` option to change `dvc param` values on-the fly.

Each `dvc exp run` creates a variation based on the latest project version
committed to Git (`HEAD`), and tracks this experiment with an auto-generated
name like `exp-bfe64` (which can be customized with the `--name` option).

<details>

### How does DVC track experiments?

Experiments are custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) with a commit based on `HEAD`. Note that they're not
pushed to the Git remote by default (see `dvc exp push`).

</details>

The results of the last experiment can be seen in the <abbr>workspace</abbr>. To
display and compare your experiments, use `dvc exp show` or `dvc exp diff`. Use
`dvc exp apply` to roll back the workspace to a previous experiment.

Successful experiments can be made
[persistent](/doc/user-guide/experiment-management#persistent-experiments) by
committing them to the Git repo. Unnecessary ones can be removed with
`dvc exp remove`or `dvc exp gc` (or abandoned).

> Note that experiment data will remain in the <abbr>cache</abbr> until you use
> regular `dvc gc` to clean it up.

## Checkpoints

To track successive steps in a longer <abbr>experiment</abbr>, you can register
checkpoints with DVC during your code or script runtime (similar to a logger).

To do so, first mark stage `outs` with `checkpoint: true` in `dvc.yaml`. At
least one checkpoint <abbr>output</abbr> is needed so that the experiment can
later continue from that output's last cached state.

⚠️ Note that using the `checkpoint` field in `dvc.yaml` is not compatible with
`dvc repro`.

Then, in your code either call the `dvc.api.make_checkpoint()` function
(Python), or write a signal file (any programming language) following the same
steps as `make_checkpoint()` — please refer to its reference for details.

You can now use `dvc exp run` to begin the experiment. If the process gets
interrupted (e.g. with `[Ctrl] C` or by an error), all the checkpoints so far
will be preserved. When a run finishes normally, a final checkpoint will be
added (if needed) to wrap up the experiment.

Following uses of `dvc exp run` will continue from this point (using the latest
cached versions of all outputs). You can add a `--rev` to continue from a
previous checkpoint instead (list them with `dvc exp show`). Or use `--reset` to
start over (discards previous checkpoints and deletes `checkpoint` outputs, like
the first `dvc exp run`) — useful for re-training ML models, for example.

<details>

### How are checkpoints captured?

Instead of a single commit, checkpoint experiments have multiple commits under
the custom Git reference (in `.git/refs/exps`), forming a branch.

</details>

## Queueing and parallel execution

The `--queue` option lets you create an experiment as usual, except that nothing
is actually run. Instead, the experiment is put in a wait-list for later
execution. `dvc exp show` will mark queued experiments with an asterisk `*`.

> Note that queuing an experiment that uses checkpoints implies `--reset`,
> unless a `--rev` is provided (refer to the previous section).

Use `dvc exp run --run-all` to process this queue. Adding `-j` (`--jobs`),
experiment queues can be run in parallel for better performance. This creates a
temporary workspace copy for each subprocess (in `.dvc/tmp/exps`). See also
`--temp`.

⚠️ Parallel runs are experimental and may be unstable at this time. ⚠️ Make sure
you're using a number of jobs that your environment can handle (no more than the
CPU cores).

> Note that each job runs the entire pipeline (or `targets`) serially — DVC
> makes no attempt to distribute stage commands among jobs.

## Options

> In addition to the following, `dvc exp run` accepts all the options in
> `dvc repro`, with the exception that `--no-commit` has no effect here.

- `-S [<filename>:]<params_list>`, `--set-param [<filename>:]<params_list>` -
  set the specified `dvc params` for this experiment. `filename` can be any
  valid params file (`params.yaml` bu default). `params_list` accepts a
  comma-separated list of key-value pairs in the form `key1=val1,key2=val2...`.
  This will override the param values coming from the params file.

- `-n <name>`, `--name <name>` - specify a name for this experiment. A default
  name will generated by default, such as `exp-f80g4` (based on the experiment's
  hash).

- `--queue` - place this experiment at the end of a line for future execution,
  but do not actually run it yet. Use `dvc exp run --run-all` to process the
  queue. For checkpoint experiments, this implies `--reset` unless a `--rev` is
  provided.

- `--run-all` - run all queued experiments (see `--queue`). Use `-j` to execute
  them [in parallel](#queueing-and-parallel-execution).

- `-j <number>`, `--jobs <number>` - run this `number` of queued experiments in
  parallel. Only applicable when used in conjunction with `--run-all`.

- `--temp` - run this experiment in a separate temporary directory (in
  `.dvc/tmp/exps`) instead of your workspace.

- `-r <commit>`, `--rev <commit>` - continue an experiment from a specific
  checkpoint name or hash (`commit`). This is needed for example to resume
  experiments from `--queue` or `--temp` runs.

- `--reset` - deletes `checkpoint` outputs before running this experiment
  (regardless of `dvc.lock`). Implies `--force`, so that cached checkpoint
  results are regenerated. Useful for ML model re-training.

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
Path         Metric    Old      New      Change
scores.json  avg_prec  0.60405  0.56103  -0.04302
scores.json  roc_auc   0.9608   0.94003  -0.02077
```

The `dvc metrics diff` command shows the difference in performance for the
experiment we just ran (`exp-44136`).

## Example: Modify parameters on-the-fly

You could modify a params file just like any other <abbr>dependency</abbr> and
run an experiment on that basis. Since this is a common need, `dvc exp run`
comes with the `--set-param` (`-S`) option built-in. This saves you the need to
manually edit the params file:

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
