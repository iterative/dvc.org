# exp apply

Put the results from an [experiment](/doc/command-reference/exp) in the
<abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc exp apply [-h] [-q | -v] [--no-force] experiment

positional arguments:
  experiment     Experiment to be applied
```

## Description

Restores an `experiment` into the workspace, as long as we're on the same
project baseline (Git `HEAD`) as when the target experiment was run. The
experiment can be referenced by name or hash (see `dvc exp run` for details).

Specifically, `dvc exp apply` restores any files or directories needed to
reflect the experiment conditions and results. This means checking out files
tracked both with DVC and Git: code, raw data, <abbr>parameters</abbr>,
<abbr>metrics</abbr>, resulting artifacts, etc.

⚠️ Conflicting changes in the workspace are overwritten unless `--no-force` is
used.

This is typically used after choosing a target `experiment` with `dvc exp show`
or `dvc exp diff`, and before committing it to Git (making it [persistent].

> Note that any [checkpoints] found in the `experiment` will **not** be
> preserved when applying and committing it. Use `dvc exp branch` instead.

[persistent]: /doc/user-guide/experiment-management/persisting-experiments
[checkpoints]: /doc/user-guide/experiment-management/checkpoints

## Options

- `--no-force` - fail if this command would overwrite conflicting differences
  between the `experiment` and the workspace.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Make an experiment persistent

> This example is based on our [Get Started](/doc/start/experiments), where you
> can find the actual source code.

Let's say we have run 3 experiments in our project:

```dvc
$ dvc exp show --include-params=featurize
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**              neutral:**Created**            metric:**auc**   param:**featurize.max_features**   param:**featurize.ngrams**
 ────────────────────────────────────────────────────────────────────────────────────────────
  workspace               -              0.61314   1500                     2
  10-bigrams-experiment   Jun 20, 2020   0.61314   1500                     2
  ├── exp-e6c97           Oct 21, 2020   0.69830   2000                     2
  ├── exp-1dad0           Oct 09, 2020   0.57756   1200                     2
  └── exp-1df77           Oct 09, 2020   0.51676   500                      2
 ────────────────────────────────────────────────────────────────────────────────────────────
```

Since `exp-e6c97` has the best `auc`, we may want to commit it into our project
(this is what we call to "make it persistent"):

```dvc
$ dvc exp apply exp-e6c97
Changes for experiment 'exp-e6c97' have been applied...
```

We can inspect what changed in the workspace with Git,

```dvc
$ git status
On branch master
Changes not staged for commit:
        modified:   dvc.lock
        modified:   params.yaml
        modified:   scores.json
$ git diff params.yaml
```

```git
@@ -3,7 +3,7 @@ prepare:
 featurize:
-  max_features: 1500
+  max_features: 2000
   ngrams: 2
```

and with DVC:

```dvc
$ dvc status
Data and pipelines are up to date.
$ dvc diff
Modified:
    data/features/
    data/features/test.pkl
    data/features/train.pkl
    model.pkl
files summary: 0 added, 0 deleted, 3 modified, 0 not in cache
```

To finish making this experiment persistent, we commit the changes to the repo:

```dvc
$ git add .
$ git commit -m "persist exp-e6c97"
```

We can now see that the experiment is the new tip of our master branch:

```dvc
$ dvc exp show --include-params=featurize
```

```dvctable
 ─────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**   neutral:**Created**        metric:**auc**   param:**featurize.max_features**   param:**featurize.ngrams**
 ─────────────────────────────────────────────────────────────────────────────
  workspace    -          0.69830   2000                     2
  master       04:31 PM   0.69830   2000                     2
 ─────────────────────────────────────────────────────────────────────────────
```

Note that all the other experiments are based on a previous commit, so
`dvc exp show` won't display them by default (but they're still saved).
