---
title: 'Comparing and Persisting Experiments'
---

## Comparing and persisting experiments

The experiments are run several times with different parameters. We use
`dvc exp show` to compare all of these experiments.

```dvc
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃ white:**Created**      ┃ yellow:**loss**    ┃ yellow:**acc**    ┃ blue:**train.epochs** ┃ blue:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.23508 │ 0.9151 │ 10           │ 24               │
│ 7317bc6                 │ Jul 18, 2021 │       - │      - │ 10           │ 16               │
│ ├── e2647ef [exp-ee8a4] │ 05:14 PM     │ 0.23146 │ 0.9145 │ 10           │ 64               │
│ ├── 15c9451 [exp-a9be6] │ 05:14 PM     │ 0.25231 │ 0.9102 │ 10           │ 32               │
│ ├── 9c32227 [exp-17dd9] │ 04:46 PM     │ 0.23687 │ 0.9167 │ 10           │ 256              │
│ ├── 8a9cb15 [exp-29d93] │ 04:46 PM     │ 0.24459 │ 0.9134 │ 10           │ 128              │
│ ├── dfc536f [exp-a1bd9] │ 03:35 PM     │ 0.23508 │ 0.9151 │ 10           │ 24               │
│ └── 1a1d858 [exp-6dccf] │ 03:21 PM     │ 0.23282 │ 0.9152 │ 10           │ 16               │
└─────────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘
```

By default, it shows all the parameters and the metrics with the timestamp. If
you have a large number of parameters, metrics or experiments, this may lead to
a cluttered view. You can limit the table to specific metrics, or parameters, or
hide the timestamp column with `--include-metrics`, `--include-params`, or
`--no-timestamp` options of the command, respectively.

```dvc
$ dvc exp show --no-timestamp \
  --include-params model.conv_units --include-metrics acc
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ white:**Experiment**              ┃    yellow:**acc** ┃ blue:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.9151 │ 24               │
│ 7317bc6                 │      - │ 16               │
│ ├── e2647ef [exp-ee8a4] │ 0.9145 │ 64               │
│ ├── 15c9451 [exp-a9be6] │ 0.9102 │ 32               │
│ ├── 9c32227 [exp-17dd9] │ 0.9167 │ 256              │
│ ├── 8a9cb15 [exp-29d93] │ 0.9134 │ 128              │
│ ├── dfc536f [exp-a1bd9] │ 0.9151 │ 24               │
│ └── 1a1d858 [exp-6dccf] │ 0.9152 │ 16               │
└─────────────────────────┴────────┴──────────────────┘
```

After selecting an experiment from the table, you can create a Git branch that
contains the experiment with all its related files.

```dvc
$ dvc exp branch exp-17dd9 "cnn-256"
Git branch 'cnn-256' has been created from experiment 'exp-17dd9'.
To switch to the new branch run:

        git checkout cnn-256
```

You can then checkout and continue working from this branch, or merge the branch
into your `main` branch with the usual Git commands.
