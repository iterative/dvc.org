## Comparing and persisting experiments

The experiments are run several times with different parameters. We use
`dvc exp show` to compare all of these experiments.

```dvc
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**            metric:**loss**      metric:**acc**   param:**train.epochs**    param:**model.conv_units**    dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -              0.031865   0.9897   10             24                 6875529
  baseline-experiment       Jan 14, 2022    0.03332   0.9888   10             16                 6875529
  ├── 43a3b4f [exp-7f82e]   Jan 27, 2022   0.042424   0.9874   10             256                6875529
  ├── 6d15fac [exp-75369]   Jan 27, 2022   0.037164    0.989   10             128                6875529
  ├── 47896c1 [exp-76693]   Jan 27, 2022    0.03845   0.9876   10             64                 6875529
  ├── da84ac7 [exp-4a081]   Jan 27, 2022   0.035497    0.988   10             32                 6875529
  ├── 5846c68 [exp-953fa]   Jan 27, 2022   0.031865   0.9897   10             24                 6875529
  └── 999710f [exp-ff24d]   Jan 27, 2022    0.03247   0.9887   10             16                 6875529
 ────────────────────────────────────────────────────────────────────────────────────────────────────────
```

By default, it shows all the metrics, parameters and dependencies with the
timestamp. If you have a large number of metrics, parameters, dependencies or
experiments, this may lead to a cluttered view. You can limit the table to
specific columns using the [`--drop`](/doc/command-reference/exp/show#--drop)
option of the command.

```dvc
$ dvc exp show --drop 'Created|train|loss'
```

```dvctable
 ───────────────────────────────────────────────────────────────
  neutral:**Experiment**                   metric:**acc**   param:**model.conv_units**    dep:**data**
 ───────────────────────────────────────────────────────────────
  workspace                 0.9897   24                 6875529
  baseline-experiment       0.9888   16                 6875529
  ├── 43a3b4f [exp-7f82e]   0.9874   256                6875529
  ├── 6d15fac [exp-75369]    0.989   128                6875529
  ├── 47896c1 [exp-76693]   0.9876   64                 6875529
  ├── da84ac7 [exp-4a081]    0.988   32                 6875529
  ├── 5846c68 [exp-953fa]   0.9897   24                 6875529
  └── 999710f [exp-ff24d]   0.9887   16                 6875529
 ───────────────────────────────────────────────────────────────
```
