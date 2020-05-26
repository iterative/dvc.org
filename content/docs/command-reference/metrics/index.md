# metrics

A set of commands to manage, collect, and display project metrics:
[show](/doc/command-reference/metrics/show), and
[diff](/doc/command-reference/metrics/diff).

## Synopsis

```usage
usage: dvc metrics [-h] [-q | -v]
                   {show,diff} ...

positional arguments:
  COMMAND
    show                Print metrics, with optional formatting.
    diff                Show changes in metrics between commits
```

## Description

In order to track metrics associated to machine learning experiments, DVC has
the ability to mark a certain stage <abbr>outputs</abbr> as files containing
metrics to track (see the `--metrics` option of `dvc run`). Metrics are
project-specific floating-point or integer values e.g. `AUC`, `ROC`,
`False-Positives` etc.

[Show](/doc/command-reference/metrics/show), and
[diff](/doc/command-reference/metrics/diff), commands are available to set up
and manage <abbr>DVC project</abbr> metrics.

## Formats and metrics types

Supported file formats: JSON and YAML. Metrics can be organized in a tree
hierarchy in a JSON file or a YAML file. DVC addresses the metrics by the tree
path.

DVC itself does not ascribe any specific meaning for these numbers. Usually
these numbers are produced by the model training or model evaluation code and
serve as a way to compare and pick the best performing experiment.

## Default metrics files

`dvc metrics show` and `dvc metrics diff` commands by default use all metrics
files that are specified in `dvc.yaml`. So, there no need to specify metrics
file name to see the deault metrics. The metrics files can be added to
`dvc.yaml` by options `--metrics` (`-m`) or `--metrics-no-cache` (`-M`) of
`dvc run` command or manualy to `metrics` section of a stage:

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - users.csv
    params:
      - epochs
      - dropout
      - lr
    outs:
      - model.pkl
    metrics:
      - summary.json:
          cache: false
```

`False` value of the additional `cache` option specifies that this is not data
file, it should not be moved to DVC cache and it should be commited to Git
history instead.

### Difference between continuous and scalar metrics

DVC has two concepts for metrics for representing result of machine learning
training or data processing:

1. `dvc metrics` to represent scalar numbers such as AUC, true positive rate and
   others.
2. `dvc plots` to visualize continuous metrics such as AUC curves, loss
   functions, confusion matrices, and others.

In this section, only scalar metrics are covered.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple DVC pipeline stage:

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
$ dvc metrics show
      data/eval.json:
		{
		    "AUC": 0.65115,
		    "error": 0.17304,
		    "TP": 528
		}
```

When metrics file changes in the user workspace witout commiting it to the Git,
the `dvc metrics diff` command show the difference between metrics values:

```dvc
$ dvc metrics diff
Path       Metric    Value    Change
eval.json  ACU       0.66729  0.01614
eval.json  error     0.16982  0.00322
eval.json  TP        516      -12
```

Metrics commited to the Git history can be shown by referencing the commit name
or any aliase:

```dvc
$ dvc metrics diff HEAD c7bef55
Path       Metric    Value    Change
eval.json  ACU       0.66729  0.01614
eval.json  error     0.16982  0.00322
eval.json  TP        516      -12
```
