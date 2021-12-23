---
title: 'Get Started: Experiments'
---

# Get Started with Experiments

In machine learning projects, the number of <abbr>experiments</abbr> grows
rapidly. DVC can version these experiments, list and compare their most relevant
parameters and metrics, navigate among them, and commit the ones that we need to
Git with their lineage.

> ⚠️This video is out-of-date and will be updated soon! Where there are
> discrepancies between docs and video, please follow the docs.

https://youtu.be/FHQq_zZz5ms

In this section, we explore the basic features of DVC experiment management with
the [`example-dvc-experiments`][ede] project. Please refer to the [README] file
to install the project if you want to try these commands yourself. You may also
find easier to try these in our [Katacoda] environment.

[ede]: https://github.com/iterative/example-dvc-experiments

<details>

### ⚙️ Initializing a project into DVC experiments

If you already have a DVC project, that's great. You can start to use `dvc exp`
commands right away to run experiments in your project. (See the [user's guide]
for detailed information.) Here, we briefly discuss how to structure an ML
project into a DVC experiments project with `dvc exp init`.

[user's guide]: /doc/user-guide/experiment-management/

A typical machine learning project has data, a set of scripts that trains a
model, a bunch of hyperparameters that modify these models, and outputs metrics
and plots to evaluate the models. DVC makes certain assumptions about the names
of these elements to initialize a project with:

```dvc
$ dvc exp init python src/train.py
```

Here, `python src/train.py` describes how you run experiments. It could be any
other command.

If your project uses different names for them, you can set directories for
source code (default: `src`), data (`data/`), models (`models/`), plots
(`plots/`), and files for hyperparameters (`params.yaml`), metrics
(`metrics.json`) with the options supplied to `dvc exp init`.

You can also set these options in a dialog format with
`dvc exp init --interactive`.

</details>

Running the experiment with the default project settings requires only the
command:

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-b28f0
Experiment results have been applied to your workspace.
...
```

It runs the command we specified (`python train.py`), and creates models, plots
and metrics in respective directories.

This experiment is then associated with the values found in the parameters file
(`params.yaml`), and other dependencies (`data/images/`) with these produced
metrics.

You can review the experiment results with `dvc exp show` and see these metrics
and results in a nicely formatted table:

```dvc
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃ white:**Created**      ┃ yellow:**loss**    ┃ yellow:**acc**    ┃ blue:**train.epochs** ┃ blue:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.23282 │ 0.9152 │ 10           │ 16               │
│ 7317bc6                 │ Jul 18, 2021 │       - │      - │ 10           │ 16               │
│ └── 1a1d858 [exp-6dccf] │ 03:21 PM     │ 0.23282 │ 0.9152 │ 10           │ 16               │
└─────────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘
```

The `workspace` row in the table shows the results of the most recent experiment
that's available in the <abbr>workspace</abbr>. The table also shows each
experiment in a separate row, along with the Git commit IDs they are attached
to. We can see that the experiment we run has a name `exp-6dccf` and was run
from the commit ID `7317bc6`.

Now let's do some more experimentation.

DVC allows to update the parameters defined in the project without modifying the
files manually. We use this feature to set the convolutional units in
`train.py`.

```dvc
$ dvc exp run --set-param model.conv_units=24
...
Reproduced experiment(s): exp-7b56f
Experiment results have been applied to your workspace.
...
```

<details>

### ℹ️ More information about (Hyper)parameters

It's pretty common for data science projects to include configuration files that
define adjustable parameters to train a model, do pre-processing, etc. DVC
provides a mechanism for stages to depend on the variables of from such a file
(YAML, JSON, TOML, and Python formats are supported).

Recall that when we initialize an experiment using `dvc exp init` DVC assumes
there is a parameters file named `params.yaml` in your project. DVC parses this
file and creates dependencies to the variables (`model.conv_units` and
`train.epochs`) found in the file.

Here is the contents of `params.yaml` file:

```yaml
train:
  epochs: 10
model:
  conv_units: 16
```

When you use `--set-param`option for `dvc exp run`, DVC updates these values
with the values you set in the command line before running the experiment.

</details>

<details>

### ⚙️ Run multiple experiments in parallel

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

## Comparing and persisting experiments

The experiments are run several times with different parameters. We use
`dvc exp show` to compare all of these experiments.

```dvc
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃ white:**Created**      ┃ yellow:**loss**    ┃ yellow:**acc**    ┃ blue:**train.epochs** ┃ blue:**model.conv_units** ┃
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

By default, it shows all the parameters and the metrics with the timestamp. If
you have a large number of parameters, metrics or experiments, this may lead to
a cluttered view. You can show specific columns with `--keep`, hide with
`--drop`, show only those columns with changed values across the runs with
`--only-changed`, or hide the timestamp column with `--no-timestamp` options.

<details>

### ℹ️ More information about metrics

Metrics are what you use to evaluate your models. DVC allows any scalar values
to be used as metrics. It's able to track the metrics we defined in the code
with the Keras integration introduced recently. You can also specify a custom
metrics file using `--metrics` option of `dvc exp init`, and write the metrics
in the code manually. Please see `dvc metrics` for this kind of explicitly
defined metrics.

</details>

```dvc
$ dvc exp show --no-timestamp --keep 'conv_units|acc'
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

<details>

### ℹ️ More information about metrics

Metrics are what you use to evaluate your models. DVC allows any scalar values
to be used as metrics. It's able to track the metrics we defined in the code
with the Keras integration introduced recently. You can also specify a custom
metrics file using `--metrics` option of `dvc exp init`, and write the metrics
in the code manually. Please see `dvc metrics` for this kind of explicitly
defined metrics.

</details>

After selecting an experiment from the table, you can create a Git branch that
contains the experiment with all its related files.

```dvc
$ dvc exp branch exp-17dd9 "cnn-256"
Git branch 'cnn-256' has been created from experiment 'exp-17dd9'.
To switch to the new branch run:

        git checkout cnn-256
```

You can then checkout and continue working from this branch, or merge the branch
into your `main` branch with the usual Git commands.

## Go Further

There are many other features of `dvc exp`, like cleaning up the unused
experiments, sharing them without committing into Git or getting differences
between two experiments.

Please see the section on
[Experiment Management](/doc/user-guide/experiment-management) in the User's
Guide or `dvc exp` and subcommands in the Command Reference.
