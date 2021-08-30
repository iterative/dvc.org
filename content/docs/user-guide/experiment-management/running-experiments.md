# Running Experiments

We explain how DVC codifies and executes experiments, setting their parameters,
using multiple jobs to run them in parallel, and running them in queues, among
other details.

> 📖 If this is the first time you are introduced into data science
> experimentation, you may want to check the basics in
> [Get Started: Experiments](/doc/start/experiments/) first.

## The pipeline

DVC relies on <abbr>pipelines</abbr> that codify experiment workflows (code,
<abbr>stages</abbr>, <abbr>parameters</abbr>, <abbr>outputs</abbr>, etc.) in a
`dvc.yaml` file. These contain the commands to run the experiments.

> 📖 See [Get Started: Data Pipelines](/doc/start/data-pipelines) for an intro
> to this topic.  
> Here we assume that there's already a working `dvc.yaml` file in the
> <abbr>project</abbr>.

[ug-pipeline-files]: /doc/user-guide/project-structure/pipelines-files

### Running the pipeline

You can run the pipeline using default settings with `dvc exp run`:

```dvc
$ dvc exp run
```

DVC keeps track of the dependency graph and runs only the stages with changed
dependencies or missing outputs.

> Example: for a pipeline composed of `prepare`, `train`, and `evaluate` stages,
> if a dependency of `prepare` stage has changed, the downstream stages
> (`train`, `evaluate`) are also run.

### Running specific stages

By default DVC uses `./dvc.yaml` (in the current directory). You can specify
`dvc.yaml` files in other directories, or even specific stages to run. These are
given as the last argument to the `dvc exp run`. Examples:

```dvc
$ dvc exp run my-project/dvc.yaml  # a specific dvc.yaml file

$ dvc exp run extract  # a specific stage (from `./dvc.yaml`)

$ dvc exp run my-project/dvc.yaml:extract
  # ^ a stage from a specific dvc.yaml file
```

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

### Interactive reproduction

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

For a params file named `params.yaml` with the contents

```yaml
model:
  learning_rate: 0.0001
```

You can specify the parameter dependency as

```dvc
$ dvc stage add -n train \
                --parameter model.learning_rate \
                --outs ...
```

> ⚠️ DVC does not check whether the parameters are actually used in your code.

<details>

#### Non-default parameter files

DVC allows param files in YAML 1.2, JSON, TOML, and Python formats. When your
parameters file is named something other than `params.yaml`, you need to specify
it in both stage description and `dvc exp run`. For example using
`myparams.toml`:

```dvc
$ dvc stage add -n train \
                -p myparams.toml:learning_rate \
                ...

$ dvc exp run -S myparams.toml:learning_rate = 0.0001
```

</details>

### Updating experiment parameters on-the-fly

DVC allows to update the parameters from command line when running
`dvc experiments`. The `--set-param` (`-S`) option takes a parameter name and
its value, and updates the params file before the run.

```dvc
$ dvc exp run --set-param model.learning_rate=0.0002
```

> Note that parameters are attached to experiments so you can view them together
> with `dvc exp show` and `dvc exp diff`.

To set more than one param for the same experiment, use the `-S` option multiple
times, or supply a comma-delimited list to `-S`:

```dvc
$ dvc exp run -S learning_rate=0.001 -S units=128
# is equivalent to
$ dvc exp run -S learning_rate=0.001,units=128
```

> ⚠️ Note that DVC doesn't check whether parameters given to `--set-param` are
> already in the parameters file. If there is a typo, a new or different param
> will be added/changed.

## The experiments queue

The `--queue` option of `dvc exp run` tells DVC to append an experiment for
later execution. Nothing is actually run yet.

<details>

### How are experiments queued?

Queued experiments are created similar to
[Git stash](https://www.git-scm.com/docs/git-stash). The last experiment queued
is found in `.git/refs/exps`, and earlier ones are in its [reflog].

[reflog]:
  https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefreflogareflog

</details>

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

Each experiment is derived from the workspace at the time it's queued. If you
make changes in the workspace afterwards, they won't be reflected in queued
experiments (once run).

<details>

### How are queued experiments isolated? (Temporary directories)

To guarantee that queued experiments derive from their original workspace, DVC
creates a copy of it in `.dvc/tmp/exps/`, where the experiment will run. All
these workspaces share the main project <abbr>cache</abbr>.

If you want to isolate an experiments this way without queuing it, you can use
the `--temp` option. This allows you to continue working while a long experiment
runs.

```dvc
$ nohup dvc exp run --temp &
[1] 30473
nohup: ignoring input and appending output to 'nohup.out'
```

> The above example creates a `nohup.log` file in the original workspace with
> the output of the DVC process.

Note that Git-ignored files/dirs are explicitly excluded from queued/temp runs
to avoid committing unwanted files into Git (e.g. once successful experiments
are [persisted]).

[persisted]: /doc/user-guide/experiment-management#persistent-experiments

> 💡 To include untracked files, stage them with `git add` first (before
> `dvc exp run`) and `git reset` them afterwards.

</details>

Run them all one-by-one with the `--run-all` flag. The order of execution is
independent of their creation order.

```dvc
$ dvc exp run --run-all
```

To remove all experiments from the queue and start over, you can use
`dvc exp remove --queue`.

### Running experiments in parallel

DVC allows to run queued experiments in parallel by specifying a number of
execution processes (`--jobs`):

```dvc
$ dvc exp run --run-all --jobs 4
```

> Note that since each experiment runs in an independent temporary directory,
> common <abbr>stages</abbr> may sometimes be executed several times depending
> on the state of the [run-cache] at that time.

[run-cache]: /doc/user-guide/project-structure/internal-files#run-cache

⚠️ Parallel runs are experimental and may be unstable at this time. ⚠️ Make sure
you're using a number of jobs that your environment can handle (no more than the
CPU cores).

## Checkpoint experiments

To track successive steps in a longer or deeper <abbr>experiment</abbr>, you can
register checkpoints from your code.

📖 See [Checkpoints](/doc/user-guide/experiment-management/checkpoints) to learn
about this feature.

Running the experiments containing checkpoints is no different than with regular
ones, e.g.:

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
