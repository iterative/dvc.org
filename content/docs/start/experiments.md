---
title: 'Get Started: Experiments'
---

# Get Started: Experiments

⚠️ This feature is only available in DVC 2.0 ⚠️

<abbr>Experiments</abbr> proliferate quickly in ML projects where there are many
parameters to tune or other permutations of the code. We can organize such
projects and only keep what we ultimately need with `dvc experiments`. DVC can
track experiments for you so there's no need to commit each one to Git. This way
your repo doesn't become polluted with all of them. You can discard experiments
once they're no longer needed.

> 📖 See [Experiment Management](/doc/user-guide/experiment-management) for more
> information on DVC's approach.

## Running experiments

In the previous page, we learned how to tune
[ML pipelines](/doc/start/data-pipelines) and compare the changes. In this
section we'll use a [new Get Started project][dvcgs] to illustrate
experimentation features in DVC 2.0

`dvc exp run` makes it easy to change <abbr>hyperparameters</abbr> and run a new
experiment. We'll use it to find parameters that results in better
classification performance for [Fashion-MNIST][fmnist] dataset.

[fmnist]: https://github.com/zalandoresearch/fashion-mnist

> You can run these commands in the container we built for this tutorial. It has
> all the code and data required to run these examples.
> `docker run -it dvcorg/doc-start:experiments`

In order to run a baseline experiment with the default parameters defined in
`params.yaml`:

```dvc
dvc exp run
```

This resembles `dvc repro` without any command-line arguments. However, when
using `dvc repro` we need to update `params.yaml` manually, run the pipeline, if
the results are worth it commit them to DVC and Git. `dvc exp` automates this
process through its subcommands.

Let's see some metrics produced by this baseline experiment:

```dvc
$ dvc exp show --include-metrics categorical_accuracy,precision,recall \
               --include-params  model.name,model.cnn.conv_units
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃ categorical_accuracy ┃ precision ┃ recall ┃ model.name ┃ model.cnn.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.8498               │ 0.88219   │ 0.8147 │ cnn        │ 16                   │
│ experiments             │ Apr 26, 2021 │ -                    │ -         │ -      │ cnn        │ 16                   │
│ └── 7a738cc [exp-c621e] │ 05:34 PM     │ 0.8498               │ 0.88219   │ 0.8147 │ cnn        │ 16                   │
└─────────────────────────┴──────────────┴──────────────────────┴───────────┴────────┴────────────┴──────────────────────┘
```

Note that the experiment results are identical with the values checked-out from
Git. By default each experiment is given a name automatically. We can set the
name by the `--name/-n` argument.

Let's change the number of units in CNN and make another experiment:

```dvc
$ dvc exp run -n cnn-32 --set-param model.cnn.conv_units=32
'data/fashion-mnist/raw.dvc' didn't change, skipping
Stage 'prepare' didn't change, skipping
Stage 'preprocess' didn't change, skipping
Running stage 'train':
> python3 src/train.py
...
```

`--set-param/-S` argument of `dvc exp run` is used to set parameters in
`params.yaml`. DVC runs _only_ the stages that depend on these parameter values.
Parameter dependencies are defined via `dvc stage add` command and stored in
`dvc.yaml`.

<details>

### 💡 Expand to see what this command does.

The `--set-param` (or `-S`) flag sets the values for
[parameters](/doc/command-reference/params) as a shortcut to editing
`params.yaml`.

Check that the `model.cnn.units` value has been updated in `params.yaml`:

```git
 model:
   cnn:
-    conv_units: 16
+    conv_units: 32
```

Any edits to <abbr>dependencies</abbr> (parameters or source code) will be
reflected in the experiment run.

</details>

`dvc exp diff` compares experiments:

```dvc
$ dvc exp diff
Path          Metric                Value    Change
metrics.json  PR                    0.92535  0.0048383
metrics.json  ROC                   0.98807  0.0014254
metrics.json  categorical_accuracy  0.8693   0.0041
metrics.json  false_negatives       1532     -98
metrics.json  false_positives       990      -12
metrics.json  loss                  0.36403  -0.01709
metrics.json  precision             0.89533  0.002241
metrics.json  recall                0.8468   0.0098
metrics.json  true_negatives        89010    12
metrics.json  true_positives        8468     98

Path         Param                 Value    Change
params.yaml  model.cnn.conv_units  32       16
```

## Queueing experiments

Instead of running the experiments one-by-one, we can define them without
executing. This is especially handy when you have long running experiments to
try.

We add experiments to the queue using `--queue` option of `dvc exp run`. Here,
we also set the names of experiments to observe the results clearly:

