# Running Experiments

## Motivation

Machine Learning and Data Science projects usually involve experimentation.
These experiments' goals can range from finding good hyperparameters to testing
for data and concept drift. DVC 2 introduced a new set of commands to manage
experiments with minimum boilerplate. It allows to run experiments defined by
pipelines, track their associated data and model files, set parameters for each,
push experiment parameters and code to Git remotes without committing them,
create branches and persist them in Git.

In this part of the DVC User's Guide we explain how DVC runs the experiments,
set the parameters, use multiple jobs to run the experiments in parallel, or
running them in temporary directories.

If this is the first time you are introduced into Machine Learning
experimentation, you may find a quicker introduction to the most salient
features in the [Experiment's Trail](/doc/start/experiments/).

## The Pipeline

DVC uses pipelines composed of <abbr>stages</abbr>. Stages are granular and
interdependent steps that has a command, a set of dependencies, and output.
Stages can depend onto each other via their outputs that build a
<abbr>DAG</abbr>.

DVC employs the pipeline to run the experiment commands. Each pipeline has an
end-point, which is the last command in the pipeline. DVC also tracks artifacts
from the intermediate stages, and doesn't reproduce them if their dependents
have not changed.

DVC pipelines are a detailed topic that we cover in [Get Started][gs-pipelines]
and the [User's Guide][ug-pipeline-files]. Here we assume that there is already
a pipeline defined in `dvc.yaml` file in the <abbr>project</abbr>.

[gs-pipelines]: /doc/start/data-pipelines
[ug-pipeline-files]: /doc/user-guide/project-structure/pipelines-files

### Running the pipeline

You can run the pipeline defined in `dvc.yaml` file with the default settings
using:

```dvc
$ dvc exp run
```

If there are no missing or changed outputs in the the workspace, the
`dvc exp run` doesn't rerun the commands. DVC keeps track of the dependency
graph and runs only the stages with missing or changed dependencies.

> Example: For a pipeline composed of `extract`, `transform`, `train`,
> `evaluate`, if a dependency of `train` stage has changed, the dependent stages
> (`evaluate`) are also run.

#### Running Specific Stages

By default `dvc exp run` uses `dvc.yaml` file in the current directory. You can
specify `dvc.yaml` in other directories or stages to run. These are specified as
the last element of the command.

- A particular `dvc.yaml` file: `dvc exp run my-project/dvc.yaml`
- A stage from the default `dvc.yaml` file: `dvc exp run extract`
- A stage from a specific `dvc.yaml` file:
  `dvc exp run my-project/dvc.yaml:extract`

#### Running a Stage Independently

In some cases you may need to run a single stage in the pipeline, without
running the depending stages. The `--single-item` (`-s`) flag allows to run the
associated command of a single stage.

> Example: If the pipeline has `extract`, `transform`, `train`, `evaluate`
> stages and you only want to run the transform stage to check its outputs, you
> can do so by:

```dvc
$ dvc exp run --single-stage transform
```

#### Running all Pipelines

In larger projects, there may be more than a single `dvc.yaml` file defining
multiple pipelines. In this case, you can run all pipelines with a single
command.

```dvc
$ dvc exp run --all-pipelines
```

Note that the order to run these pipelines is not specified. If you have a
pipeline in `my-dir/dvc.yaml` and `another-dir/dvc.yaml`, either of these
pipelines can be run first.

### Interactive Reproduction

When you want to have more granular control over which stages are run, you can
use `--interactive` flag. This flag allows you to confirm each stage before
running.

```dvc
$ dvc exp run --interactive
Going to reproduce stage: 'train'. Are you sure you want to continue? [y/n]
```

### Improvements over `dvc repro`

The classical way of running the pipeline is using `dvc repro`. DVC introduced
`dvc exp` as an _experiment management_ feature in version 2.0. _Experiment
management_ involves more than executing the pipelines.

In the following sections, we describe the features that make `dvc exp run` more
suitable for machine learning experimentation.

## (Hyper)parameters

<abbr>Hyperparameters</abbr> are the values that modify the structure of an ML
model and various aspects of project. Machine learning experimentation involves
searching hyperparameters that solves the problem at hand in a better way.

Hyperparameter dependencies in the pipelines are set using `--parameter` (`-p`)
option. When a stage is added to the pipeline using `dvc stage add`, the
parameters are also specified along with code and data dependencies.

These parameters are read from text files by the code. DVC keeps track of these
parameter files, and parses them to collect individual parameters. By default,
the name of the parameter file is `params.yaml`. When a parameter is changed in
parameter file, DVC invalidates the stage that depends on it and runs the
experiment with the new hyperparameter value.

For a parameters file named `params.yaml` with the contents:

```yaml
---
model:
  learning_rate: 0.0001
```

You can specify the parameter dependency as:

```dvc
$ dvc stage add -n train \
                 ...
                --parameter model.learning_rate \
                 ...
```

> ⚠️ The parameters specified in the params file are supposed to be read by the
> code and used to modify the models and other attributes of the project. DVC
> does not (and cannot) check whether the parameters are actually used in the
> project. It only tracks their updates in a granular and language-independent
> way.

### Updating parameters in experiments

DVC allows to update the parameters from the command line when you are running
the experiments. The `--set-param` (`-S`) option takes a parameter name and a
value to update the file.

```dvc
$ dvc exp run --set-param model.learning_rate=0.0002
```

The command updates the parameter in `params.yaml` and runs the pipeline that
depend on this parameter value.

It also attaches these parameter values to the experiments, so that you can
review the experiments along with their parameters with `dvc exp show` and
`dvc exp diff`.

### Using a non-default parameter file

When you have a parameter value named _other than_ `params.yaml`, you need to
specify its name in both stage description, and `dvc exp run`.

DVC allows to use multiple parameters in YAML 1.2, JSON, TOML, and Python files.
You can specify the parameter file name in `dvc stage add` command as:

```dvc
$ dvc stage add ... \
                -p myparams.toml:learning_rate \
                ... \
```

While running the experiment, you also need to specify the parameters file name.

```dvc
$ dvc exp run -S myparams.toml:learning_rate = 0.0001
```

DVC updates the specified value in the file and runs the experiment.

### Setting Multiple Parameters for Experiments

You can set more than a single parameter with `--set-param` (`-S`) option in
`dvc exp run`.

It's possible to use multiple `-S` options:

```dvc
$ dvc exp run -S learning_rate=0.001 -S units=128
```

Another way is to supply a comma-delimited list to `-S`:

```dvc
$ dvc exp run -S learning_rate=0.001,units=128
```

### How DVC updates the parameters?

DVC updates the parameters by parsing the parameters file and updating the
specified value. Because of this it restricts the set of formats accepted to
YAML 1.2, TOML, JSON and Python.

When you specify a parameter, you can see its effects using `git diff`.

```dvc
$ dvc exp run -S units=128
...
$ git diff params.yaml
```

```git
-units: 32
+units: 128
```

> ⚠️ Note that DVC doesn't check whether the parameters you specified with
> `--set-param` option is already in the parameters file. If there is a typo in
> the parameter name, it will be added as another parameter.

## The Experiments Queue

The `--queue` flag in `dvc exp run` invocation tells to create an experiment in
the experiment queue. When you add an experiment to the queue nothing is
actually run. Instead, the experiment is put in a wait-list for later execution.
`dvc exp show` will mark queued experiments with an asterisk `*`.

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

Each experiment in the queue is derived from the workspace at the time of
`dvc exp run --queue` command. If you make changes in the workspace after
`dvc exp run --queue` command, they are not reflected in the experiment.

To prevent the side effects, queued experiments are run in temporary directories
under `.dvc/tmp/exps`. Please see [Git and Experiments](#git-and-experiments)
section for details.

Experiments in the queue are run by specifying `--run-all` flag.

```dvc
$ dvc exp run --run-all
...
```

`--run-all` runs all the experiments in the queue one-by-one. The order of
execution is independent of their creation order, and can be considered random
in effect.

To execute the experiments in parallel, please see the next section.

### Running Experiments in Parallel

DVC allows to run the experiments in parallel by specifying the number of
experiment processes:

```dvc
$ dvc exp run --run-all --jobs 4
```

Each experiment is run _serially_ in its own temporary directory. If there are
common stages across these experiments that need to be run, each experiment runs
those separately. For example, for a pipeline composed of the stages
`A -> B -> C`, if `dvc exp run --queue -S param=value1` invalidates stage `A`,
all the pipeline is run in all experiments.

⚠️ Parallel runs are experimental and may be unstable at this time. ⚠️ Make sure
you're using a number of jobs that your environment can handle (no more than the
CPU cores).

### Experiments outside of the Workspace

If you want to isolate the experiments in their own directory, you can do so by
`--temp` flag. This allows to continue your work while running the experiment.

```dvc
$ nohup dvc exp run --temp &
[1] 30473
nohup: ignoring input and appending output to 'nohup.out'
```

The command checks out all DVC-tracked files and Git-tracked files into a
temporary directory under `.dvc/tmp/exps/` and runs the experiment there. It
creates a `nohup.log` file in the project directory. If you want to specify the
output filename, you can use redirection.

```dvc
$ nohup dvc exp run --temp > my-experiment-$(date +"%F-%H-%M-%S").log
```

> ⚠️ Note that only tracked files and directories will be included in
> `--queue/temp` experiments. To include untracked files, stage them with
> `git add` first (before `dvc exp run`). Feel free to `git reset` them
> afterwards. Git-ignored files/dirs are explicitly excluded from runs outside
> the workspace to avoid committing unwanted files into experiments.

### Cleaning Up the Experiment Queue

You can use `dvc exp remove --queue` or `dvc exp gc --queued` to remove the
experiments from the queue. For detailed information see the [section on
Cleaning-Up the Experiments][ug-clean-up].

[ug-clean-up]: /doc/user-guide/experiment-management/cleaning-up-experiments

### How are experiments queued?

The experiments are created similar to
[Git stash](https://www.git-scm.com/docs/git-stash) when queued. The last
experiment is found in `.git/refs/exps`, and the earlier ones are in the reflog.
During `--run-all`, these references are checked out to `.dvc/exps/temp/` and
run there.

## Checkpoints

To track successive steps in a longer or deeper <abbr>experiment</abbr>, you can
register checkpoints from your code. Each `dvc exp run` will resume from the
last checkpoint.

Checkpoints provide a way to train models iteratively, keeping the metrics
associated with each epoch.

### Creating Checkpoints

#### Adding Checkpoints to the Pipeline

There are various ways to add checkpoints to a project. In common, these all
involve marking a stage <abbr>output</abbr> with `checkpoint: true` in
`dvc.yaml`. This is needed so that the experiment can resume later, based on the
<abbr>cached</abbr> output(s).

If you are adding a new stage with `dvc stage add`, you can mark its output(s)
with `--checkpoints` (`-c`) option. DVC will add a `checkpoint: true` to the
stage output in `dvc.yaml`.

Otherwise, if you are adding a checkpoint to an already existing project, you
can edit `dvc.yaml` and add a `checkpoint: true` to the stage output as shown
below:

```yaml
stages:
  ...
  train:
    ...
    outs:
      - model.pt:
          checkpoint: true
  ...
```

#### Adding Checkpoints to Python Code

DVC is agnostic when it comes to modifying your model. Checkpoints are basically
a mechanism to associate outputs of a pipeline with its metrics. Reading the
model from previous iteration and writing a new model as a file are not handled
by DVC. DVC captures the signal produced by the machine learning experimentation
code and stores each successive checkpoint.

> 💡 DVC provides several automated ways to capture checkpoints for various
> popular ML libraries in [DVClive](https://dvc.org/doc/dvclive). It may be more
> productive to use checkpoints via DVClive if you're just starting. Here we
> discuss adding checkpoints to the code manually.

If you are writing the project in Python, the easiest way to signal DVC to
capture the checkpoint is to use `dvc.api.make_checkpoint()` function. It
creates a checkpoint and records all artifacts changed after the previous
checkpoint as another experiment.

The following snippet shows an example that uses a Keras custom callback class.
The callback signals DVC to create a checkpoint at the end of each checkpoint.

```python
class DVCCheckpointsCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):

            dvc.api.make_checkpoint()
...

history = model.fit(
          ...
        callbacks=[DVCCheckpointsCallback(), ...]
        )
```

A similar approach can be taken in PyTorch when using a loop to train a model:

```python
   for epoch in range(1, EPOCHS+1):
      ...
      for x_batch, y_batch in train_loader:
          train(model, x_batch, y_batch)
      torch.save(model.state_dict(), "model.pt")
      # Evaluate and checkpoint.
      evaluate(model, x_test, y_test)
      dvc.api.make_checkpoint()
    ...
```

So, even if you're not using one of these libraries, you can use checkpoints in
your project at each epoch/step by first recording all intermediate artifacts
and metrics, then calling `dvc.api.make_checkpoint()`.

#### Adding Checkpoints to Non-Python Code

If your project is written in another language, you can mimic the behavior of
`make_checkpoint` in your project. In essence `make_checkpoint` creates a
special file named `DVC_CHECKPOINT` inside `.dvc/tmp/` to signal the checkpoint,
and waits DVC to delete it.

```r

dvcroot <- Sys.getenv("DVC_ROOT")

if (dvcroot != "") {
    signalfilepath = file.path(dvcroot, ".dvc", "tmp", "DVC_CHECKPOINT")
    file.create(signalfilepath)
    while (file.exists(signalfilepath)) {
      Sys.sleep(0.01)
    }

}

```

The following Julia snippet creates a signal file to create a checkpoint.

```julia

dvc_root =  get(ENV, "DVC_ROOT", "")

if dvc_root != ""
   signal_file_path = joinpath(dvc_root, ".dvc", "tmp", "DVC_CHECKPOINT")
   open(signal_file_path, "w") do io
           write(io, "")
   end;
   while isfile(signal_file_path)
        sleep()
   end;
```

### Running the Experiments with Checkpoints

Running the experiments with checkpoints is no different than running the
experiments pipeline.

```dvc
$ dvc exp run -S param=value
```

All checkpoints registered at runtime will be preserved, even if the process
gets interrupted (e.g. with `Ctrl+C`, or by an error). Without interruption, a
"wrap-up" checkpoint will be added (if needed), so that changes to pipeline
outputs don't remain in the workspace.

Subsequent uses of `dvc exp run` will continue from the latest checkpoint (using
the latest cached versions of all outputs).

You can list previous checkpoints with `dvc exp show`. To resume from a previous
checkpoint, you must first `dvc exp apply` it before using `dvc exp run`. For
`--queue` or `--temp` runs, use `--rev` to specify the checkpoint to continue
from.

Alternatively, use `--reset` to start over (discards previous checkpoints and
their outputs). This is useful for re-training ML models, for example.

> Note that queuing an experiment that uses checkpoints implies `--reset`,
> unless a `--rev` is provided (refer to the previous section).

<details>

### How are checkpoints captured?

Instead of a single commit, checkpoint experiments have multiple commits under
the custom Git reference (in `.git/refs/exps`), similar to a branch.

</details>

## Git and Experiments

Experiments are custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`) with a single commit based on `HEAD` (not checked
out by DVC). Note that these commits are not pushed to the Git remote by default

## Experiment Names

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
