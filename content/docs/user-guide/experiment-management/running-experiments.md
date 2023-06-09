# Running Experiments

We explain how to execute DVC Experiments, setting their parameters, queueing
them for future execution, running them in parallel, among other details.

<admon icon="book">

If this is the first time you are introduced into data science experimentation,
you may want to check the basics in [Get Started: Experiments] first.

[get started: experiments]: /doc/start/experiments

</admon>

## `dvc.yaml` files

DVC relies on `dvc.yaml` files that contain the commands to run the
experiment(s). These files codify _pipelines_ that specify one or more
<abbr>stages</abbr> of the experiment workflow (code, <abbr>dependencies</abbr>,
<abbr>outputs</abbr>, etc.).

<admon icon="book">

See [Get Started: Data Pipelines](/doc/start/data-pipelines) for an intro to
this topic.

</admon>

### Running the pipeline(s)

You can run the experiment <abbr>pipelines</abbr> using `dvc exp run`. It uses
`./dvc.yaml` (in the current directory) by default.

```cli
$ dvc exp run
...
Reproduced experiment(s): matte-vies
```

DVC observes the [dependency graph] between stages, so it only runs the ones
with changed dependencies or outputs missing from the <abbr>cache</abbr>. You
can limit this to certain [reproduction targets] or even single stages
(`--single-item` flag).

<abbr>DVC projects</abbr> actually support more than one pipeline, in one or
more `dvc.yaml` files. The `--all-pipelines` option lets you run them all at
once.

<admon icon="book">

`dvc exp run` is an experiment-specific alternative to `dvc repro`.
`dvc exp save` can be used to capture experiments after executing ML processes
manually.

</admon>

[reproduction targets]: /doc/command-reference/repro#options
[dependency graph]: /doc/user-guide/pipelines/defining-pipelines

## Experiment results

The results of the last `dvc exp run` can be seen in the <abbr>workspace</abbr>.
They are stored and tracked internally by DVC.

To display and compare multiple experiments along with their
<abbr>parameters</abbr> and <abbr>metrics</abbr>, use `dvc exp show` or
`dvc exp diff`. `plots diff` also accepts experiments as `revisions`. See
[Reviewing and Comparing Experiments][reviewing] for more details.

Use `dvc exp apply` to restore the results of any other experiment instead. See
[Bring experiment results to your workspace][apply] for more info.

<admon type="warn">

Only files tracked by either Git or DVC are saved to the experiment. Untracked
files cannot be restored.

</admon>

[reviewing]: /doc/user-guide/experiment-management/comparing-experiments
[apply]:
  /doc/user-guide/experiment-management/persisting-experiments#bring-experiment-results-to-your-workspace

## Tuning (hyper)parameters

Parameters are any values used inside your code to tune modeling attributes, or
that affect experiment results in any other way. For example, a [random forest
classifier] may require a _maximum depth_ value. Machine learning
experimentation often involves defining and searching hyperparameter spaces to
improve the resulting model metrics.

Your source code should read params from structured [parameters files]
(`params.yaml` by default). Define them with the `params` field of `dvc.yaml`
for DVC to track them. When a param value has changed, `dvc exp run` invalidates
any stages that depend on it, and reproduces them.

<admon icon="book">

See `dvc params` for more details.

</admon>

You could manually edit a params file and run an experiment using those as
inputs. Since this is a common sequence, the built-in option
`dvc exp run --set-param` (`-S`) is provided as a shortcut. It takes an existing
param name and value, and updates the file on-the-fly before execution.

```cli
$ cat params.yaml
model:
  learning_rate: 0.001
  units=64

$ dvc exp run --set-param model.learning_rate=0.0002
...

$ dvc exp run -S learning_rate=0.001 -S units=128  # set multiple params
...
```

[random forest classifier]:
  https://medium.com/all-things-ai/in-depth-parameter-tuning-for-random-forest-d67bb7e920d
[parameters files]:
  /doc/user-guide/project-structure/dvcyaml-files#parameters-files

<admon icon="book">

See [Hydra composition](/doc/user-guide/experiment-management/hydra-composition)
for more advanced configuration options via parameter overrides (change, append,
or remove, or use "choice" sets and ranges).

</admon>

## The experiments queue

The `--queue` option of `dvc exp run` tells DVC to append an experiment for
later execution. Nothing is actually run yet. Let's setup a simple
hyperparameter [grid search]:

```cli
$ dvc exp run --queue -S units=10
Queued experiment '1cac8ca' for future execution.
$ dvc exp run --queue -S units=64
Queued experiment '23660bb' for future execution.
$ dvc exp run --queue -S units=128
Queued experiment '3591a5c' for future execution.
$ dvc exp run --queue -S units=256
Queued experiment '4109ead' for future execution.
```

[grid search]:
  https://en.wikipedia.org/wiki/Hyperparameter_optimization#Grid_search

<details>

### How are experiments queued?

Queued experiments are managed using [dvc-task] and [Celery].

[dvc-task]: https://github.com/iterative/dvc-task
[celery]: https://docs.celeryq.dev/en/stable/index.html

</details>

Run them all with `dvc queue start`:

```cli
$ dvc queue start
...
```

<admon type="info">

In most cases, experiment tasks will be executed in the order that they were
added to the queue (First In, First Out), but this is not guaranteed.

</admon>

Their execution happens outside your <abbr>workspace</abbr> in temporary
directories for isolation, so each experiment is derived from the workspace at
the time it was queued.

Queued experiments are processed serially by default, but can be run in parallel
by using more than one `--jobs` (to `dvc queue start` more than one worker).

<admon type="warn">

Parallel runs (using `--jobs` > 1) are experimental and may be unstable. Make
sure you're using number of jobs that your environment can handle (no more than
the CPU cores).

Note that since queued experiments are run isolated from each other, common
stages may be executed multiple times depending on the state of the
<abbr>run-cache</abbr> at that time.

</admon>

<details>

### How are experiments isolated?

DVC creates a copy of the experiment's original workspace in `.dvc/tmp/exps/`
and runs it there. All workspaces share the single project <abbr>cache</abbr>,
however.

💡 To isolate any experiment (without queuing it), you can use the `--temp`
flag. This allows you to continue working while a long experiment runs, e.g.:

```cli
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

<admon type="tip">

To clear the experiments queue and start over, use `dvc queue remove --queued`.

</admon>

<admon icon="book">

For more advanced grid searches, DVC supports complex config via [Hydra
composition].

[hydra composition]: /doc/user-guide/experiment-management/hydra-composition

</admon>