```dvc
$ dvc exp run --queue -n cnn-16-drop-0.1 -S model.cnn.conv_units=16 -S model.cnn.dropout=0.1
Queued experiment 'c5fe01f' for future execution.
$ dvc exp run --queue -n cnn-16-drop-0.5 -S model.cnn.conv_units=16 -S model.cnn.dropout=0.5
Queued experiment 'e51a8a9' for future execution.
$ dvc exp run --queue -n cnn-16-drop-0.9 -S model.cnn.conv_units=16 -S model.cnn.dropout=0.9
Queued experiment 'b266b70' for future execution.
$ dvc exp run --queue -n cnn-32-drop-0.1 -S model.cnn.conv_units=32 -S model.cnn.dropout=0.1
Queued experiment 'ca07a75' for future execution.
$ dvc exp run --queue -n cnn-32-drop-0.5 -S model.cnn.conv_units=32 -S model.cnn.dropout=0.5
Queued experiment '747ca93' for future execution.
$ dvc exp run --queue -n cnn-32-drop-0.9 -S model.cnn.conv_units=32 -S model.cnn.dropout=0.9
Queued experiment 'a1fa8b1' for future execution.
$ dvc exp run --queue -n cnn-64-drop-0.1 -S model.cnn.conv_units=64 -S model.cnn.dropout=0.1
Queued experiment 'dd39ab6' for future execution.
$ dvc exp run --queue -n cnn-64-drop-0.5 -S model.cnn.conv_units=64 -S model.cnn.dropout=0.5
Queued experiment '2e4bcbe' for future execution.
$ dvc exp run --queue -n cnn-64-drop-0.9 -S model.cnn.conv_units=64 -S model.cnn.dropout=0.9
Queued experiment 'f807740' for future execution.
$ dvc exp run --queue -n cnn-128-drop-0.1 -S model.cnn.conv_units=128 -S model.cnn.dropout=0.1
Queued experiment '496a6b9' for future execution.
$ dvc exp run --queue -n cnn-128-drop-0.5 -S model.cnn.conv_units=128 -S model.cnn.dropout=0.5
Queued experiment '86307af' for future execution.
$ dvc exp run --queue -n cnn-128-drop-0.9 -S model.cnn.conv_units=128 -S model.cnn.dropout=0.9
Queued experiment 'bf224a9' for future execution.
```

Next, run all queued experiments using `--run-all` (and in parallel with
`--jobs`):

```dvc
$ dvc exp run --run-all --jobs 2
```

The command will run all queued experiments in a random order.

## Comparing many experiments

To compare all of these experiments, we need more than `diff`. `dvc exp show`
compares any number of experiments in one table:

```dvc
$ dvc exp show --no-timestamp \
               --include-params model.cnn.conv_units,model.cnn.dropout \
               --include-metrics categorical_accuracy,precision,recall
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃ Experiment                     ┃ categorical_accuracy ┃ precision ┃ recall ┃ model.cnn.conv_units ┃ model.cnn.dropout ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━┩
│ workspace                      │ 0.8693               │ 0.89533   │ 0.8468 │ 32                   │ 0.1               │
│ experiments                    │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
│ ├── e51a8a9 [cnn-16-drop-0.5]  │ 0.8556               │ 0.89122   │ 0.8242 │ 16                   │ 0.5               │
│ ├── c5fe01f [cnn-16-drop-0.1]  │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
│ ├── b266b70 [cnn-16-drop-0.9]  │ 0.8224               │ 0.88641   │ 0.7476 │ 16                   │ 0.9               │
│ ├── 747ca93 [cnn-32-drop-0.5]  │ 0.8641               │ 0.8958    │ 0.8365 │ 32                   │ 0.5               │
│ ├── ca07a75 [cnn-32-drop-0.1]  │ 0.8693               │ 0.89533   │ 0.8468 │ 32                   │ 0.1               │
│ ├── a1fa8b1 [cnn-32-drop-0.9]  │ 0.8409               │ 0.89877   │ 0.7662 │ 32                   │ 0.9               │
│ ├── dd39ab6 [cnn-64-drop-0.1]  │ 0.8785               │ 0.8999    │ 0.8594 │ 64                   │ 0.1               │
│ ├── 2e4bcbe [cnn-64-drop-0.5]  │ 0.8759               │ 0.90428   │ 0.8493 │ 64                   │ 0.5               │
│ ├── f807740 [cnn-128-drop-0.1] │ 0.8787               │ 0.90401   │ 0.8523 │ 128                  │ 0.1               │
│ ├── 496a6b9 [cnn-64-drop-0.9]  │ 0.8503               │ 0.896     │ 0.8081 │ 64                   │ 0.9               │
│ ├── 86307af [cnn-128-drop-0.9] │ 0.8556               │ 0.88936   │ 0.8199 │ 128                  │ 0.9               │
│ ├── bf224a9 [cnn-128-drop-0.5] │ 0.8796               │ 0.90273   │ 0.8575 │ 128                  │ 0.5               │
│ ├── cd59a21 [cnn-32]           │ 0.8693               │ 0.89533   │ 0.8468 │ 32                   │ 0.1               │
│ └── b39380d [exp-44136]        │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
└────────────────────────────────┴──────────────────────┴───────────┴────────┴──────────────────────┴───────────────────┘
```

