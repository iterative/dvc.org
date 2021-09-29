# Comparing Experiments

After running the experiments, it's important to compare them by their
parameters and the metrics they produced. DVC provides three commands to list,
tabulate and compare the experiments. In this section we discuss various use
cases and options to streamline the work in experimentation.

## List experiments in the workspace

After running the experiments, you can get a list of them by `dvc exp list`.
Without any options this command lists the experiments after the most recent
commit.

```dvc
$ dvc exp list
```

If you want to list all the experiments in the repository independent of the
commits. you can use `--all` flag.

```dvc
$ dvc exp list --all
```

## List experiments in another Git remote

As we discussed in [Sharing Experiments] section, `dvc exp push` enables to
upload experiments to Git remotes. When you want to review these experiments,
you can do so by supplying the Git remote name to `dvc exp list`.

```dvc
$ dvc exp list origin
```

This command lists the experiments originated from `HEAD`. If you want to see
all the experiments in the repository, you need to add `--all` argument to this
command as well.

```dvc
$ dvc exp list origin --all
```

[sharing experiments]: /doc/guide/experiment-management/sharing-experiments

## List experiment names to use in scripts

When you want to get a _machine-oriented_ list of experiments to use in scripts,
`dvc exp list` may be printing more than the necessary information. You can use
get only the names of the experiments via `--names-only` flag. The following
command provides a flat list of experiment names that you can use in scripts
rather easily.

```dvc
$ dvc exp list --names-only --all
```

## List experiments of a particular commit, tag or branch

If you want to get experiments for a particular tag or commit, you can do so
using the `--rev` option. For example, you can get the list of experiments in a
Git repository attached to a particular commit with:

```dvc
$ dvc exp list origin --rev 23ceb4a
23ceb4a:
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

## Customize the table of experiments

When you have many metrics and params to track with the experiments, the table
output may become cluttered. It has several options to select the parameters and
metrics to be shown in the tables.

The `--include-params` and `--include-metrics` options take a list of
comma-separated metrics and parameter names as defined in `dvc.yaml`.

```dvc
$ dvc exp show --include-params cnn_units --include-metrics auc,precision
```

Alternatively you can exclude certain parameters and metrics to appear in the
table by `--exclude-params` and `--exclude-metrics` options. Similar to the
include options, these take comma-separated names defined in `dvc.yaml` and
don't show those columns.

```dvc
$ dvc exp show --exclude-params cnn_units --exclude-metrics auc
```

Another column that appear in `dvc exp show` table is the timestamp column. You
may want to hide it with `--no-timestamp` option.

```dvc
$ dvc exp show --no-timestamp
```

By default `dvc exp show` lists the experiments by the timestamp. You can sort
the columns by params or metrics by the option `--sort-by` and `--sort-order`.
`--sort-by` takes a metric or parameter name as defined in `dvc.yaml` and
`--sort-order` takes either `asc` or `desc`.

```dvc
$ dvc exp show --sort-by auc --sort-order desc
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
