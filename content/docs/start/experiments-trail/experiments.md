---
title: 'Get Started: Experiments'
---

# Get Started with Experiments

In machine learning projects, number of <abbr>experiments</abbr> grow rapidly.
DVC can track these experiments, list their most relevant parameters and
metrics, and commit only the ones that we need to Git.

In this section, we explore the basic features of DVC experiment management with
[`get-started-experiments`][gse] project.

[gse]: https://github.com/iterative/get-started-experiments

<details>

## ⚙️ Installing the Example Project

These commands are run in the [`get-started-experiments`][gse] project. You can
run the commands in this document after cloning the repository and installing
the requirements.

### ⚡ Clone the project and create virtual environment

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

### ✅ Get the data set

The repository we cloned doesn't contain the dataset. We use `dvc pull` to
update the missing data files.

```dvc
$ dvc pull
```

The repository already contains the necessary configuration to run the
experiments.

## 💡 Preparing a project for DVC experiments

If DVC is not installed to the system, please refer to [install](/doc/install).

In this getting started page, we assume that there is already a configured DVC
project to simplify the introduction. DVC experiments require a DVC pipeline
defined in the project.

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

The command tells DVC to create an experiment named `train`, and for any change
in `data/images/` directory, `model.conv_units` or `train.epochs` parameters, we
(re)run an experiment using `src/train.py` that produces a new `metrics.json`
file.

You can learn more about [pipelines], and [parameters] in other sections of the
documentation.

[pipelines]: /doc/start/data-pipelines
[parameters]: /doc/start/metrics-parameters-plots

</details>

## 👟 Running the experiment with default parameters

The purpose of `dvc exp` subcommands is to run the experiments without
committing parameter and dependency changes to Git. The artifacts like models,
metrics produced by each experiment are tracked by DVC and persisted on demand.

Running the experiment with the default project settings requires only the
command:

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-b28f0
Experiment results have been applied to your workspace.
...
```

It runs the specified command (`python train.py`) in `dvc.yaml`. That command
writes the metrics values to `metrics.json`.

This experiment is then associated with the values found in parameters file
(`params.yaml`), and other dependencies (`data/images/`) with these produced
metrics.

<details>

### 📖 If you used `dvc repro` before

Earlier versions of DVC uses `dvc repro` to run the pipeline. If you already
have a DVC project, you may already be using `dvc repro`.

In DVC 2.0 `dvc exp run` supersedes `dvc repro`. We use `dvc repro` to run the
pipeline as found in the <abbr>workspace</abbr>. All the parameters and
dependencies are retrieved from the current workspace. It doesn't use any
special objects to track the experiments or associate parameters with metrics.
When you have large number of experiments that you don't want to commit all to
Git, it's better to use `dvc exp run`. It allows to change the parameters
quickly, can track the history of artifacts and has facilities to compare these
experiments easily.

`dvc repro` is still available to run the pipeline when these extra features are
not needed.

</details>

## ⏲ Running the experiment by setting parameters

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

<details>

## 👟👟 Run multiple experiments in parallel

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

</details>

## ↔️ Comparing experiments

The experiments are run several times with different parameters. We use
`dvc exp show` to compare all of these experiments. This command presents the
parameters and metrics produced in experiments in a nicely formatted table.

```dvc
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**    ┃ white:**Created**┃    yellow:**loss** ┃    yellow:**acc** ┃ blue:**train.epochs** ┃ blue:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.23508 │ 0.9151 │ 10           │ 24               │
│ 7317bc6                 │ Jul 18, 2021 │       - │      - │ 10           │ 16               │
│ ├── e2647ef [exp-ee8a4] │ 05:14 PM     │ 0.23146 │ 0.9145 │ 10           │ 64               │
│ ├── 15c9451 [exp-a9be6] │ 05:14 PM     │ 0.25231 │ 0.9102 │ 10           │ 32               │
│ ├── 9c32227 [exp-17dd9] │ 04:46 PM     │ 0.23687 │ 0.9167 │ 10           │ 256              │
│ ├── 8a9cb15 [exp-29d93] │ 04:46 PM     │ 0.24459 │ 0.9134 │ 10           │ 128              │
│ ├── dfc536f [exp-a1bd9] │ 03:35 PM     │ 0.23508 │ 0.9151 │ 10           │ 24               │
│ └── 1a1d858 [exp-6dccf] │ 03:21 PM     │ 0.23282 │ 0.9152 │ 10           │ 16               │
└─────────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘
```

By default it shows all the parameters and the metrics with the timestamp. If
you have large number of parameters, metrics or experiments, this may lead to a
cluttered view. You can limit the table to specific metrics, or parameters, or
hide the timestamp column with `--include-metrics`, `--include-params`, or
`--no-timestamp` options of the command, respectively.

```dvc
$ dvc exp show --no-timestamp \
  --include-params model.conv_units --include-metrics acc
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃    yellow:**acc** ┃ blue:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.9151 │ 24               │
│ 7317bc6                 │      - │ 16               │
│ ├── e2647ef [exp-ee8a4] │ 0.9145 │ 64               │
│ ├── 15c9451 [exp-a9be6] │ 0.9102 │ 32               │
│ ├── 9c32227 [exp-17dd9] │ 0.9167 │ 256              │
│ ├── 8a9cb15 [exp-29d93] │ 0.9134 │ 128              │
│ ├── dfc536f [exp-a1bd9] │ 0.9151 │ 24               │
│ └── 1a1d858 [exp-6dccf] │ 0.9152 │ 16               │
└─────────────────────────┴────────┴──────────────────┘
```

## 🔏 Persisting experiments

After selecting an experiment from the table, you can create a Git branch that
contains the experiment with all its related files.

```dvc
$ dvc exp branch exp-05e87 "cnn-256"
Git branch 'cnn-256' has been created from experiment 'exp-05e87'.
To switch to the new branch run:

        git checkout cnn-256
```

You can then checkout and continue from working this branch as usual.

## ⭐ Go Further

There are many other features of `dvc exp`, like cleaning up the unused
experiments, sharing them without committing into Git or getting differences
between two experiments.

Please see the section on
[Experiment Management](/doc/user-guide/experiment-management) in the User's
Guide or `dvc exp` and subcommands in the Command Reference.
