# Running Experiments

## Motivation

Machine Learning and Data Science projects usually involve experimentation.
Motivation of these experiments can range from finding good hyperparameters to
checking data and concept drift. DVC 2 introduced a new set of commands to
manage experiments with minimum boilerplate. It allows to run experiments
defined by pipelines, track their associated data and model files, set
parameters for each, push experiment parameters and code to Git remotes without
committing them, create branches and persist them.

In this part of the DVC User's Guide we will explain how DVC runs the
experiments, setting parameters, running the experiments in parallel, or in
temporary directories.

If this is the first time you're introduced to Machine Learning experimentation,
it may be better to start with the
[Experiment's Trail](/doc/start/experiments/).

## The Pipeline

DVC uses pipelines composed of <abbr>stages</abbr>. Stages are isolated and
interdependent steps that has a command, a set of dependencies, and output.
Stages can depend onto each other and can build a <abbr>DAG</abbr>.

DVC employs the pipeline to run the experiment commands. Each pipeline has an
end-point, which is the last command in the pipeline. The output of this last
command is considered the output of experiment. Additionally DVC tracks
artifacts from intermediate stages, and doesn't reproduce them if their
dependents have not changed.

DVC pipelines are a detailed topic that we cover in [Get Started][gs-pipelines]
and the [User's Guide][ug-pipeline-files]. Here we assume that there is already
a pipeline defined in `dvc.yaml` file in the <abbr>project</abbr>.

[gs-pipelines]: /doc/start/data-pipelines
[ug-pipeline-files]: /doc/user-guide/project-structure/pipelines-files

### Running the pipeline

The pipeline defined in `dvc.yaml` file is run with default settings using:

```dvc
$ dvc exp run
```

If all dependencies and the experiment output are not changed and available in
the workspace, the `dvc exp run` doesn't rerun the commands.

For a pipeline composed of `extract`, `transform`, `train`, `evaluate`, if a
dependency of `train` stage has changed, the dependent stages (`evaluate`) are
also run.

### Specifying Targets

By default `dvc exp run` uses `dvc.yaml` file in the current directory. You can
specify other directories or pipeline elements to run. These are specified as
the last element of the command.

Pipelines can be of the following:

- A particular `dvc.yaml` file: `dvc exp run my-project/dvc.yaml`
- A directory that contains a `dvc.yaml` file: `dvc exp run my-project`
- A stage from the default `dvc.yaml` file: `dvc exp run extract`
- A stage from a specific `dvc.yaml` file:
  `dvc exp run my-project/dvc.yaml:extract`
- A set of stages from the default `dvc.yaml` file:
  `dvc exp run --glob 'train-*'`

### Running a Single Stage

In some cases you may need to run a single stage in the pipeline. The
`--single-item` (`-s`) flag allows to run the associated command of a single
stage.

If the pipeline has `extract`, `transform`, `train`, `evaluate` stages and you
only want to run the transform stage to check its outputs, you can do so by:

```dvc
$ dvc exp run --single-stage transform
```

### Running all Pipelines

In larger projects, there may be more than a single `dvc.yaml` file that
contains multiple pipelines. In this case, you can run all pipelines with a
single command.

```dvc
$ dvc exp run --all-pipelines
```

Note that the order to run these pipelines is not specified. If you have a
pipeline in `my-dir/dvc.yaml` and `another-dir/dvc.yaml`, either of these
pipelines can be run first.

### Interactive Reproduction

When you want to have more granular control over which stages are run, you can
use `--interactive` flag. This allows you to confirm each stage before running.

```dvc
$ dvc exp run --interactive
Going to reproduce stage: 'train'. Are you sure you want to continue? [y/n]
```

### Recursive Search for Pipelines

If you have a directory tree containing multiple pipelines and want to reproduce
all starting from a root directory, you can do so by `--recursive` (`-R`) flag.
For a directory tree, it starts from the root and descends into subdirectories.

```dvc
$ dvc exp run -R my-sub-project/
```

The above command begins from `my-sub-project/dvc.yaml`, and proceeds to
`my-sub-project/sub-module/...` to run all the pipelines.

### Improvements over `dvc repro`

## Parameters

Before running an experiment, you'll probably want to make modifications such as
data and code updates, or <abbr>hyperparameter</abbr> tuning. For the latter,
you can use the `--set-param` (`-S`) option of this command to change
`dvc param` values on-the fly.

### Setting Multiple Parameters for Experiments

### How DVC updates the parameters?

## The Experiments Queue

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

### Adding Experiments to the Queue

### Running Experiments in Parallel

### Cleaning Up the Experiment Queue

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

## Git and Experiments

Experiments are custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) with a single commit based on `HEAD` (not checked
out by DVC). Note that these commits are not pushed to the Git remote by default

## Note on Experiment Names

Each experiment creates and tracks a project variation based on your
<abbr>workspace</abbr> changes. Experiments will have an auto-generated name
like `exp-bfe64` by default, which can be customized using the `--name` (`-n`)
option.

When you create an experiment, DVC generates a hash value from the contents of
the experiment. This is shown when you use `--queue` option, e.g.,

```dvc
$ dvc exp run --queue -S model.conv_units=32
Queued experiment '6518f17' for future execution.
```

After _running_ the experiment, DVC uses another auto-generated name to refer to
the experiment. Typically these start with `exp-`, and can be set via
`--name / -n` option of `dvc exp run`. So when you add an experiment by setting
the name, you can see the hash value as _queued experiment_:

```dvc
$ dvc exp run --queue --name cnn-512 -S model.conv_units=512
Queued experiment '86bd8f9' for future execution.
```

In `dvc exp show` you can see both of these names:

```dvc
$ dvc exp show --no-pager --no-timestamp \
      --include-metrics loss --include-params model.conv_units

┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ loss    ┃ model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.23534 │ 64               │
│ 3973b6b                 │ -       │ 16               │
│ ├── aeaabb0 [exp-cb13f] │ 0.23534 │ 64               │
│ ├── d0ee7ce [exp-5dccf] │ 0.23818 │ 32               │
│ ├── 1533e4d [exp-88874] │ 0.24039 │ 128              │
│ ├── b1f41d3 [cnn-256]   │ 0.23296 │ 256              │
│ ├── 07e927f [exp-6c06d] │ 0.23279 │ 24               │
│ ├── b2b8586 [exp-2a1d5] │ 0.25036 │ 16               │
│ └── *86bd8f9            │ -       │ 512              │
└─────────────────────────┴─────────┴──────────────────┘
```

When an experiment is not run yet, only the former hash value is shown.

You can refer to the experiment in `dvc exp apply` or `dvc exp branch` after
running the experiment with the name starting with `exp-`, or the name you have
supplied with `dvc exp run --name`.
