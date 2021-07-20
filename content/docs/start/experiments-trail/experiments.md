---
title: 'Get Started: Experiments'
---

# Get Started with Experiments

<abbr>Experiments</abbr> proliferate quickly in ML projects where there are many
parameters to tune or other permutations of the code. We can organize such
projects and keep only what we ultimately need with `dvc experiments`. DVC can
track experiments for you so there's no need to commit each one to Git. This way
your repo doesn't become polluted with all of them. You can discard experiments
once they're no longer needed.

Previously, we learned how to tune [ML pipelines](/doc/start/data-pipelines) and
[compare the changes](/doc/start/metrics-parameters-plots). In this section, we
will explore the basic features of DVC experiment management with
[`get-started-experiments`][gse] project.

[gse]: https://github.com/iterative/get-started-experiments

## ⚙️ Installing the Example Project

These commands are run in the [`get-started-experiments`][gse] project. You can
run the commands in this document after cloning the repository and installing
the requirements.

### 👥 Clone the project and create virtual environment

Please clone the project and create a virtual environment.

> We create a virtual environment to keep the libraries we use isolated from the
> rest of your system. This prevents version conflicts.

```dvc
$ git clone https://github.com/iterative/get-started-experiments -b get-started
$ cd get-started-experiments
$ virtualenv .venv
$ . .venv/bin/activate
$ python -m pip install -r requirements.txt
```

### 📀 Get the data set

The repository we cloned doesn't contain the dataset. In order to get the
dataset we use `dvc pull` to update the missing data files. `dvc pull` is used
in DVC repositories to update the missing data dependencies.

```dvc
$ dvc pull
```

Then we extract this file that contains labeled images.

```dvc
$ tar -xvzf data/images.tar.gz --directory data/
```

The repository already contains the necessary configuration to run the
experiments. If you would like to learn how to configure a project to run DVC
experiments, please refer to the last section.

<details>

## ⏲ Preparing a project for DVC experiments

In this document we assume that there is already a configured DVC project to
simplify the introduction. DVC experiments are a feature added in DVC 2.0 and
requires a DVC pipeline defined in the project.

Please refer to [install](/doc/install) if DVC is not installed in your system.

If DVC is not initialized before in the project, you can do so by:

```dvc
$ dvc init
```

DVC also requires commands to be run and their dependencies to be defined as
stages. We use `dvc stage add` to add a stage and set its dependencies.

```dvc
$ dvc stage add -n train \
                -p model.conv_units \
                -p train.epochs \
                -d data/images \
                -m metrics.json \
                python3 src/train.py
```

The command tells DVC to create an experiment named `train`, and that for any
change in `data/images/`, `model.conv_units` or `train.epochs`, we run an
experiment using `src/train.py` that produces a new `metrics.json` file.

Note that the parameters (added with `-p`) are in the default parameters file
`params.yaml` and used in the code as normal, by reading the file. DVC only
tracks the changes and updates them with `--set-param`. For other files that
contain the parameters, DVC expects the filename to be provided similar to
`-p myparams.yaml:epochs`.

DVC is ready to run the experiments now!

</details>

## 👟 Running the experiment with default parameters

The purpose of `dvc exp` subcommands is to run the pipeline for ephemeral
experiments. By _ephemeral_ we mean the experiments can be run without
committing parameter and dependency changes to Git. Instead the artifacts
produced for each experiment are tracked by DVC and persisted on demand.

