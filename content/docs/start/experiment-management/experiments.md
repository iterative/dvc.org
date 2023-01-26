---
title: 'Get Started: Experiments'
description: 'Get started with DVC experiments. Learn how to capture multiple
project versions automatically without bloating your Git repo. Iterate quickly by
comparing experiments easily and finding the best performers.'
---

# Get Started: Experiments

<details>

### 🎬 Click to watch a video intro.

<admon type="warn">

This video is outdated and will be updated soon! Our written docs contain the
latest information about all of DVC's features.

</admon>

https://youtu.be/FHQq_zZz5ms

</details>

In machine learning projects, the number of <abbr>experiments</abbr> grows
rapidly. DVC can track these experiments, list and compare their most relevant
metrics, parameters, and dependencies, navigate among them and commit only the
ones that we need to Git.

<admon type="tip">

**New!** You can track and compare your ML experiments with DVC directly [from
Visual Studio Code], a leading IDE in the industry.

[from visual studio code]: /doc/vs-code-extension

</admon>

In this section, we explore the basic features of DVC experiment management with
the [`example-dvc-experiments`][ede] project.

[ede]: https://github.com/iterative/example-dvc-experiments

<details>

### ⚙️ Initializing a project with DVC experiments

If you already have a DVC project, that's great. You can start to use `dvc exp`
commands right away to run or save experiments in your project. (See the [User
Guide] for detailed information.) Here, we briefly discuss how to structure an
ML project with DVC experiments using `dvc exp init`.

[user guide]: /doc/user-guide/experiment-management/experiments-overview

A typical machine learning project has data, a set of scripts that train a
model, a bunch of hyperparameters that tune training and models, and outputs
metrics and plots to evaluate the models. `dvc exp init` has sane defaults about
the names of these elements to initialize a project:

