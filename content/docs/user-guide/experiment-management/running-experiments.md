# Running Experiments

We explain how to execute DVC Experiments, setting their parameters, using
multiple jobs to run them in parallel, and running them in queues, among other
details.

> 📖 If this is the first time you are introduced into data science
> experimentation, you may want to check the basics in
> [Get Started: Experiments](/doc/start/experiments/) first.

## Pipelines files

DVC relies on `dvc.yaml` files that contain the commands to run the
experiment(s). These files codify _pipelines_ that specify the
<abbr>stages</abbr> of experiment workflows (code, <abbr>dependencies</abbr>,
<abbr>outputs</abbr>, etc.).

> 📖 See [Get Started: Data Pipelines](/doc/start/data-pipelines) for an intro
> to this topic.

### Running the pipeline(s)

You can run the pipeline using `dvc exp run`. It uses `./dvc.yaml` (in the
current directory) by default:

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-44136
```

DVC keeps track of the [dependency graph] among stages. It only runs the ones
with changed dependencies or outputs missing from the <abbr>cache</abbr>. You
can limit this to certain [reproduction targets] or even single stages
(`--single-item` flag).

<abbr>DVC projects</abbr> actually supports more than one pipeline, in one or
more `dvc.yaml` files. The `--all-pipelines` option lets you run them all at
once.

> 📖 `dvc exp run` is an experiment-specific alternative to `dvc repro` where
> you can learn more about these and other pipeline-related options.

[reproduction targets]: /doc/command-reference/repro#options
[dependency graph]: /doc/command-reference/dag#directed-acyclic-graph

## Tuning (hyper)parameters

Parameters are the values that modify the behavior of coded processes -- in this
case producing different experiment results. Machine learning experimentation
often involves defining and searching hyperparameter spaces to improve the
resulting model metrics.

In DVC project source code, <abbr>parameters</abbr> should be read from _params
files_ (`params.yaml` by default) and defined in `dvc.yaml`. When a tracked
param value has changed, `dvc exp run` invalidates any stages that depend on it,
and reproduces them.

> 📖 See [reproduction `targets`](/doc/command-reference/repro#options) for all
> the details.

### Running stages independently

In some cases you may need to run a stage without invoking its dependents. The
`--single-item` (`-s`) flag allows to run the command of a single stage.

> Example: for a pipeline composed of `prepare`, `train`, and `evaluate` stages
> and you only want to run the `train` stage to check its outputs, you can do so
> by:
>
> ```dvc
> $ dvc exp run --single-stage train
> ```

### Running all pipelines

<abbr>DVC projects</abbr> support more than a single pipeline in one or more
`dvc.yaml` files. In this case, you can run all pipelines with a single command:

```dvc
$ dvc exp run --all-pipelines
```

> Note that the order in which pipelines are executed is not guaranteed; Only
> the internal order of stage execution is.

(ℹ️) When your `dvc.yaml` files are organized inside recursive subfolders, you
can run their pipeline(s) using `dvc run --recursive`.

> 📖 Learn more about final experiment [organization patterns].

[organization patterns]:
  /doc/user-guide/experiment-management/persisting-experiments#organization-patterns

### Running stages interactively

When you want to have more granular control over which stages are run, you can
use the `--interactive` option. This flag allows you to confirm each stage
before running.

```dvc
$ dvc exp run --interactive
Going to reproduce stage: 'train'... continue? [y/n]
```

> Note that `dvc exp run` is an experimentation-specific alternative to
> `dvc repro`.

## (Hyper)parameters

<abbr>Parameters</abbr> are the values that modify the underlying code's
behavior, producing different experiment results. Machine learning
experimentation, for example, involves searching hyperparameters that improve
the resulting model metrics.

In DVC projects, parameters should be read by the code from _parameter files_
(`params.yaml` by default). DVC parses these files to track individual param
values. When a tracked param is changed, `dvc exp run` invalidates any stages
that depend on it, and reruns the experiment.

> Parameters can be defined in `dvc.yaml` directly or through `dvc stage add`.  
> 📖 See `dvc params` for more details.

You could manually edit a params file and run an experiment on that basis. Since
this is a common sequence, the built-in option `dvc exp run --set-param` (`-S`)
is provided as a shortcut. It takes an existing param name and value, and
updates the file on-the-fly before execution.

```dvc
$ cat params.yaml
model:
  learning_rate: 0.001
  units=64

