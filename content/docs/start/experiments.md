---
title: 'Get Started: Experiments'
docker: dvcorg/doc-start:experiments
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
classification performance for MNIST dataset.

> You can run these commands in the container we built for this tutorial. It has
> all the code and data required to run these examples.
> `docker run -it dvcorg/doc-start:evaluate`

In order to run a baseline experiment with the default parameters defined in
`params.yaml`:

```dvc
dvc exp run
```

This resembles `dvc repro` without any command-line arguments. However, when
using `dvc repro` we need to update `params.yaml` manually, run the pipeline, if
the results are worth it commit them to DVC and Git. `dvc exp` automates this
process through its subcommands.

Let's see the metrics produced by this baseline experiment:

```dvc
dvc exp show --include_metrics TK
```

Note that the experiment results are identical with the values checked-out from
Git. By default each experiment is given a name automatically. We can set the
name by the `--name/-n` argument.

Let's change the number of units in CNN and do another experiment:

```dvc
dvc exp run -n cnn-32 --set-param model.cnn.units=32
```

`--set-param/-S` argument of `dvc exp run` is used to set parameters in
`params.yaml`.

<details>

### 💡 Expand to see what this command does.

The `--set-param` (or `-S`) flag sets the values for
[parameters](/doc/command-reference/params) as a shortcut to editing
`params.yaml`.

Check that the `model.cnn.units` value has been updated in `params.yaml`:

TK: CHECK the diff

```git
 model:
   cnn:
-     units: 16
-     units: 32
```

Any edits to <abbr>dependencies</abbr> (parameters or source code) will be
reflected in the experiment run.

</details>

`dvc exp diff` compares experiments:

TK: update the result

```dvc
$ dvc exp diff
Path         Metric    Value    Change
scores.json  avg_prec  0.56191  0.009322
scores.json  roc_auc   0.93345  0.018087

Path         Param                   Value    Change
params.yaml  featurize.max_features  3000     1500
```

## Queueing experiments

Instead of running the experiments one-by-one, we can define them without
executing. This is especially handy when you have long running experiments to
try.

We add experiments to the queue using `--queue` option of `dvc exp run`. Here,
we also set the names of experiments to observe the results clearly:

```dvc
$ dvc exp run --queue -n cnn-16-drop-0.1 -S model.cnn.conv_units=16 -S model.cnn.dropout=0.1
$ dvc exp run --queue -n cnn-16-drop-0.5 -S model.cnn.conv_units=16 -S model.cnn.dropout=0.5
$ dvc exp run --queue -n cnn-16-drop-0.9 -S model.cnn.conv_units=16 -S model.cnn.dropout=0.9
$ dvc exp run --queue -n cnn-32-drop-0.1 -S model.cnn.conv_units=32 -S model.cnn.dropout=0.1
$ dvc exp run --queue -n cnn-32-drop-0.5 -S model.cnn.conv_units=32 -S model.cnn.dropout=0.5
$ dvc exp run --queue -n cnn-32-drop-0.9 -S model.cnn.conv_units=32 -S model.cnn.dropout=0.9
$ dvc exp run --queue -n cnn-64-drop-0.1 -S model.cnn.conv_units=64 -S model.cnn.dropout=0.1
$ dvc exp run --queue -n cnn-64-drop-0.5 -S model.cnn.conv_units=64 -S model.cnn.dropout=0.5
$ dvc exp run --queue -n cnn-64-drop-0.9 -S model.cnn.conv_units=64 -S model.cnn.dropout=0.9
$ dvc exp run --queue -n cnn-128-drop-0.1 -S model.cnn.conv_units=128 -S model.cnn.dropout=0.1
$ dvc exp run --queue -n cnn-128-drop-0.5 -S model.cnn.conv_units=128 -S model.cnn.dropout=0.5
$ dvc exp run --queue -n cnn-128-drop-0.9 -S model.cnn.conv_units=128 -S model.cnn.dropout=0.9
```

Next, run all queued experiments using `--run-all` (and in parallel with
`--jobs`):

```dvc
$ dvc exp run --run-all --jobs 2
```

## Comparing many experiments

To compare all of these experiments, we need more than `diff`. `dvc exp show`
compares any number of experiments in one table:

TK: Update the metrics and table

