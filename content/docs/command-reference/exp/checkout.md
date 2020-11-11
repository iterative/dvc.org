# exp checkout

Checkout changes from a previously run experiment into the workspace.

## Synopsis

```usage
usage: dvc exp checkout [-h] [-q | -v] experiment

positional arguments:
  experiment     Checkout this experiment.
```

## Description

This command will apply the changes from an experiment to the workspace. It is
usually run when you are ready to Git commit the results of an experiment into
the project.

This command will fail if the specified experiment was not derived from the Git
commit which is currently (Git) checkout-ed in the workspace.

## Options

- `experiment` - revision SHA for the experiment to be checked out.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Checkout and promote an experiment

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project workspace:

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── e6c974b           │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── 1dad0d2           │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── 1df77f7           │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

We now wish to commit the results of experiment `1dad0d2` into our project.

```dvc
$ dvc exp checkout 1dad0d2
Changes for experiment '1dad0d2' have been applied to your current workspace.
```

We can inspect these changes with Git:

```dvc
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
        modified:   dvc.lock
        modified:   params.yaml
        modified:   prc.json
        modified:   scores.json

$ git diff params.yaml scores.json
diff --git a/params.yaml b/params.yaml
index 4c4d898..faf781a 100644
--- a/params.yaml
+++ b/params.yaml
@@ -3,7 +3,7 @@ prepare:
   seed: 20170428

 featurize:
-  max_features: 1500
+  max_features: 2000
   ngrams: 2

 train:
diff --git a/scores.json b/scores.json
index c995f24..c640c4e 100644
--- a/scores.json
+++ b/scores.json
@@ -1 +1 @@
-{"auc": 0.6131382960762474}
\ No newline at end of file
+{"auc": 0.5775633054725381}
\ No newline at end of file
```

and with DVC:

```
$ dvc status
Data and pipelines are up to date.

$ dvc diff
Modified:
    data/features/
    data/features/test.pkl
    data/features/train.pkl
    model.pkl
    prc.json
    scores.json

files summary: 0 added, 0 deleted, 5 modified, 0 not in cache
```

To promote this experiment we simply `git add` and `git commit` the changes:

```dvc
$ git add .
$ git commit -m "promote experiment 1dad0d2"
[master 0412386] promote experiment 1dad0d2
```

Finally, we can now see that the promoted experiment is the new tip of our
master branch:

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment ┃ Created  ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace  │ -        │ 0.57756 │ 2000                   │ 2                │
│ master     │ 04:31 PM │ 0.57756 │ 2000                   │ 2                │
└────────────┴──────────┴─────────┴────────────────────────┴──────────────────┘
```
