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
[ML pipelines](/doc/tutorials/get-started/ml-pipeline) and compare the changes.
Let's further increase the number of features in the `featurize` stage to see
how it compares.

`dvc exp run` makes it easy to change <abbr>hyperparameters</abbr> and run a new
experiment:

```dvc
$ dvc exp run --set-param featurize.max_features=3000
```

<details>

### 💡 Expand to see what this command does.

`dvc exp run` is similar to `dvc repro` but with some added conveniences for
running experiments. The `--set-param` (or `-S`) flag sets the values for
[parameters](/doc/command-reference/params) as a shortcut to editing
`params.yaml`.

Check that the `featurize.max_features` value has been updated in `params.yaml`:

```git
 featurize:
-  max_features: 1500
+  max_features: 3000
```

Any edits to <abbr>dependencies</abbr> (parameters or source code) will be
reflected in the experiment run.

</details>

`dvc exp diff` compares experiments:

```dvc
$ dvc exp diff
Path         Metric    Value    Change
scores.json  avg_prec  0.56191  0.009322
scores.json  roc_auc   0.93345  0.018087

Path         Param                   Value    Change
params.yaml  featurize.max_features  3000     1500
```

## Queueing experiments

So far, we have been tuning the `featurize` stage, but there are also parameters
for the `train` stage, which trains a
[random forest classifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html).

These are the `train` parameters in `params.yaml`:

```yaml
train:
  seed: 20170428
  n_est: 50
  min_split: 2
```

Let's setup experiments with different hyperparameters. We can define all the
combinations we want to try without executing anything, by using the `--queue`
flag:

```dvc
$ dvc exp run --queue -S train.min_split=8
Queued experiment 'd3f6d1e' for future execution.
$ dvc exp run --queue -S train.min_split=64
Queued experiment 'f1810e0' for future execution.
$ dvc exp run --queue -S train.min_split=2 -S train.n_est=100
Queued experiment '7323ea2' for future execution.
$ dvc exp run --queue -S train.min_split=8 -S train.n_est=100
Queued experiment 'c605382' for future execution.
$ dvc exp run --queue -S train.min_split=64 -S train.n_est=100
Queued experiment '0cdee86' for future execution.
```

Next, run all queued experiments using `--run-all` (and in parallel with
`--jobs`):

```dvc
$ dvc exp run --run-all --jobs 2
```

## Comparing many experiments

To compare all of these experiments, we need more than `diff`. `dvc exp show`
compares any number of experiments in one table:

```dvc
$ dvc exp show --no-timestamp
               --include-params train.n_est,train.min_split
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

Each experiment is given an arbitrary name by default (although we can specify
one with `dvc exp run -n`.) We can see that `exp-98a96` performed best among
both of our metrics, with 100 estimators and a minimum of 64 samples to split a
node.

> See `dvc exp show --help` for more info on its options.

## Persisting experiments

Now that we know the best parameters, let's keep that experiment and ignore the
rest.

`dvc exp apply` rolls back the <abbr>workspace<abbr> to the specified
experiment:

```dvc
$ dvc exp apply exp-98a96
Changes for experiment 'exp-98a96' have been applied to your workspace.
```

<details>

### 💡 Expand to see what this command does.

`dvc exp apply` is similar to `dvc checkout` but it works with experiments. DVC
tracks everything in the pipeline for each experiment (parameters, metrics,
dependencies, and outputs) and can later retrieve it as needed.

Check that `scores.json` reflects the metrics in the table above:

```json
{ "avg_prec": 0.6040544652105823, "roc_auc": 0.9608017142900953 }
```

</details>

Once an experiment has been applied to the workspace, it is no different from
reproducing the result without `dvc exp run`. Let's make it persistent in our
regular pipeline by committing it in our Git branch:

```dvc
$ git add dvc.lock params.yaml prc.json roc.json scores.json
$ git commit -a -m "Preserve best random forest experiment"
```

## Sharing experiments

After committing the best experiment to our Git branch, we can
[store and share](/doc/start/data-versioning#storing-and-sharing) it remotely
just like any other iteration of the pipeline.

```dvc
dvc push
git push
```

<details>

### 💡 Expand to try out sharing with simple remotes.

Let's set up both a DVC remote to save the experiment data and a Git remote to
save the code, parameters, and other metadata associated with the experiment.
DVC supports various types of remote storage (local file system, SSH, Amazon S3,
Google Cloud Storage, HTTP, HDFS, etc.). In many cases, the Git remote might be
a central Git server (GitHub, GitLab, etc.). Let's set up both the DVC and Git
remotes on our local filesystem to try them out:

```dvc
$ mkdir -p /tmp/dvcstore
$ dvc remote add -d myremote /tmp/dvcstore
$ git commit .dvc/config -m "Configure local remote"
$ mkdir -p /tmp/gitremote
$ git clone . /temp/gitremote
$ git remote add gitremote /tmp/gitremote
$ dvc push
$ git push gitremote master
```

`dvc push` saves the promoted experiment data to the default DVC remote in
`/tmp/dvstore`.

`git push gitremote master` saves the code, parameters, and associated metadata
from the experiment committed to our `master` branch to the Git remote named
`gitremote` in `/tmp/gitremote`.

Read on to learn how to use remote storage to share other experiments with the
configured DVC and Git remotes.

</details>

Experiments that have not been promoted will not be stored or shared remotely
through `dvc push` or `git push`.

`dvc exp push` enables saving experiments to remote storage without needing to
promote them and commit them in your Git branch.

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

`dvc exp pull` retrieves the experiment from remote storage.

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
