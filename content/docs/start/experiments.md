---
title: 'Get Started: Experiments'
---

# Get Started with Experiments

In machine learning projects, the number of <abbr>experiments</abbr> grows
rapidly. DVC can track these experiments, list and compare their most relevant
metrics, parameters, and dependencies, navigate among them, and commit only the
ones that we need to Git.

> ⚠️ This video is outdated and will be updated soon! Where there are
> discrepancies between docs and video, please follow the docs.

https://youtu.be/FHQq_zZz5ms

In this section, we explore the basic features of DVC experiment management with
the [`example-dvc-experiments`][ede] project.

[ede]: https://github.com/iterative/example-dvc-experiments

<details>

## ⚙️ Initializing a project with DVC experiments

If you already have a DVC project, that's great. You can start to use `dvc exp`
commands right away to run experiments in your project. (See the [User Guide]
for detailed information.) Here, we briefly discuss how to structure an ML
project with DVC experiments using `dvc exp init`.

[user guide]: /doc/user-guide/experiment-management/experiments-overview

A typical machine learning project has data, a set of scripts that train a
model, a bunch of hyperparameters that tune training and models, and outputs
metrics and plots to evaluate the models. `dvc exp init` has sane defaults about
the names of these elements to initialize a project:

```dvc
$ dvc exp init python src/train.py
```

Here, `python src/train.py` specifies how you run experiments. It could be any
other command.

If your project uses different names for them, you can set directories for
source code (default: `src/`), data (`data/`), models (`models/`), plots
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

This runs the command specified in `dvc.yaml` (`python train.py`), and creates
models, plots, and metrics in the respective directories. The experiment is then
associated with the values found in the parameters file (`params.yaml`) and
other dependencies, as well as the metrics produced.

<details>

### ℹ️ More information about (Hyper)parameters

It's pretty common for data science projects to include configuration files that
define adjustable parameters to train a model, adjust model architecture, do
pre-processing, etc. DVC provides a mechanism for experiments to depend on the
specific variables from a file.

By default, DVC assumes that a parameters file named `params.yaml` is available
in your project. DVC parses this file and creates dependencies to the variables
found in it: `model.conv_units` and `train.epochs`. Example:

```yaml
train:
  epochs: 10
model:
  conv_units: 16
```

</details>

You can review the experiment results with `dvc exp show` and see these metrics
and results in a nicely formatted table:

```dvc
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**           metric:**loss**      metric:**acc**   param:**train.epochs**    param:**model.conv_units**    dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -              0.03247   0.9887   10             16                 6875529
  baseline-experiment       Jan 14, 2022   0.03332   0.9888   10             16                 6875529
  └── 999710f [exp-ff24d]   10:54 PM       0.03247   0.9887   10             16                 6875529
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
```

The `workspace` row in the table shows the results of the most recent experiment
that's available in the <abbr>workspace</abbr>. The table also shows each
experiment in a separate row, along with the Git commit IDs they are attached
to. We can see that the experiment we run has a name `exp-6dccf` and was run
from the commit ID `7317bc6`.

Now let's do some more experimentation.

Option `dvc exp run --set-param` allows to update experimental parameters
without modifying the files manually. We use this feature to set the
convolutional units in `train.py`.

```dvc
$ dvc exp run --set-param model.conv_units=24
...
Reproduced experiment(s): exp-7b56f
Experiment results have been applied to your workspace.
...
```

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
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**            metric:**loss**      metric:**acc**   param:**train.epochs**    param:**model.conv_units**    dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -              0.031865   0.9897   10             24                 6875529
  baseline-experiment       Jan 14, 2022    0.03332   0.9888   10             16                 6875529
  ├── 43a3b4f [exp-7f82e]   Jan 27, 2022   0.042424   0.9874   10             256                6875529
  ├── 6d15fac [exp-75369]   Jan 27, 2022   0.037164    0.989   10             128                6875529
  ├── 47896c1 [exp-76693]   Jan 27, 2022    0.03845   0.9876   10             64                 6875529
  ├── da84ac7 [exp-4a081]   Jan 27, 2022   0.035497    0.988   10             32                 6875529
  ├── 5846c68 [exp-953fa]   Jan 27, 2022   0.031865   0.9897   10             24                 6875529
  └── 999710f [exp-ff24d]   Jan 27, 2022    0.03247   0.9887   10             16                 6875529
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
```

By default, it shows all the metrics, parameters and dependencies with the
timestamp. If you have a large number of metrics, parameters, dependencies or
experiments, this may lead to a cluttered view. You can limit the table to
specific columns using the [`--drop`](/doc/command-reference/exp/show#--drop)
option of the command.

```dvc
$ dvc exp show --drop 'Created|train|loss'
```

```dvctable
 ───────────────────────────────────────────────────────────────
  neutral:**Experiment**                   metric:**acc**   param:**model.conv_units**    dep:**data**
 ───────────────────────────────────────────────────────────────
  workspace                 0.9897   24                 6875529
  baseline-experiment       0.9888   16                 6875529
  ├── 43a3b4f [exp-7f82e]   0.9874   256                6875529
  ├── 6d15fac [exp-75369]    0.989   128                6875529
  ├── 47896c1 [exp-76693]   0.9876   64                 6875529
  ├── da84ac7 [exp-4a081]    0.988   32                 6875529
  ├── 5846c68 [exp-953fa]   0.9897   24                 6875529
  └── 999710f [exp-ff24d]   0.9887   16                 6875529
 ───────────────────────────────────────────────────────────────
```

<details>

### ℹ️ More information about metrics

Metrics are what you use to evaluate your models. DVC associates metrics to
experiments for later comparison. Any scalar value can be used as a metric. You
can specify text files to contain metrics using `dvc exp init --metrics`, and
write them in the experimentation code.

An alternative to manual metrics generation is to use [DVCLive](/doc/dvclive) to
generate these files. Please refer to the documentation for details.

`dvc exp show` and `dvc metrics` are used to tabulate the experiments and Git
commits with their associated metrics. In the above tables, `loss` and `acc`
values are metrics found in [`metrics.json`] file.

Metrics files are interpreted specially also in
[Iterative Studio](https://studio.iterative.ai).

[`metrics.json`]:
  https://github.com/iterative/example-dvc-experiments/blob/main/metrics.json

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
