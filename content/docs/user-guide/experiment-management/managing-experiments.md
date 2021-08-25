# Managing Experiments

Once you have defined and/or [run experiments] in your project, you can use
several features of DVC to see, compare, reproduce, share, or remove them.

[run experiments]: /doc/user-guide/experiment-management/running-experiments

## Experiment names

Experiments created with `dvc exp run` will have an auto-generated name like
`exp-bfe64` by default. It can be customized using the `--name` (`-n`) option:

```dvc
$ dvc exp run --name cnn-512 --set-param model.conv_units=512
```

When you create an experiment, DVC generates a Git-like SHA-1 hash from its
contents. This is shown when you [queue experiments] with `--queue`:

[queue experiments]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue

```dvc
$ dvc exp run --queue -S model.conv_units=32
Queued experiment '6518f17' for future execution.
```

After running queued experiment, DVC uses the regular name mentioned earlier.

> Note that you can set a queued experiment's name in advance:
>
> ```dvc
> $ dvc exp run --queue --name cnn-512 -S model.conv_units=512
> Queued experiment '86bd8f9' for future execution.
> ```

You can refer to experiments in `dvc exp apply` or `dvc exp branch` either with
regular experiment names or by their SHA hashes.

## Listing experiments

Use `dvc exp show` to see both run and queued experiments:

```dvc
$ dvc exp show --no-pager --no-timestamp \
      --include-metrics loss --include-params model.conv_units
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**loss**    ┃ param:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.23534 │ 64               │
│ 3973b6b                 │ -       │ 16               │
│ ├── aeaabb0 [exp-cb13f] │ 0.23534 │ 64               │
│ ├── d0ee7ce [exp-5dccf] │ 0.23818 │ 32               │
│ ├── 1533e4d [exp-88874] │ 0.24039 │ 128              │
│ ├── b1f41d3 [cnn-256]   │ 0.23296 │ 256              │
│ ├── 07e927f [exp-6c06d] │ 0.23279 │ 24               │
│ ├── b2b8586 [exp-2a1d5] │ 0.25036 │ 16               │
│ └── *86bd8f9            │ -       │ 512              │
└─────────────────────────┴─────────┴──────────────────┘
```

When an experiment is not run yet, only the former hash is shown (marked with
`*`).

<!-- WIP -->
