# Running Experiments

We explain how to execute DVC Experiments, setting their parameters, using
multiple jobs to run them in parallel, and running them in queues, among other
details.

> 📖 If this is the first time you are introduced into data science
> experimentation, you may want to check the basics in
> [Get Started: Experiments](/doc/start/experiments/) first.

## Pipelines files

DVC relies on `dvc.yaml` files that contain the commands to run the
experiment(s). These files codify _pipelines_ that specify one or more
<abbr>stages</abbr> of the experiment workflow (code, <abbr>dependencies</abbr>,
<abbr>outputs</abbr>, etc.).

> 📖 See [Get Started: Data Pipelines](/doc/start/data-pipelines) for an intro
> to this topic.

### Running the pipeline(s)

You can run the experiment pipeline using `dvc exp run`. It uses `./dvc.yaml`
(in the current directory) by default.

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-44136
```

> ⚠️ Note that any changed dependencies are committed to the DVC cache when
> preparing the experiment, which can take some time. `dvc exp gc` can clean up
> unnecessary ones.

DVC observes the [dependency graph] between stages, so it only runs the ones
with changed dependencies or outputs missing from the <abbr>cache</abbr>. You
can limit this to certain [reproduction targets] or even single stages
(`--single-item` flag).

<abbr>DVC projects</abbr> actually support more than one pipeline, in one or
more `dvc.yaml` files. The `--all-pipelines` option lets you run them all at
once.

> 📖 `dvc exp run` is an experiment-specific alternative to `dvc repro`.

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

> 📖 See `dvc params` for more details.

You could manually edit a params file and run an experiment using those as
inputs. Since this is a common sequence, the built-in option
`dvc exp run --set-param` (`-S`) is provided as a shortcut. It takes an existing
param name and value, and updates the file on-the-fly before execution.

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

Running checkpoint experiments is no different than running regular ones, e.g.:

```dvc
$ dvc exp run -S param=value
```

All checkpoints registered at runtime will be preserved, even if the process
gets interrupted (e.g. with `Ctrl+C`, or by an error). Without interruption, a
"wrap-up" checkpoint will be added (if needed), so that changes to pipeline
outputs don't remain in the workspace.

Subsequent uses of `dvc exp run` will resume from the latest checkpoint (using
the latest cached versions of all outputs). To resume from a previous checkpoint
(list them with `dvc exp show`), you must first `dvc exp apply` it before using
`dvc exp run`. For `--queue` or `--temp` runs, use `--rev` to specify the
checkpoint to resume from.

Alternatively, use `--reset` to start over (discards previous checkpoints and
their outputs). This is useful for re-training ML models, for example.

> Note that queuing an experiment that uses checkpoints implies `--reset`,
> unless a `--rev` is provided (refer to the previous section).