```dvc
$ dvc exp show --no-timestamp
               --include-params model.cnn.units,model.cnn.dropout
               --include-metrics
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment    ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace     │  0.56191 │ 0.93345 │ 50         │ 2               │
│ master        │  0.55259 │ 0.91536 │ 50         │ 2               │
│ ├── exp-bfe64 │  0.57833 │ 0.95555 │ 50         │ 8               │
│ ├── exp-b8082 │  0.59806 │ 0.95287 │ 50         │ 64              │
│ ├── exp-c7250 │  0.58876 │ 0.94524 │ 100        │ 2               │
│ ├── exp-b9cd4 │  0.57953 │ 0.95732 │ 100        │ 8               │
│ ├── exp-98a96 │  0.60405 │  0.9608 │ 100        │ 64              │
│ └── exp-ad5b1 │  0.56191 │ 0.93345 │ 50         │ 2               │
└───────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

We can see that TK:`exp-98a96` performed best among both of our metrics, with
100 estimators and a minimum of 64 samples to split a node.

> See `dvc exp show --help` for more info on its options.

## Persisting experiments

Now that we know the best parameters, let's keep that experiment and ignore the
rest.

`dvc exp apply` rolls back the <abbr>workspace<abbr> to the specified
experiment:

TK: Update the experiment name

```dvc
$ dvc exp apply exp-98a96
Changes for experiment 'exp-98a96' have been applied to your workspace.
```

<details>

### 💡 Expand to see what this command does.

`dvc exp apply` is similar to `dvc checkout` but it works with experiments. DVC
tracks everything in the pipeline for each experiment (parameters, metrics,
dependencies, and outputs) and can later retrieve it as needed.

Check that `scores.json` reflects the metrics in the table above: TK: Update
scores

```json
{ "avg_prec": 0.6040544652105823, "roc_auc": 0.9608017142900953 }
```

</details>

Once an experiment has been applied to the workspace, it is no different from
reproducing the result without `dvc exp run`. Let's make it persistent in our
regular pipeline by committing it in our Git branch:

TK: Update the commands

```dvc
$ git add dvc.lock params.yaml prc.json roc.json scores.json
$ git commit -a -m "Preserve best random forest experiment"
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

⚠️ Experiments that have not been made persistent with `dvc exp apply` will not
be stored or shared remotely.

`dvc exp push` enables storing and sharing any experiment remotely.

```dvc
$ dvc exp push gitremote exp-bfe64
Pushed experiment 'exp-bfe64' to Git remote 'gitremote'.
```

`dvc exp list` shows all experiments that have been saved.

```dvc
$ dvc exp list gitremote --all
72ed9cd:
        exp-bfe64
```

`dvc exp pull` retrieves the experiment from a Git remote.

```dvc
$ dvc exp pull gitremote exp-bfe64
Pulled experiment 'exp-bfe64' from Git remote 'gitremote'.
```

> All these commands take a Git remote as an argument. A default DVC remote is
> also required to share the experiment data.

## Cleaning up

Let's take another look at the experiments table:

```dvc
$ dvc exp show --no-timestamp
               --include-params train.n_est,train.min_split
┏━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace  │  0.60405 │  0.9608 │ 100        │ 64              │
│ master     │  0.60405 │  0.9608 │ 100        │ 64              │
└────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

Where did all the experiments go? By default, `dvc exp show` only shows
experiments since the last commit, but don't worry. The experiments remain
<abbr>cached</abbr> and can be shown or applied. For example, use `-n` to show
experiments from the previous _n_ commits:

```dvc
$ dvc exp show -n 2 --no-timestamp
                    --include-params train.n_est,train.min_split
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment    ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace     │  0.60405 │  0.9608 │ 100        │ 64              │
│ master        │  0.60405 │  0.9608 │ 100        │ 64              │
│ 64d74b2       │  0.55259 │ 0.91536 │ 50         │ 2               │
│ ├── exp-bfe64 │  0.57833 │ 0.95555 │ 50         │ 8               │
│ ├── exp-b8082 │  0.59806 │ 0.95287 │ 50         │ 64              │
│ ├── exp-c7250 │  0.58876 │ 0.94524 │ 100        │ 2               │
│ ├── exp-98a96 │  0.60405 │  0.9608 │ 100        │ 64              │
│ ├── exp-b9cd4 │  0.57953 │ 0.95732 │ 100        │ 8               │
│ └── exp-ad5b1 │  0.56191 │ 0.93345 │ 50         │ 2               │
└───────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

Eventually, old experiments may clutter the experiments table.

`dvc exp gc` removes all references to old experiments:

```dvc
$ dvc exp gc --workspace
$ dvc exp show -n 2 --no-timestamp
                    --include-params train.n_est,train.min_split
┏━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace  │  0.60405 │  0.9608 │ 100        │ 64              │
│ master     │  0.60405 │  0.9608 │ 100        │ 64              │
│ 64d74b2    │  0.55259 │ 0.91536 │ 50         │ 2               │
└────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

> `dvc exp gc` only removes references to the experiments, not the cached
> objects associated to them. To clean up the cache, use `dvc gc`.
