# metrics

A set of commands to display and compare _metrics_:
[show](/command-reference/metrics/show), and
[diff](/command-reference/metrics/diff).

## Synopsis

```usage
usage: dvc metrics [-h] [-q | -v] {show,diff} ...

positional arguments:
  COMMAND
    show                Print metrics, with optional formatting
    diff                Show changes in metrics between commits.
```

## Description

In order to follow the performance of machine learning experiments, DVC has the
ability to mark [structured files](#supported-file-formats) containing key/value
pairs as metrics. These metrics are project-specific floating-point, integer, or
string values e.g. AUC, ROC, false positives, etc.

If using [DVCLive](/dvclivelive/log_metric), the files are generated and metrics
are configured automatically. Metrics files also may be manually added to
[`dvc.yaml`](/user-guide/project-structure/dvcyaml-files).

In contrast to `dvc plots`, these metrics should be stored in hierarchical
files. Unlike its `dvc plots` counterpart, `dvc metrics diff` can report the
numeric difference between the metrics in different experiments, for example an
`AUC` metrics that is `0.801807` and gets increase by `+0.037826`:

```cli
$ dvc metrics diff
Path          Metric    HEAD      workspace  Change
metrics.json  AUC       0.763981  0.801807   0.037826
```

`dvc metrics` subcommands can be used on any
[valid metrics files](#supported-file-formats). By default they use the ones
specified in `dvc.yaml` (if any), including those added automatically by
DVCLive. For example, `summary.json` below:

```yaml
metrics:
  - summary.json
```

### Supported file formats

Metrics can be organized as tree hierarchies in JSON, TOML 1.0, or YAML 1.2
files. DVC addresses specific metrics by the tree path. In the JSON example
below, five metrics are presented: `train.accuracy`, `train.loss`, `train.TN`,
`train.FP` and `time_real`.

```json
{
  "train": {
    "accuracy": 0.9886999726295471,
    "loss": 0.041855331510305405,
    "TN": 473,
    "FP": 845
  },
  "time_real": 344.61309599876404
}
```

DVC itself does not ascribe any specific meaning for these numbers. Usually they
are produced by the model training or model evaluation code and serve as a way
to compare and pick the best performing experiment.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's imagine we have a simple Python script using DVCLive to log some
metrics:

```python
from dvclive import Live

with Live() as live:
    ...
    live.log_metric("AUC", auc)
    live.log_metric("error", error)
    live.log_metric("TP", tp)
```

This will generate some log files, including `dvclive/metrics.json`, which looks
like:

```json
{
  "AUC": 0.66729,
  "error": 0.16982,
  "TP": 516
}
```

It will also generate `dvc.yaml`, which includes:

```yaml
metrics:
  - dvclive/metrics.json
```

Now let's print metrics values that we are tracking in this
<abbr>project</abbr>, using `dvc metrics show`:

```cli
$ dvc metrics show
Path                  AUC      TP    error
dvclive/metrics.json  0.66729  516   0.16982
```

When there are metrics file changes (before committing them with Git), the
`dvc metrics diff` command shows the difference between metrics values:

```cli
$ dvc metrics diff

Path                  Metric    HEAD     workspace  Change
dvclive/metrics.json  AUC       0.65115  0.66729    0.01614
dvclive/metrics.json  error     0.1666   0.16982    0.00322
dvclive/metrics.json  TP        528      516        -12
```
