---
title: 'Get Started: Experiments'
---

# Get Started: Experiments

Experiments proliferate quickly in ML pipelines where there are many parameters
to tune or other permutations of the code or data. We can organize such projects
and only keep what we ultimately need with
[experiments](/doc/command-reference/exp).

## Using experiments

In the previous section, we learned how to
[tune?](/doc/tutorials/get-started/tuning?) the pipeline and compare the
changes. Let's further increase the number of features in the `featurize` stage
to see how it compares.

`dvc exp run` makes it even easier to try a new experiment:

```dvc
$ dvc exp run --params featurize.max_features=3000
```

<details>

### 💡 Expand to see what this command does.

`dvc exp run` is similar to `dvc repro` but with some added conveniences for
running experiments. The `--params` flag sets the values for
[parameters](/doc/command-reference/params) as a shortcut to editing
`params.yaml`.

Check that the `featurize.max_features` value has been updated in
`params.yaml`:

```diff
 featurize:
-  max_features: 1500
+  max_features: 3000
```

Any edits to dependencies (parameters, source code, data) will be reflected in
the experiment run.

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

## Iterating over experiments

The real magic of `dvc exp run` happens when running multiple experiments. So
far, we have been tuning the `featurize` stage, but there are also parameters
for the `train` stage, which trains a
[random forest classifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html).

These are the `train` parameters in `params.yaml`:

```yaml
train:
  seed: 20170428
  n_estimators: 50
  min_samples_split: 2
```

Let's run experiments with different combinations of parameter values passed to
the classifier. We can define all the combinations we want to try without
executing anything using the `--queue` flag:

```dvc
$ dvc exp run --queue --params train.min_samples_split=8
Queued experiment 'd3f6d1e' for future execution.
$ dvc exp run --queue --params train.min_samples_split=64
Queued experiment 'f1810e0' for future execution.
$ dvc exp run --queue --params train.min_samples_split=2 --params train.n_estimators=100
Queued experiment '7323ea2' for future execution.
$ dvc exp run --queue --params train.min_samples_split=8
Queued experiment 'c605382' for future execution.
$ dvc exp run --queue --params train.min_samples_split=64
Queued experiment '0cdee86' for future execution.
```

Next, run all queued experiments simultaneously using `--run-all` (and in
parallel with `-j`):

```dvc
$ dvc exp run --run-all -j 2
```

## Comparing many experiments

To compare all of these experiments, we need more than `diff`.

`dvc exp show` compares any number of experiments in one table:

```dvc
$ dvc exp show --no-timestamp --include-params train.n_estimators,train.min_samples_split
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Experiment    ┃ avg_prec ┃ roc_auc ┃ train.n_estimators ┃ train.min_samples_split ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ workspace     │  0.56191 │ 0.93345 │ 50                 │ 2
│
│ scratch       │  0.55259 │ 0.91536 │ 50                 │ 2
│
│ ├── exp-bfe64 │  0.57833 │ 0.95555 │ 50                 │ 8
│
│ ├── exp-b8082 │  0.59806 │ 0.95287 │ 50                 │ 64
│
│ ├── exp-c7250 │  0.58876 │ 0.94524 │ 100                │ 2
│
│ ├── exp-b9cd4 │  0.57953 │ 0.95732 │ 100                │ 8
│
│ ├── exp-98a96 │  0.60405 │  0.9608 │ 100                │ 64
│
│ └── exp-ad5b1 │  0.56191 │ 0.93345 │ 50                 │ 2
│
└───────────────┴──────────┴─────────┴────────────────────┴─────────────────────────┘
```

Each experiment is given an arbitrary name by default (although we can specify
one with `dvc exp run -n`.) We can see that `exp-98a96` performed best among
both of our metrics, with 100 estimators and a minimum of 64 samples required to
split a node.

> See `dvc exp show --help` for more info on its options.

## Preserving experiments

Now that we know the best parameters, let's keep that experiment and ignore the
rest.

`dvc exp apply` checks out the specified experiment to our workspace:

```dvc
$ dvc exp apply exp-98a96
Changes for experiment 'exp-98a96' have been applied to your current workspace.
```

<details>

### 💡 Expand to see what this command does.

`dvc exp apply` is similar to `dvc checkout` but it works with experiments that
have not been manually committed to the Git repo. DVC tracks everything in
the pipeline for each experiment (parameters, metrics, dependencies, and
outputs) and can later retrieve it as needed.

Check that `scores.json` reflects the scores in the table above:

```json
{"avg_prec": 0.6040544652105823, "roc_auc": 0.9608017142900953}
```

</details>

## Cleaning up

> See [Experiment Management](/doc/user-guide/experiment-management) to learn
> more about how to manage experiments.
