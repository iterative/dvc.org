# exp run

Run or resume an [experiment](/doc/command-reference/exp).

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

Provides a way to execute and track `dvc experiments` in your
<abbr>project</abbr> without polluting it with unnecessary commits, branches,
directories, etc.

> `dvc exp run` is equivalent to `dvc repro` for <abbr>experiments</abbr>. It
> has the same behavior when it comes to `targets` and stage execution (restores
> the dependency graph, etc.). See the command [options](#options) for more on
> the differences.

Before running an experiment, you'll probably want to make modifications such as
data and code updates, or <abbr>hyperparameter</abbr> tuning. For the latter,
you can use the `--set-param` (`-S`) option of this command to change
`dvc param` values on-the fly.

Each experiment creates and tracks a project variation based on your
<abbr>workspace</abbr> changes. Experiments will have an auto-generated name
like `exp-bfe64` by default, which can be customized using the `--name` (`-n`)
option.

<details>

### ⚙️ How does DVC track experiments?

Experiments are custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) with a single commit based on `HEAD` (not checked
out by DVC). Note that these commits are not pushed to the Git remote by default
(see `dvc exp push`).

</details>

The results of the last `dvc exp run` can be seen in the workspace. To display
and compare multiple experiments, use `dvc exp show` or `dvc exp diff`
(`plots diff` also accepts experiment names as `revisions`). Use `dvc exp apply`
to restore the results of any other experiment instead.

Successful experiments can be made
[persistent](/doc/user-guide/experiment-management#persistent-experiments) by
committing them to the Git repo. Unnecessary ones can be removed with
`dvc exp remove`or `dvc exp gc` (or abandoned).

> Note that experiment data will remain in the <abbr>cache</abbr> until you use
> regular `dvc gc` to clean it up.

## Checkpoints

To track successive steps in a longer or deeper <abbr>experiment</abbr>, you can
register checkpoints from your code. Each `dvc exp run` will resume from the
last checkpoint.

First, mark at least stage <abbr>output</abbr> with `checkpoint: true` in
`dvc.yaml`. This is needed so that the experiment can resume later, based on the
<abbr>cached</abbr> output(s) (circular dependency).

⚠️ Note that using `checkpoint` in `dvc.yaml` makes it incompatible with
`dvc repro`.

Then, use the `dvc.api.make_checkpoint()` function (Python code), or write a
signal file (any programming language) following the same steps as that
function.

You can now use `dvc exp run` to begin the experiment. All checkpoints
registered at runtime will be preserved, even if the process gets interrupted
(e.g. with `[Ctrl] C`, or by an error). Without interruption, a "wrap-up"
checkpoint will be added (if needed), so that changes to pipeline outputs don't
remain in the workspace.

Subsequent uses of `dvc exp run` will continue from the latest checkpoint (using
the latest cached versions of all outputs).

<details>

### ⚙️ How are checkpoints captured?

Instead of a single commit, checkpoint experiments have multiple commits under
the custom Git reference (in `.git/refs/exps`), similar to a branch.

</details>

List previous checkpoints with `dvc exp show`. To resume from a previous
checkpoint, you must first `dvc exp apply` it before using `dvc exp run`. For
`--queue` or `--temp` runs (see next section), use `--rev` instead to specify
the checkpoint to continue from.

Alternatively, use `--reset` to start over (discards previous checkpoints and
their outputs). This is useful for re-training ML models, for example.

## Queueing and parallel execution

The `--queue` option lets you create an experiment as usual, except that nothing
is actually run. Instead, the experiment is put in a wait-list for later
execution. `dvc exp show` will mark queued experiments with an asterisk `*`.

> Note that queuing an experiment that uses checkpoints implies `--reset`,
> unless a `--rev` is provided (refer to the previous section).

Use `dvc exp run --run-all` to process the queue. This is done outside your
<abbr>workspace</abbr> (in temporary dirs in `.dvc/tmp/exps`) to preserve any
changes between/after queueing runs.

💡 You can also run a single experiment outside the workspace with
`dvc exp run --temp`, for example to continue working on the project meanwhile
(e.g. on another terminal).

> ⚠️ Note that only tracked files and directories will be included in
> `--queue/temp` experiments. To include untracked files, stage them with
> `git add` first (before `dvc exp run`). Feel free to `git reset` them
> afterwards. Git-ignored files/dirs are explicitly excluded from runs outside
> the workspace to avoid committing unwanted files into experiments.

<details>

### ⚙️ How are experiments queued?

A custom [Git stash](https://www.git-scm.com/docs/git-stash) is used to queue
pre-experiment commits.

</details>

Adding `-j` (`--jobs`), experiment queues can be run in parallel for better
performance (creates a tmp dir for each job).

⚠️ Parallel runs are experimental and may be unstable at this time. ⚠️ Make sure
you're using a number of jobs that your environment can handle (no more than the
CPU cores).

> Note that each job runs the entire pipeline (or `targets`) serially. DVC makes
> no attempt to distribute stage commands among jobs. The order in which they
> were queued is also not preserved when running them.

## Options

> In addition to the following, `dvc exp run` accepts all the options in
> `dvc repro`, with the exception that `--no-commit` has no effect here.

- `-S [<filename>:]<param_name>=<param_value>`,
  `--set-param [<filename>:]<param_name>=<param_value>` - set the specified
  `dvc params` for this experiment. `filename` can be any valid params file
  (`params.yaml` by default). This will override the param values coming from
  the params file.

- `-n <name>`, `--name <name>` - specify a name for this experiment. A default
  name will generated by default, such as `exp-f80g4` (based on the experiment's
  hash).

- `--temp` - run this experiment outside your workspace (in `.dvc/tmp/exps`).
  Useful to continue working (e.g. in another terminal) while a long experiment
  runs.

- `--queue` - place this experiment at the end of a line for future execution,
  but don't actually run it yet. Use `dvc exp run --run-all` to process the
  queue. For checkpoint experiments, this implies `--reset` unless a `--rev` is
  provided.

- `--run-all` - run all queued experiments (see `--queue`) and outside your
  workspace (in `.dvc/tmp/exps`). Use `-j` to execute them
  [in parallel](#queueing-and-parallel-execution).

- `-j <number>`, `--jobs <number>` - run this `number` of queued experiments in
  parallel. Only has an effect along with `--run-all`. Defaults to 1 (the queue
  is processed serially).

- `-r <commit>`, `--rev <commit>` - continue an experiment from a specific
  checkpoint name or hash (`commit`) in `--queue` or `--temp` runs.

- `--reset` - deletes `checkpoint` outputs before running this experiment
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
