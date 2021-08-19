# exp remove

Delete specific `dvc experiments` from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp remove [-h] [-q | -v] [--queue | -A]
                      [experiment [experiment ...]]

positional arguments:
   experiment    Experiments to remove.
```

## Description

Deletes one or more experiments, indicated by name (see `dvc exp run`) or
commit SHA (only queued experiments).

With `--queue`, the list of experiments awaiting execution is cleared instead.

> Note that all the checkpoints in an experiment are removed by this command.

## Options

- `--queue` - remove all experiments that haven't been run yet (defined via
  `dvc exp run --queue`).

- `-A`, `--all` - remove all experiments (includes `--queue`).

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

Let's say we have `dvc exp run` 3 experiments in our project:

```dvc
$ dvc exp list
master:
        exp-e6c97
        exp-1dad0
        exp-1df77
        exp-23d5a
```

To remove any of them, give their names to `dvc exp remove`. Or use the `--all`
(`-A`) option to remove them all at once:

```dvc
$ dvc exp remove exp-1dad0 exp-1df77

$ dvc exp list
master:
        exp-e6c97
        exp-23d5a

$ dvc exp remove -A

$ dvc exp list
```

Nothing is listed after the last `dvc exp list` because they're all gone.

For those experiments in the queue, things are pretty similiar. Let us first
create some queued experiments.

```dvc
$ dvc exp run --queue -S train.min_split=64 --name split64
Queued experiment 'e41d5b4' for future execution.
$ dvc exp run --queue -S train.min_split=32 --name split32
Queued experiment '5751540' for future execution.
$ dvc exp run --queue -S train.min_split=16 --name split16
Queued experiment '8de9a6c' for future execution.
$ dvc exp run --queue -S train.min_split=128
Queued experiment 'dbca012' for future execution.
$ dvc exp show --include-params=train.min_split --no-pager
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃ State  ┃ avg_prec ┃ roc_auc ┃ train.min_split ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ -      │  0.57553 │ 0.94652 │ 2               │
│ master                │ Aug 02, 2021 │ -      │  0.53252 │  0.9107 │ 2               │
│ ├── dbca012           │ 04:57 PM     │ Queued │        - │       - │ 128             │
│ ├── 8de9a6c [split16] │ 04:57 PM     │ Queued │        - │       - │ 16              │
│ ├── 5751540 [split32] │ 04:57 PM     │ Queued │        - │       - │ 32              │
│ └── e41d5b4 [split64] │ 04:57 PM     │ Queued │        - │       - │ 64              │
└───────────────────────┴──────────────┴────────┴──────────┴─────────┴─────────────────┘

$ dvc exp remove dbca012
$ dvc exp remove split16
$ dvc exp show --include-params=train.min_split --no-pager
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃ State  ┃ avg_prec ┃ roc_auc ┃ train.min_split ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ -      │  0.57553 │ 0.94652 │ 2               │
│ master                │ Aug 02, 2021 │ -      │  0.53252 │  0.9107 │ 2               │
│ ├── 5751540 [split32] │ 04:57 PM     │ Queued │        - │       - │ 32              │
│ └── e41d5b4 [split64] │ 04:57 PM     │ Queued │        - │       - │ 64              │
└───────────────────────┴──────────────┴────────┴──────────┴─────────┴─────────────────┘
$ dvc exp remove --queue
$ dvc exp show --include-params=train.min_split --no-pager
┏━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment ┃ Created      ┃ avg_prec ┃ roc_auc ┃ train.min_split ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace  │ -            │  0.57553 │ 0.94652 │ 2               │
│ master     │ Aug 02, 2021 │  0.53252 │  0.9107 │ 2               │
└────────────┴──────────────┴──────────┴─────────┴─────────────────┘
```
