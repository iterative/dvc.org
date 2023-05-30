# Cleaning Up Experiments

Although DVC uses minimal resources to keep track of the experiments, they may
clutter tables and the workspace. DVC allows to remove specific experiments from
the workspace or delete the ones that are not [final] yet.

[final]: /doc/user-guide/experiment-management/persisting-experiments

## Removing specific experiments

When you want to discard experiments by their name, you can use `dvc exp remove`
and supply the experiment name.

```cli
$ dvc exp list
main:
    2399f24 [cnn-128]
    4e8a178 [cnn-32]
    f1edf21 [cnn-64]
$ dvc exp remove cnn-32 cnn-64
Removed experiments: cnn-32,cnn-64
```

## Removing multiple experiments (based on parent commit)

You may wish to remove multiple experiments at once. For example, if you are
finished experimenting on the current Git commit and want to discard all
experiments derived from it, use `dvc exp remove --rev` with `HEAD`.

```cli
$ dvc exp list
refs/tags/baseline-experiment:
    2399f24 [cnn-128]
    4e8a178 [cnn-32]
    f1edf21 [cnn-64]
    bdf6fa2 [cnn-96]

$ dvc exp remove --rev HEAD
Removed experiments: cnn-128,cnn-32,cnn-64,cnn-96
```

## Cleaning up experiments

After you've completed a set of experiments, it may be easier to decide which of
these to keep rather than which of these to remove. You can use `dvc exp gc` to
select a set of experiments to keep and the rest of them are _garbage
collected._

This command takes a `scope` argument. It accepts "workspace", "all-branches",
"all-tags", or "all-commits". This determines the experiments to _keep_, i.e.
experiments not in scope are removed.

> ⚠️ Note that experiment remains in the <abbr>cache</abbr> until you use
> regular `dvc gc` separately to clean it up (if it's not needed by committed
> versions).

### Keeping experiments in the workspace

Supplying `--workspace` flag to `dvc exp gc` causes all experiments to be
removed **except** those in the current workspace.

```cli
$ dvc exp list --all-commits
main:
    1f7e42f [toric-chiv]
    48b0af9 [cadgy-site]
    935d6e9 [melic-plum]
other:
    97501f9 [algal-toms]
    0f1523d [heady-sera]
another:
    bc0e834 [riled-song]
    b3447f3 [forky-aits]
    dacb364 [hooly-firm]
```

Issuing `dvc exp gc --workspace` removes experiments in `other` and `another`
branches in this example.

```cli
$ dvc exp gc --workspace
$ dvc exp list --all-commits
main:
    1f7e42f [toric-chiv]
    48b0af9 [cadgy-site]
    935d6e9 [melic-plum]
```

### Keeping experiments in all branches

DVC can create a branch for an experiment using `dvc exp branch` command.

In cases where you want to clean up the experiments _except_ those in the
branches, you can use `--all-branches` flag.

```cli
$ dvc exp show --all-branches
```

```dvctable
 ────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                 neutral:**Created**           metric:**acc**   param:**model.conv_units**
 ────────────────────────────────────────────────────────────────────
  workspace                  -                   -   64
  cnn-48                     09:11 AM       0.9131   48
  main                       Jul 21, 2021   0.9189   16
  ├── dac711b [cnn-32]       09:16 AM       0.9152   32
  ├── 7cd3ae7 [cnn-48]       09:11 AM       0.9131   48
  ├── ab585b5 [cnn-24]       09:06 AM       0.9135   24
  ├── 7d51b55 [freed-roam]   09:01 AM       0.9151   16
  └── 7feaa1c [frank-farm]   Aug 02, 2021   0.9151   16
  8583124                    Jul 20, 2021   0.9132   17
 ────────────────────────────────────────────────────────────────────
```

Supplying `--all-branches` keeps only the experiments in branch tips. Any
experiment that's not promoted to a branch is removed this way.

```cli
$ dvc exp gc --all-branches
WARNING: This will remove all experiments except those derived from the workspace and all git branches of the current repo.
Are you sure you want to proceed? [y/n] y
Removed 6 experiments. To remove unused cache files use 'dvc gc'.
```

