# metrics

A set of commands to display and compare <abbr>metrics</abbr>:
[show](/doc/command-reference/metrics/show), and
[diff](/doc/command-reference/metrics/diff).

## Synopsis

```usage
usage: dvc metrics [-h] [-q | -v] {show,diff} ...

positional arguments:
  COMMAND
    show                Print metrics, with optional formatting
    diff                Show changes in metrics between commits.
```

## Description

`dvc metrics` subcommands by default use all metrics files found in `dvc.yaml`
(if any), for example `summary.json` below:

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - users.csv
    outs:
      - model.pkl
    metrics:
      - summary.json:
          cache: false
```

Note that metrics files are normally committed with Git (that's what
`cache: false` above is for). See `dvc.yaml` for more information.

### Supported file formats

Metrics can be organized as tree hierarchies in JSON or YAML 1.2 files. DVC
addresses specific metrics by the tree path. In the JSON example below, five
metrics are presented: `train.accuracy`, `train.loss`, `train.TN`, `train.FP`
and `time_real`.

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

> This example is based on our
> [Get Started](/doc/start/experiments#collecting-metrics), where you can find
> the actual source code.

First, let's imagine we have a simple [stage](/doc/command-reference/run) that
produces a `eval.json` metrics file:

```dvc
$ dvc run -n evaluate -d code/evaluate.py -M eval.json \
          python code/evaluate.py
```

> `-M` (`--metrics-no-cache`) tells DVC to mark `eval.json` as a metrics file,
> without tracking it directly (You can track it with Git). See `dvc run` for
> more info.

Now let's print metrics values that we are tracking in this
<abbr>project</abbr>, using `dvc metrics show`:

```dvc
$ dvc metrics show
        eval.json:
                AUC: 0.66729
                error: 0.16982
                TP: 516
```

When there are metrics file changes (before committing them with Git), the
`dvc metrics diff` command shows the difference between metrics values:

```dvc
$ dvc metrics diff
Path       Metric    Value    Change
eval.json  ACU       0.66729  0.01614
eval.json  error     0.16982  0.00322
eval.json  TP        516      -12
```