Running the experiment with default project settings requires only the command:

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-b28f0
Experiment results have been applied to your workspace.
...
```

It runs the specified command that writes the metrics values to `metrics.json`.

<details>

### 📜 If you used `dvc repro` before

Earlier versions of DVC uses `dvc repro` to run the pipeline. If you already
have a DVC project, you may already be using `dvc repro`.

In DVC 2.0 `dvc exp run` supersedes `dvc repro`. Both of these commands run the
pipeline.

We use `dvc repro` to run the pipeline as found in the <abbr>workspace</abbr>.
All the parameters and dependencies are retrieved from the current workspace. It
doesn't use any special objects to track the experiments. When you have large
number of experiments that you don't want to commit all to Git, it's better to
use `dvc exp run`. It allows to change the parameters quickly, can track the
history of artifacts and has facilities to compare these experiments easily.

`dvc repro` is still available to run the pipeline when these extra features are
not needed.

</details>

## 🧥 Running the experiment by setting parameters

Now let's do some more experimentation.

DVC allows to update the parameters defined in the pipeline without modifying
the files manually. We use this feature to set the convolutional units in
`train.py`.

```dvc
$ dvc exp run --set-param model.conv_units=24
...
Reproduced experiment(s): exp-7b56f
Experiment results have been applied to your workspace.
...
```

When you run `dvc exp run` with `--set-param`, it updates the parameter file. We
can see the effect of it by looking at the diff.

```dvc
$ git diff params.yaml
```

```git
-model:
-  conv_units: 16
+model:
+  conv_units: 24
```

## 🏃‍♂️🏃🏾‍♂️🏃🏻‍♂️ Run multiple experiments in parallel

Instead of running the experiments one-by-one, we can define them to run in a
batch. This is especially handy when you have long running experiments.

We add experiments to the queue using the `--queue` option of `dvc exp run`. We
also use `-S` (`--set-param`) to set a value for the parameter.

```dvc
$ dvc exp run --queue -S model.conv_units=32
Queued experiment '3cac8c6' for future execution.
$ dvc exp run --queue -S model.conv_units=64
Queued experiment '23660b6' for future execution.
$ dvc exp run --queue -S model.conv_units=128
Queued experiment '6591a57' for future execution.
$ dvc exp run --queue -S model.conv_units=256
Queued experiment '9109ea9' for future execution.
```

Next, run all (`--run-all`) queued experiments in parallel. You can specify the
number of parallel processes using `--jobs`:

```dvc
$ dvc exp run --run-all --jobs 2
```

## ↔️ Comparing experiments

The experiments are run several times with different parameters. We use
`dvc exp show` to compare all of these experiments. This command presents the
parameters and metrics produced in experiments in a nicely formatted table.

```dvc
$ dvc exp show
```

![](/img/start-dvc-exp-show-210704.png)

By default it shows all the parameters and the metrics with the timestamp. If
you have large number of parameters, metrics or experiments, this may lead to a
cluttered view. You can limit the table to specific metrics, or parameters, or
hide the timestamp column with `--include-metrics`, `--include-params`, or
`--no-timestamp` options of the command, respectively.

```dvc
$ dvc exp show --no-timestamp \
  --include-params model.conv_units --include-metrics acc
```

![](/img/start-dvc-exp-show-no-timestamp-210704.png)

## 🔏 Persisting experiments

After selecting an experiment from the table, you can commit the hyperparameters
and other dependencies that produced this successful experiment to your Git
history.

`dvc exp apply` brings back all specific artifacts and parameters from the
experiment to the <abbr>workspace</abbr>.

```dvc
$ dvc exp apply exp-cb13f
Changes for experiment 'exp-cb13f' have been applied to your current workspace.
```

We can see the changes in the repository and commit them to Git.

```dvc
$ git diff
$ git add .
$ git commit -m "Successful experiment"
```

It may also be desirable to commit a particular experiment to a Git branch
directly, without bringing to the workspace.

```dvc
$ dvc exp branch exp-05e87 "cnn-256"
Git branch 'cnn-256' has been created from experiment 'exp-05e87'.
To switch to the new branch run:

        git checkout cnn-256
```

You can then checkout and continue from working this branch as usual.

## 📛 Note on experiment names

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

## 🪐 Go Further

There are many other features of `dvc exp`, like cleaning up the unused
experiments, sharing them without committing into Git or getting differences
between two experiments.

Please see the section on
[Experiment Management](/doc/user-guide/experiment-management) in the User's
Guide or `dvc exp` and subcommands in the Command Reference.