The resulting `dvc exp show` table is as the following:

```dvctable
 ────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**           metric:**acc**   metric:**model.conv_units**
 ────────────────────────────────────────────────────────────────────
  workspace                 -                   -   64
  cnn-48                    09:11 AM       0.9131   48
  main                      Jul 21, 2021   0.9189   16
  8583124                   Jul 20, 2021   0.9132   17
 ────────────────────────────────────────────────────────────────────
```

### Keeping experiments in all tags

When you tag the experiment commits by `git tag`, `dvc exp show --all-tags`
presents them along with the tags. If you want the delete _all experiments
without tags_, you can issue a `dvc exp gc --all-tags` command.

```cli
$ dvc exp show --all-tags
```

```dvctable
 ─────────────────────────────────────────────────────
  neutral:**Experiment**                   metric:**acc**   metric:**model.conv_units**
 ─────────────────────────────────────────────────────
  workspace                 0.9067   16
  ├── 2fc4f81 [frank-farm]  0.9037   48
  └── 21beb69 [unwet-jinn]  0.9367   128
  my-experiments            0.9067   16
  ├── 2fc4f81 [cnn-32]      0.9067   32
  ├── 5bc84a3 [cnn-64]      0.9158   64
  ├── 206cba6 [cnn-96]      0.9260   96
  └── 21beb69 [cnn-128]     0.9379   128
 ─────────────────────────────────────────────────────
```

```cli
$ dvc exp gc --all-tags

$ dvc exp show --all-tags
```

```dvctable
 ─────────────────────────────────────────────────────
  neutral:**Experiment**                   metric:**acc**   metric:**model.conv_units**
 ─────────────────────────────────────────────────────
  workspace                 0.9067   16
  my-experiments            0.9067   16
  ├── 2fc4f81 [cnn-32]      0.9067   32
  ├── 5bc84a3 [cnn-64]      0.9158   64
  ├── 206cba6 [cnn-96]      0.9260   96
  └── 21beb69 [cnn-128]     0.9379   128
 ─────────────────────────────────────────────────────
```

### Keeping experiments in all commits

When you want to delete _all the experiments not associated with a Git commit_,
you can do so by `--all-commits` flag. It deletes the experiments in the
workspace that are not committed to the history.

### Deleting Experiment-Related Objects in DVC Cache

Note that `dvc exp gc` and `dvc exp remove` do not delete any objects in the DVC
<abbr>cache</abbr>. In order to remove the cache objects, e.g. model files,
intermediate artifacts, etc. related with the experiments, you can use `dvc gc`
command.

`dvc gc` receives the same _scoping_ flags, `--workspace`, `--all-branches`,
etc. After a `dvc exp gc --workspace` command, you can supply
`dvc gc --workspace` to remove all the experiment artifacts from the cache as
well.

## Removing experiments from remotes

As you push the experiments with `dvc exp push`, Git remotes may be become
cluttered with experiment references. To remove experiments from a Git remote,
use `dvc exp remove -g`.

```cli
$ dvc exp remove -g origin unwet-jinn
Removed experiments: unwet-jinn
```

## Removing queued experiments

When you've queued experiments with `dvc exp run --queue` and later decide not
to run them, you can remove them with `dvc exp remove --queue`.

```cli
$ dvc exp run --queue -S param=10
Queued experiment '7b83744' for future execution.
$ dvc exp run --queue -S param=20
Queued experiment '68808d5' for future execution.
$ dvc exp show
```

```dvctable
 ─────────────────────────────────────
  neutral:**Experiment**     neutral:**Created**        metric:**param**
 ─────────────────────────────────────
  workspace      -              -
  04abbb7        Jul 21, 2021   -
  ├── *68808d5   12:05 PM       20
  └── *7b83744   12:05 PM       10
 ─────────────────────────────────────
```

```cli
$ dvc exp remove --queue
$ dvc exp show
```

```dvctable
 ─────────────────────────────────────
  neutral:**Experiment**     neutral:**Created**        metric:**param**
 ─────────────────────────────────────
  workspace      -              -
  04abbb7        Jul 21, 2021   -
 ─────────────────────────────────────
```