We can see that `cnn-128-drop-0.5` performed best in `categorical_accuracy`,
`cnn-64-drop-0.5` in `precision` and `cnn-64-drop-0.1` in `recall`.

> See `dvc exp show --help` for more info on its options.

## Persisting experiments

The metrics to optimize are usually domain or problem dependent. In these
experiments we are trying to optimize for `categorical_accuracy`. Let's keep
experiment with the highest `categorical_accuracy` score and ignore the rest.

`dvc exp apply` rolls back the <abbr>workspace<abbr> to the specified
experiment:

```dvc
$ dvc exp apply cnn-128-drop-0.1
Changes for experiment 'cnn-128-drop-0.1' have been applied to your workspace.
```

<details>

### 💡 Expand to see what this command does.

`dvc exp apply` is similar to `dvc checkout` but it works with experiments. DVC
tracks everything in the pipeline for each experiment (parameters, metrics,
dependencies, and outputs) and can later retrieve it as needed.

Check that `metrics.json` reflects all the metrics produced by the experiment
now.

```json
{
  "loss": 0.3368302583694458,
  "categorical_accuracy": 0.8795999884605408,
  "precision": 0.9027265906333923,
  "recall": 0.8575000166893005,
  "ROC": 0.9894749522209167,
  "PR": 0.9345906376838684,
  "true_positives": 8575.0,
  "true_negatives": 89076.0,
  "false_positives": 924.0,
  "false_negatives": 1425.0
}
```

</details>

Once an experiment has been applied to the workspace, it is no different from
reproducing the result without `dvc exp run`. Let's make it persistent in our
regular pipeline by committing it in our Git branch:

```dvc
$ git add dvc.lock params.yaml logs.csv metrics.json
$ git commit -m "Preserve the experiment with 128 Conv Units and Dropout = 0.5"
```

## Sharing experiments