$ dvc exp run --set-param model.learning_rate=0.0002
...

$ dvc exp run -S learning_rate=0.001 -S units=128  # set multiple params
...
```

## Experiment results

The results of the last `dvc exp run` can be seen in the <abbr>workspace</abbr>.
They are stored and tracked internally by DVC.

To display and compare multiple experiments along with their
<abbr>parameters</abbr> and <abbr>metrics</abbr>, use `dvc exp show` or
`dvc exp diff`. `plots diff` also accepts experiments as `revisions`. See
[Reviewing and Comparing Experiments][reviewing] for more details.

Use `dvc exp apply` to restore the results of any other experiment instead. See
[Bring experiment results to your workspace][apply] for more info.

[reviewing]: /doc/user-guide/experiment-management/comparing-experiments
[apply]:
  /doc/user-guide/experiment-management/persisting-experiments#bring-experiment-results-to-your-workspace

## The experiments queue

The `--queue` option of `dvc exp run` tells DVC to append an experiment for
later execution. Nothing is actually run yet.

```dvc
$ dvc exp run --queue -S units=10
Queued experiment '1cac8ca' for future execution.
$ dvc exp run --queue -S units=64
Queued experiment '23660bb' for future execution.
$ dvc exp run --queue -S units=128
Queued experiment '3591a5c' for future execution.
$ dvc exp run --queue -S units=256
Queued experiment '4109ead' for future execution.
```

<details>

### How are experiments queued?

Queued experiments are created similar to
[Git stash](https://www.git-scm.com/docs/git-stash). The last experiment queued
is found in `.git/refs/exps`, and earlier ones are in its [reflog].

[reflog]:
  https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefreflogareflog

</details>

Run them all with the `--run-all` flag:

```dvc
$ dvc exp run --run-all
...
```

> Note that the order of execution is independent of their creation order.

Their execution happens outside your <abbr>workspace</abbr> in temporary
directories for isolation, so each experiment is derived from the workspace at
the time it was queued.

<details>

### How are experiments isolated?

DVC creates a copy of the experiment's original workspace in `.dvc/tmp/exps/`
and runs it there. All workspaces share the single project <abbr>cache</abbr>,
however.

💡 To isolate any experiment (without queuing it), you can use the `--temp`
flag. This allows you to continue working while a long experiment runs, e.g.:

```dvc
$ nohup dvc exp run --temp &
[1] 30473
nohup: ignoring input and appending output to 'nohup.out'
```

Note that Git-ignored files/dirs are excluded from queued/temp runs to avoid
committing unwanted files into Git (e.g. once successful experiments are
[persisted]). To include untracked files, stage them with `git add` first
(before `dvc exp run`) and `git reset` them afterwards.

[persisted]: /doc/user-guide/experiment-management/persisting-experiments

</details>

💡 To clear the experiments queue and start over, use `dvc exp remove --queue`.

> 📖 See the `dvc exp run` reference for more options related to experiments
> queue, such as running them in parallel with `--jobs`.

## Checkpoint experiments

To track successive steps in a longer or deeper <abbr>experiment</abbr>, you can
register "checkpoints" from your code. These combine DVC Experiments with code
logging. The latter can be achieved either with [DVCLive](/doc/dvclive), by
using `dvc.api.make_checkpoint()` (Python code), or writing signal files (any
programming language) following the same steps as `make_checkpoint()`.

> 📖 See [Checkpoints](/doc/user-guide/experiment-management/checkpoints) to
> learn more about this feature.

Running checkpoint experiments is no different than with regular ones, e.g.:

```dvc
$ dvc exp run -S param=value
```

All checkpoints registered at runtime will be preserved, even if the process
gets interrupted (e.g. with `Ctrl+C`, or by an error). Without interruption, a
"wrap-up" checkpoint will be added (if needed), so that changes to pipeline
outputs don't remain in the workspace.

Subsequent uses of `dvc exp run` will continue from the latest checkpoint (using
the latest cached versions of all outputs). To resume from a previous checkpoint
(list them with `dvc exp show`), you must first `dvc exp apply` it before the
`dvc exp run`. For `--queue` or `--temp` runs, use `--rev` to specify the
checkpoint to continue from.

Alternatively, use `--reset` to start over (discards previous checkpoints and
their outputs). This is useful for re-training ML models, for example.

> Note that queuing an experiment that uses checkpoints implies `--reset`,
> unless a `--rev` is provided (refer to the previous section).
