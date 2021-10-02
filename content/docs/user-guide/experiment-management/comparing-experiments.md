# Comparing Experiments

After running the experiments, it's important to compare them by their
parameters and the metrics they produced. DVC provides three commands to list,
tabulate and compare the experiments. In this section, we discuss various use
cases and options to streamline the work in experimentation.

## List experiments in the workspace

After running the experiments, you can get a list of them by `dvc exp list`.
Without any options, `dvc exp list` lists the experiments after the most recent
commit.

```dvc
$ dvc exp list
refs/tags/baseline-experiment:
        cnn-32
        cnn-64
        cnn-96
        cnn-128

```

If you want to list all the experiments in the repository independent of the
commits. you can use `--all` flag.

```dvc
$ dvc exp list --all
refs/tags/baseline-experiment:
        cnn-64
        cnn-128
        cnn-32
        cnn-96
b99a33e:
        exp-93150
```

## List experiments in another Git remote

As we discussed in [Sharing Experiments], you can use `dvc exp push` to upload
experiments to Git remotes. If you want to get a list of uploaded experiments,
you can use `dvc exp list` and supply a Git remote name.

```dvc
$ dvc exp list origin
refs/tags/baseline-experiment:
        cnn-128
        cnn-32
        cnn-64
        cnn-96
```

This command lists the experiments originated from `HEAD`. If you want to see
all the experiments in the repository, you need to add `--all` argument to this
command as well.

```dvc
$ dvc exp list origin --all
refs/tags/baseline-experiment:
        cnn-128
        cnn-32
        cnn-64
        cnn-96
b99a33e:
        exp-93150
```

[sharing experiments]: /doc/guide/experiment-management/sharing-experiments

## List experiment names to use in scripts

`dvc exp list` may be printing more than the necessary information when it comes
to feed its output to other commands. You can get only the names of the
experiments via `--names-only` flag.

The following example uses `--names-only` flag to get all experiments from a Git
remote.

```dvc
$ for experiment in $(dvc exp list origin --names-only --all) ; do
  dvc exp pull "${experiment}"
done
```

## List experiments of a particular commit, tag or branch

If you want to get experiments for a particular tag or commit, `--rev` option
allows to specify a particular Git reference to list the experiments. You can
get the list of experiments in a Git repository attached to a particular commit
with:

```dvc
$ dvc exp list origin --rev 23ceb4a
23ceb4a:
        cnn-128
        cnn-32
        cnn-64
        cnn-96
```

`--rev` can be used for tags as well.

```dvc
$ dvc exp list origin --rev baseline-experiment
refs/tags/baseline-experiment:
        cnn-128
        cnn-32
        cnn-64
        cnn-96
```

If you need to specify whether a particular reference is a tag or branch, you
can also supply the full Git reference:

```dvc
$ dvc exp list origin --rev refs/tags/baseline-experiment
refs/tags/baseline-experiment:
        cnn-128
        cnn-32
        cnn-64
        cnn-96
```

## Show a table of experiments

We do the experiments to compare and select the more successful of them. You can
get a table of experiments with `dvc exp show` that shows all the parameters and
metrics in a nicely formatted table.

```dvc
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**            ┃ neutral:**Created**      ┃    metric:**loss** ┃    metric:**acc** ┃ param:**train.epochs** ┃ param:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.23657 │ 0.9127 │ 10           │ 16               │
│ baseline-experiment   │ Sep 06, 2021 │ 0.23657 │ 0.9127 │ 10           │ 16               │
│ ├── ca55d7d [cnn-32]  │ Sep 09, 2021 │ 0.23704 │ 0.9167 │ 10           │ 32               │
│ ├── 6d13f33 [cnn-64]  │ Sep 09, 2021 │ 0.23385 │ 0.9153 │ 10           │ 64               │
│ ├── 69503c6 [cnn-128] │ Sep 09, 2021 │ 0.23243 │  0.916 │ 10           │ 128              │
│ └── 49779aa [cnn-96]  │ Sep 09, 2021 │ 0.23099 │ 0.9161 │ 10           │ 96               │
└───────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘
```

`dvc exp show` tabulates the experiments only in the workspace and the `HEAD` of
the current branch. If you want to get all the experiments, you can use `--all`
flag.

## Customize the table of experiments

The table output may become cluttered if you have a large number of parameters
and metrics. `dvc exp show` provides several options to select the parameters
and metrics to be shown in the tables.

The `--include-params` and `--include-metrics` options take a list of
comma-separated metrics and parameter names as defined in `dvc.yaml`.