After committing the best experiments to our Git branch, we can
[store and share](/doc/start/data-and-model-versioning#storing-and-sharing) them
remotely like any other iteration of the pipeline.

```dvc
dvc push
git push
```

<details>

### 💡 Important information on storing experiments remotely.

The commands in this section require both a `dvc remote default` and a
[Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes). A
DVC remote stores the experiment data, and a Git remote stores the code,
parameters, and other metadata associated with the experiment. DVC supports
various types of remote storage (local file system, SSH, Amazon S3, Google Cloud
Storage, HTTP, HDFS, etc.). The Git remote is often a central Git server
(GitHub, GitLab, BitBucket, etc.).

</details>

`dvc exp push` enables storing and sharing any experiment remotely.

```dvc
$ dvc exp push gitremote cnn-128-drop-0.5
Pushed experiment 'cnn-128-drop-0.5' to Git remote 'gitremote'.
```

`dvc exp list` shows all experiments that have been saved.

```dvc
$ dvc exp list gitremote --all
experiments:
        cnn-128-drop-0.5
```

`dvc exp pull` retrieves the experiment from a Git remote.

```dvc
$ dvc exp pull gitremote cnn-128-drop-0.5
Pulled experiment 'cnn-128-drop-0.5' from Git remote 'gitremote'.
```

> All these commands take a _Git remote_ as an argument. A default DVC remote is
> also required to share the experiment data.

## Cleaning up

Let's take another look at the experiments table:

```dvc
$ dvc exp show --no-timestamp \
               --include-params model.cnn.conv_units,model.cnn.dropout \
               --include-metrics categorical_accuracy,precision,recall
┏━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃ Experiment  ┃ categorical_accuracy ┃ precision ┃ recall ┃ model.cnn.conv_units ┃ model.cnn.dropout ┃
┡━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━┩
│ workspace   │ 0.8796               │ 0.90273   │ 0.8575 │ 128                  │ 0.5               │
│ experiments │ 0.8796               │ 0.90273   │ 0.8575 │ 128                  │ 0.5               │
└─────────────┴──────────────────────┴───────────┴────────┴──────────────────────┴───────────────────┘
```

Where did all the experiments go? By default, `dvc exp show` only shows
experiments since the last commit, but don't worry. The experiments remain
<abbr>cached</abbr> and can be shown or applied. For example, use `-n` to show
experiments from the previous _n_ commits:

```dvc
$ dvc exp show -n 2 --no-timestamp \
               --include-params model.cnn.conv_units,model.cnn.dropout \
               --include-metrics categorical_accuracy,precision,recall
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃ Experiment                     ┃ categorical_accuracy ┃ precision ┃ recall ┃ model.cnn.conv_units ┃ model.cnn.dropout ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━┩
│ workspace                      │ 0.8693               │ 0.89533   │ 0.8468 │ 32                   │ 0.1               │
│ experiments                    │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
│ ├── e51a8a9 [cnn-16-drop-0.5]  │ 0.8556               │ 0.89122   │ 0.8242 │ 16                   │ 0.5               │
│ ├── c5fe01f [cnn-16-drop-0.1]  │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
│ ├── b266b70 [cnn-16-drop-0.9]  │ 0.8224               │ 0.88641   │ 0.7476 │ 16                   │ 0.9               │
│ ├── 747ca93 [cnn-32-drop-0.5]  │ 0.8641               │ 0.8958    │ 0.8365 │ 32                   │ 0.5               │
│ ├── ca07a75 [cnn-32-drop-0.1]  │ 0.8693               │ 0.89533   │ 0.8468 │ 32                   │ 0.1               │
│ ├── a1fa8b1 [cnn-32-drop-0.9]  │ 0.8409               │ 0.89877   │ 0.7662 │ 32                   │ 0.9               │
│ ├── dd39ab6 [cnn-64-drop-0.1]  │ 0.8785               │ 0.8999    │ 0.8594 │ 64                   │ 0.1               │
│ ├── 2e4bcbe [cnn-64-drop-0.5]  │ 0.8759               │ 0.90428   │ 0.8493 │ 64                   │ 0.5               │
│ ├── f807740 [cnn-128-drop-0.1] │ 0.8787               │ 0.90401   │ 0.8523 │ 128                  │ 0.1               │
│ ├── 496a6b9 [cnn-64-drop-0.9]  │ 0.8503               │ 0.896     │ 0.8081 │ 64                   │ 0.9               │
│ ├── 86307af [cnn-128-drop-0.9] │ 0.8556               │ 0.88936   │ 0.8199 │ 128                  │ 0.9               │
│ ├── bf224a9 [cnn-128-drop-0.5] │ 0.8796               │ 0.90273   │ 0.8575 │ 128                  │ 0.5               │
│ ├── cd59a21 [cnn-32]           │ 0.8693               │ 0.89533   │ 0.8468 │ 32                   │ 0.1               │
│ └── b39380d [exp-44136]        │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
└────────────────────────────────┴──────────────────────┴───────────┴────────┴──────────────────────┴───────────────────┘
```

After `dvc exp apply` the useful experiments and `dvc exp push` them to share or
backup them, you may need to clean up the experiments.

`dvc exp gc` removes all references to old experiments:

```dvc
$ dvc exp gc --workspace
...
Removed 14 experiments. To remove unused cache files use 'dvc gc'.
$ dvc exp show -n 2 --no-timestamp \
               --include-params model.cnn.conv_units,model.cnn.dropout \
               --include-metrics categorical_accuracy,precision,recall
┏━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃ Experiment  ┃ categorical_accuracy ┃ precision ┃ recall ┃ model.cnn.conv_units ┃ model.cnn.dropout ┃
┡━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━┩
│ workspace   │ 0.8796               │ 0.90273   │ 0.8575 │ 128                  │ 0.5               │
│ experiments │ 0.8796               │ 0.90273   │ 0.8575 │ 128                  │ 0.5               │
│ a28bf0d     │ 0.8652               │ 0.89309   │ 0.837  │ 16                   │ 0.1               │
└─────────────┴──────────────────────┴───────────┴────────┴──────────────────────┴───────────────────┘
```

> `dvc exp gc` only removes references to the experiments, not the cached
> objects associated to them. To clean up the cache, use `dvc gc`.

## Going Further

You can continue to experiment with [the project][gsexp], there are many
parameters available to change, e.g., `noise` or `units` in Dense layer of the
network.

[gsexp]: https://github.com/iterative/get-started-experiments/