```cli
$ dvc exp init --live dvclive --plots plots python src/train.py
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

```cli
$ dvc exp run
...
Reproduced experiment(s): angry-upas
Experiment results have been applied to your workspace.
...
```

This runs the command specified in `dvc.yaml` (`python train.py`), and creates
models, plots, and metrics in the respective directories. The experiment is then
associated with the values found in the parameters file (`params.yaml`) and
other dependencies, as well as the metrics produced.

<admon type="tip">

Current workspace status can also be saved as an experiment using
[`dvc exp save`](/doc/command-reference/exp/save).

</admon>

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

```cli
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                  neutral:**Created**           metric:**loss**      metric:**acc**   param:**train.epochs**    param:**model.conv_units**    dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                  -               0.03247   0.9887   10             16                 6875529
  baseline-experiment        Jan 14, 2022    0.03332   0.9888   10             16                 6875529
  └── 999710f [angry-upas]   10:54 PM        0.03247   0.9887   10             16                 6875529
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
```

The `workspace` row in the table shows the results of the most recent experiment
that's available in the <abbr>workspace</abbr>. The table also shows each
experiment in a separate row, along with the Git commit IDs they are attached
to. We can see that the experiment we ran has a name `angry-upas` and was run
from the commit ID `999710f`.

Now let's do some more experimentation.

Option `dvc exp run --set-param` allows to update experimental parameters
without modifying the files manually. We use this feature to set the
convolutional units in `train.py`.

```cli
$ dvc exp run --set-param model.conv_units=24
...
Reproduced experiment(s): lurid-lair
Experiment results have been applied to your workspace.
...
```

<details>

### ⚙️ Run multiple experiments in parallel

Instead of running the experiments one-by-one, we can define them to run in a
batch. This is especially handy when you have long running experiments.

We add experiments to the queue using the `--queue` option of `dvc exp run`. We
also use `-S` (`--set-param`) to set a value for the parameter.

```cli
$ dvc exp run --queue -S model.conv_units=32
Queued experiment 'conic-ease' for future execution.
$ dvc exp run --queue -S model.conv_units=64
Queued experiment 'major-mela' for future execution.
$ dvc exp run --queue -S model.conv_units=128
Queued experiment 'frank-farm' for future execution.
$ dvc exp run --queue -S model.conv_units=256
Queued experiment 'paced-rugs' for future execution.
```

Next, run all (`--run-all`) queued experiments in parallel. You can specify the
number of parallel processes using `--jobs`:

```cli
$ dvc exp run --run-all --jobs 2
```

</details>

## Comparing and persisting experiments

The experiments are run several times with different parameters. We use
`dvc exp show` to compare all of these experiments.

```cli
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                 neutral:**Created**            metric:**loss**      metric:**acc**   param:**train.epochs**    param:**model.conv_units**    dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                  -              0.031865   0.9897   10             24                 6875529
  baseline-experiment        Jan 14, 2022    0.03332   0.9888   10             16                 6875529
  ├── 43a3b4f [paced-rugs]   Jan 27, 2022   0.042424   0.9874   10             256                6875529
  ├── 6d15fac [frank-farm]   Jan 27, 2022   0.037164    0.989   10             128                6875529
  ├── 47896c1 [major-mela]   Jan 27, 2022    0.03845   0.9876   10             64                 6875529
  └── da84ac7 [conic-ease]   Jan 27, 2022   0.035497    0.988   10             32
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
```

By default, the output includes all the metrics, parameters and dependencies
with the timestamp. If you have a large number of metrics, parameters,
dependencies or experiments, this may lead to a cluttered view. You can limit
the table to specific columns using the
[`--drop`](/doc/command-reference/exp/show#--drop) option of the command.

```cli
$ dvc exp show --drop 'Created|train|loss'
```

```dvctable
 ───────────────────────────────────────────────────────────────
  neutral:**Experiment**                    metric:**acc**   param:**model.conv_units**    dep:**data**
 ───────────────────────────────────────────────────────────────
  workspace                  0.9897   24                 6875529
  baseline-experiment        0.9888   16                 6875529
  ├── 43a3b4f [paced-rugs]   0.9874   256                6875529
  ├── 6d15fac [frank-farm]   0.989    128                6875529
  ├── 47896c1 [major-mela]   0.9876   64                 6875529
  └── da84ac7 [conic-ease]   0.988    32                 6875529
 ───────────────────────────────────────────────────────────────
```

<details>

### ℹ️ More information about metrics

Metrics are what you use to evaluate your models. DVC associates metrics with
experiments for later comparison. Any scalar value can be used as a metric. You
can specify text files to contain metrics using `dvc exp init --metrics`, and
write them in the experimentation code.

An alternative to manual metrics generation is to use [DVCLive](/doc/dvclive) to
generate these files.

`dvc exp show` and `dvc metrics` are used to tabulate the experiments and Git
commits with their associated metrics. In the above tables, `loss` and `acc`
values are metrics found in [`dvclive/metrics.json`] file.

Metrics files are interpreted specially also in
[Iterative Studio](https://studio.iterative.ai).

[`metrics.json`]:
  https://github.com/iterative/example-dvc-experiments/blob/main/dvclive/metrics.json

</details>

After selecting an experiment from the table, you can create a Git branch that
contains the experiment with all its related files.

```cli
$ dvc exp branch paced-rugs "cnn-256"
Git branch 'cnn-256' has been created from experiment 'paced-rugs'.
To switch to the new branch run:

        git checkout cnn-256
```

You can then checkout and continue working from this branch, or merge the branch
into your `main` branch with the usual Git commands.

## Go Further

There are many other features of `dvc exp`, like cleaning up unused experiments,
saving the current workspace status as an experiment, sharing them without
committing into Git, or getting differences between two experiments.

For more information, see the section on
[Experiment Management](/doc/user-guide/experiment-management) in the User's
Guide or `dvc exp` and subcommands in the Command Reference.