```dvc
$ dvc exp show --include-params train.epochs --include-metrics auc,precision
```

````dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**            ┃ neutral:**Created**      ┃    metric:**loss** ┃    metric:**acc** ┃ param:**train.epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.23657 │ 0.9127 │ 10           │
│ baseline-experiment   │ Sep 06, 2021 │ 0.23657 │ 0.9127 │ 10           │
│ ├── ca55d7d [cnn-32]  │ Sep 09, 2021 │ 0.23704 │ 0.9167 │ 10           │
│ ├── 6d13f33 [cnn-64]  │ Sep 09, 2021 │ 0.23385 │ 0.9153 │ 10           │
│ ├── 49779aa [cnn-96]  │ Sep 09, 2021 │ 0.23099 │ 0.9161 │ 10           │
│ └── 69503c6 [cnn-128] │ Sep 09, 2021 │ 0.23243 │  0.916 │ 10           │
└───────────────────────┴──────────────┴─────────┴────────┴──────────────┘

Alternatively you can exclude certain parameters and metrics to appear in the
table by `--exclude-params` and `--exclude-metrics` options. Similar to the
include options, these take comma-separated names defined in `dvc.yaml` and
don't show those columns.

```dvc
$ dvc exp show --exclude-params train.epochs --exclude-metrics auc
````

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**            ┃ neutral:**Created**      ┃    metric:**acc** ┃ param:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.9127 │ 16               │
│ baseline-experiment   │ Sep 06, 2021 │ 0.9127 │ 16               │
│ ├── ca55d7d [cnn-32]  │ Sep 09, 2021 │ 0.9167 │ 32               │
│ ├── 6d13f33 [cnn-64]  │ Sep 09, 2021 │ 0.9153 │ 64               │
│ ├── 49779aa [cnn-96]  │ Sep 09, 2021 │ 0.9161 │ 96               │
│ └── 69503c6 [cnn-128] │ Sep 09, 2021 │  0.916 │ 128              │
└───────────────────────┴──────────────┴────────┴──────────────────┘
```

Another column that appear in `dvc exp show` table is the timestamp column. You
may want to hide it with `--no-timestamp` option.

```dvc
$ dvc exp show --no-timestamp --include-params=model.conv_units --exclude-metrics=loss
```

````dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**            ┃    metric:**acc** ┃ param:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ 0.9127 │ 16               │
│ baseline-experiment   │ 0.9127 │ 16               │
│ ├── ca55d7d [cnn-32]  │ 0.9167 │ 32               │
│ ├── 6d13f33 [cnn-64]  │ 0.9153 │ 64               │
│ ├── 49779aa [cnn-96]  │ 0.9161 │ 96               │
│ └── 69503c6 [cnn-128] │  0.916 │ 128              │
└───────────────────────┴────────┴──────────────────┘

By default `dvc exp show` lists the experiments by the timestamp. You can sort
the columns by params or metrics by the option `--sort-by` and `--sort-order`.
`--sort-by` takes a metric or parameter name as defined in `dvc.yaml` and
`--sort-order` takes either `asc` or `desc`.

```dvc
$ dvc exp show --sort-by auc --sort-order desc
````

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**            ┃    metric:**acc** ┃ param:**model.conv_units** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ 0.9127 │ 16               │
│ baseline-experiment   │ 0.9127 │ 16               │
│ ├── ca55d7d [cnn-32]  │ 0.9167 │ 32               │
│ ├── 6d13f33 [cnn-64]  │ 0.9153 │ 64               │
│ ├── 49779aa [cnn-96]  │ 0.9161 │ 96               │
│ └── 69503c6 [cnn-128] │  0.916 │ 128              │
└───────────────────────┴────────┴──────────────────┘
```

## Get a JSON or CSV list of experiments to use in scripts

There may be times when a machine readable format for the experiments is
required. In its default settings `dvc exp show` lists the experiments in
visually appealing way that's not suitable to parse in scripts. To get a list of
experiments with their params and metrics, you can use `--show-json` or
`--show-csv` flags.

These flags lead `dvc exp show` to output a JSON or CSV list suitable to pass to
other commands, e.g., you can use `jq` to filter certain elements, or write a
custom script to get a custom set of experiments for further processing.

An example might be to use these commands to get the name of the best experiment
automatically.

```dvc
$ dvc exp show --sort-by auc --sort-order desc --show-csv | head -n 1 | cut -d ',' -f 1
```

## Compare two experiments

## Compare an experiment with the workspace

## Customize the output of diff table

### Get a JSON list of changes to use in scripts

### Get a Markdown table for the differences

### Ignore the path
