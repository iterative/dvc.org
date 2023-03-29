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
    cnn-32
    cnn-64
    cnn-128
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
        cnn-128
        cnn-32
        cnn-64
        cnn-96
$ dvc exp remove --rev HEAD
Removed experiments: cnn-128,cnn-32,cnn-64,cnn-96
```

## Deleting Experiment-Related Objects in DVC Cache

Note that `dvc exp remove` do not delete any objects in the DVC
<abbr>cache</abbr>. To remove the cache objects, e.g. model files, intermediate
artifacts, etc. related with the experiments, you can use `dvc gc` command.

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
