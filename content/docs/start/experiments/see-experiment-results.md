You can review the experiment results with `dvc exp show` and see these metrics
and results in a nicely formatted table:

```dvc
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**           metric:**loss**      metric:**acc**   param:**train.epochs**    param:**model.conv_units**    dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -              0.03247   0.9887   10             16                 6875529
  baseline-experiment       Jan 14, 2022   0.03332   0.9888   10             16                 6875529
  └── 999710f [exp-ff24d]   10:54 PM       0.03247   0.9887   10             16                 6875529
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
```

The `workspace` row in the table shows the results of the most recent experiment
that's available in the <abbr>workspace</abbr>. The table also shows each
experiment in a separate row, along with the Git commit IDs they are attached
to. We can see that the experiment we run has a name `exp-6dccf` and was run
from the commit ID `7317bc6`.

Now let's do some more experimentation.

Option `dvc exp run --set-param` allows to update experimental parameters
without modifying the files manually. We use this feature to set the
convolutional units in `train.py`.

```dvc
$ dvc exp run --set-param model.conv_units=24
...
Reproduced experiment(s): exp-7b56f
Experiment results have been applied to your workspace.
...
```
