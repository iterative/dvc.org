# metrics

A set of commands to add, manage, collect, and display project metrics:
[add](/doc/command-reference/metrics/add),
[show](/doc/command-reference/metrics/show),
[diff](/doc/command-reference/metrics/diff),
[modify](/doc/command-reference/metrics/modify), and
[remove](/doc/command-reference/metrics/remove).

## Synopsis

```usage
usage: dvc metrics [-h] [-q | -v]
                   {show,add,modify,remove,diff} ...

positional arguments:
  COMMAND
    show                Print metrics, with optional formatting.
    add                 Mark a DVC-tracked file as a metric.
    modify              Modify metric default formatting.
    remove              Remove metric mark on a DVC-tracked file.
    diff                Show changes in metrics between commits
```

## Description

In order to track metrics associated to machine learning experiments, DVC has
the ability to mark a certain stage <abbr>outputs</abbr> as files containing
metrics to track (see the `--metrics` option of `dvc run`). Metrics are
project-specific floating-point values e.g. `AUC`, `ROC`, etc.

Supported file formats: JSON. Metrics can be organized in a tree hierarchy in a
JSON file. DVC addresses the metrics by the tree path.

DVC itself does not ascribe any specific meaning for these numbers. Usually
these numbers are produced by the model training or model evaluation code and
serve as a way to compare and pick the best performing experiment.

[Add](/doc/command-reference/metrics/add),
[show](/doc/command-reference/metrics/show),
[diff](/doc/command-reference/metrics/diff),
[modify](/doc/command-reference/metrics/modify), and
[remove](/doc/command-reference/metrics/remove) commands are available to set up
and manage <abbr>DVC project</abbr> metrics.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple DVC-file:

```dvc
$ dvc run -d code/evaluate.py -M data/eval.json \
      python code/evaluate.py
```

> `-M` (`--metrics-no-cache`) is telling DVC to mark `data/eval.json` as a
> metric file, without tracking it directly (You can track it with Git). See
> `dvc run` for more info.

Now let's print metric values that we are tracking in this <abbr>project</abbr>,
using `dvc metrics show`:

```dvc
$ dvc metrics show -a

  master:
      data/eval.json:
		{
		    "AUC": 0.65115,
		    "error": 0.17304,
		    "TP": 528
		}
```

We can also give DVC an `xpath` for the metric file, so that it outputs only the
AUC value. For JSON metrics, we use
[JSONPath](https://goessner.net/articles/JsonPath/index.html) expressions to
filter data out of metric files:

```dvc
$ dvc metrics show --xpath AUC data/eval.json
      data/eval.json: {'AUC': 0.65115}
```

The `xpath` filter can be saved as the default way to display a metrics file:

```dvc
$ dvc metrics modify data/eval.json --xpath AUC
$ dvc metrics show
      data/eval.json: {'AUC': 0.65115}
```

And finally let's remove `data/eval.json` from the project metrics:

```dvc
$ dvc metrics remove data/eval.json
$ dvc metrics show

Failed to show metrics: No metric files in this repository.
Use 'dvc metrics add' to add a metric file to track.
```
