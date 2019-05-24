# metrics

A set of commands to collect and display project metrics:
[add](/doc/commands-reference/metrics-add),
[show](/doc/commands-reference/metrics-show),
[modify](/doc/commands-reference/metrics-modify), and
[remove](/doc/commands-reference/metrics-remove).

## Synopsis

```usage
usage: dvc metrics [-h] [-q] [-v]
                   {show, add, modify, remove}
                   ...

positional arguments:
    show                  Output metric values.
    add                   Tag file as a metric file.
    modify                Modify metric file options.
    remove                Remove files's metric tag.
```

## Description

DVC has the ability to tag a specified output file as a file that contains
metrics to track. Metrics are usually any project specific numbers - `AUC`,
`ROC`, etc. DVC itself does not imply any specific meaning for these numbers.
Usually these numbers are produced by the model evaluation script and serve as a
way to compare and pick the best performing experiment variant.

[Add](/doc/commands-reference/metrics-add),
[show](/doc/commands-reference/metrics-show),
[modify](/doc/commands-reference/metrics-modify), and
[remove](/doc/commands-reference/metrics-remove) commands are available to set
up and manage DVC metrics.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple DVC stage file:

```dvc
$ dvc run -d code/evaluate.py -M data/eval.json -f Dvcfile \
      python code/evaluate.py
```

> `-M|--metrics-no-cache` is telling DVC to mark `data/eval.json` as a metric
> file. Using this option is equivalent to using `-O|--outs-no-cache` and then
> using `dvc metrics add data/eval.json` to explicitly mark `data/eval.json` as
> a metric file.

Now let's print metric values that we are tracking in the current project:

```dvc
$ dvc metrics show -a

  master:
      data/eval.json: {"AUC": "0.624652"}
```

Then we can tell DVC an `xpath` for the metric file, so that it can output only
the value of AUC. In the case of JSON, it uses
[JSONPath expressions](https://goessner.net/articles/JsonPath/index.html) to
selectively extract data out of metric files:

```dvc
$ dvc metrics modify data/eval.json --type json --xpath AUC
$ dvc metrics show

  master:
      data/eval.json: 0.624652
```

And finally let's remove `data/eval.json` from project's metrics:

```dvc
$ dvc metrics remove data/eval.json
$ dvc metrics show

Failed to show metrics: No metric files in this repository.
Use 'dvc metrics add' to add a metric file to track.
```
