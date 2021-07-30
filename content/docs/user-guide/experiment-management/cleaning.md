# Cleaning Up Experiments

Although DVC uses minimal resources to keep track of the experiments, they may
clutter tables and the workspace. DVC allows to remove particular experiments
from the workspace or delete all not-yet-persisted experiments at once.

## Removing Local Experiments

When you want to discard an experiment you can use `dvc exp remove` and supply
the experiment name.

```dvc
$ dvc exp list
main:
    cnn-32
    cnn-64
    cnn-128
$ dvc exp remove cnn-32
$ dvc exp list
main:
    cnn-64
    cnn-128
```

## Removing Experiments in Remotes

As you push the experiments with `dvc exp push`, remotes may be become cluttered with experiment references. 

DVC doesn't provide a shortcut for cleaning up the experiments in remotes but you can use Git plumbing commands to remove these references from remotes. 

First get the list of experiments with their hash values.

```dvc
$ git ls-remote origin "refs/exps/*"
```

Then we can use `git push -d` as any other Git reference:

```dvc
$ git push -d origin refs/exps/path/to/ref
```


## Deleting Experiment-Related Objects in DVC Cache



## Deleting Queued Experiments



## Deleting Associated Objects

---

> BELOW is from GS:Experiments, will be removed after review

## Cleaning up

Let's take another look at the experiments table:

```dvc
$ dvc exp show --no-timestamp \
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
$ dvc exp show -n 2 --no-timestamp \
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
$ dvc exp show -n 2 --no-timestamp \
                    --include-params train.n_est,train.min_split
┏━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace  │  0.60405 │  0.9608 │ 100        │ 64              │
│ master     │  0.60405 │  0.9608 │ 100        │ 64              │
│ 64d74b2    │  0.55259 │ 0.91536 │ 50         │ 2               │
└────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

> `dvc exp gc` only removes references to the experiments; not the cached
> objects associated with them. To clean up the <abbr>cache</abbr>, use
> `dvc gc`.
