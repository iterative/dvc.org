# Comparing Experiments

After running the experiments, it's desirable to compare them by their
parameters and the corresponding results. DVC provides three commands to list,
tabulate and compare the experiments. In this section, we discuss various use
cases and options to streamline experimentation.

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
commits, you can use `--all` flag.

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

As we discuss in [Sharing Experiments], you can use `dvc exp push` to upload
experiments to Git remotes. `dvc exp list` can be used to list the experiments
in a Git remote.

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

For example, to get all the experiment names from a Git remote:

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

Experimentation is about selecting the best from many trials. You can get a
table of experiments with `dvc exp show` that shows all the parameters and
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
hide those columns.

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

## Get experiments table in JSON

There may be times when a machine readable format for the experiments is
required. In its default settings `dvc exp show` lists the experiments in a
visually appealing way that may not be suitable to parse in scripts. To get a
list of experiments with their params and metrics, you can use `--json` or
`--csv` flags.

```dvc
$ dvc exp show --json | jq
```

```json
{
  "workspace": {
    "baseline": {
      "data": {
        "timestamp": null,
        "params": {
          "params.yaml": {
            "data": {
              "train": {
                "epochs": 10
              },
              "model": {
                "conv_units": 16
              }
            }
          }
        },
        "queued": false,
        "running": false,
        "executor": null,
        "metrics": {
          "metrics.json": {
            "data": {
              "loss": 0.236574187874794,
              "acc": 0.9126999974250793
            }
          }
        }
      }
    }
  },
  "23ceb4a6623d46a5c906f265b5846ef2f332f756": {
    "baseline": {...}
    "ca55d7d4763d74bfeac2ca08369489c2881c03ac": {...}
    "6d13f334bbdd6ea40412d4ce9b5d81d6abb731ee": {...}
    "69503c61df98752b07772415e0715655dc4ccaa0": {...}
    "49779aa9c863a5503008eae08b03a6e707f8ddad": {...}
  }
}
```

The result is a JSON dictionary with the keys `workspace` and the Git commit IDs
in SHA-256 digest. These commit IDs are those that the experiments are
originated from. These commits contain a `baseline` key that denotes the
baseline experiment of that particular commit and experiment IDs in SHA-256
digest. The example output above is shortened to show this structure.

Each experiment entry has the following structure:

```json
"49779aa9c863a5503008eae08b03a6e707f8ddad": {
      "data": {
        "timestamp": "2021-09-09T12:53:51",
        "params": {
          "params.yaml": {
            "data": {
              "train": {
                "epochs": 10
              },
              "model": {
                "conv_units": 96
              }
            }
          }
        },
        "queued": false,
        "running": false,
        "executor": null,
        "metrics": {
          "metrics.json": {
            "data": {
              "loss": 0.2309877723455429,
              "acc": 0.916100025177002
            }
          }
        },
        "name": "cnn-96"
      }
    }
```

Thus, you can get all details of the experiments in JSON and reuse them in other
commands. To show the metrics in the workspace and other commits, for example:

```dvc
$ dvc exp show --json | jq '.[].baseline.data.metrics'
{
  "metrics.json": {
    "data": {
      "loss": 0.236574187874794,
      "acc": 0.9126999974250793
    }
  }
}
{
  "metrics.json": {
    "data": {
      "loss": 0.236574187874794,
      "acc": 0.9126999974250793
    }
  }
}
```

## Get experiments table in CSV

`dvc exp show` can also output the table in CSV, with `--csv`. It includes all
the data found in the table.

```dvc
$ dvc exp show --csv
```

```csv
Experiment,rev,typ,Created,parent,loss,acc,train.epochs,model.conv_units
,workspace,baseline,,,0.236574187874794,0.9126999974250793,10,16
baseline-experiment,23ceb4a,baseline,2021-09-06T23:38:07,,0.236574187874794,0.9126999974250793,10,16
cnn-32,ca55d7d,branch_commit,2021-09-09T13:06:07,,0.2370404303073883,0.916700005531311,10,32
cnn-64,6d13f33,branch_commit,2021-09-09T13:06:05,,0.2338544875383377,0.9153000116348267,10,64
cnn-128,69503c6,branch_commit,2021-09-09T12:53:51,,0.2324332743883133,0.9160000085830688,10,128
cnn-96,49779aa,branch_base,2021-09-09T12:53:51,,0.2309877723455429,0.916100025177002,10,96
```

You can supply this output to other commands as well. For example with [csvkit],
you can get a summary statistics about the experiments.

```dvc
$ dvc exp show --csv | csvstat
...
7. "acc"

        Type of data:          Number
        Contains null values:  False
        Unique values:         5
        Smallest value:        0.9127
        Largest value:         0.9167
        Sum:                   5.4895
        Mean:                  0.914917
        Median:                0.91565
        StDev:                 0.001774
        Most common values:    0.9127 (2x)
                               0.9167 (1x)
                               0.9153 (1x)
                               0.9161 (1x)
                               0.916 (1x)
...
```

[csvkit]: https://csvkit.readthedocs.io/en/latest/

## Compare specific experiments

In addition to showing a summary table of experiments, DVC provides a command to
compare pairwise experiments. `dvc exp diff` is used to compare the experiments
by the change in their metrics and params.

```dvc
$ dvc exp diff
Path          Metric    Value    Change
metrics.json  acc       0.9151   0.0024
metrics.json  loss      0.23867  0.0020977

Path         Param             Value    Change
params.yaml  model.conv_units  256      240
```

Without experiment names, `dvc exp diff` shows the change between the last
experiment and the last commit. So if the command doesn't print an output, there
might be no experiment since the previous commit or it didn't produce changes in
results. If you want to see all the parameters and metrics regardless of whether
they have changed, you can use `--all` flag.

```dvc
$ dvc exp diff --all
Path          Metric    Value    Change
metrics.json  acc       0.9151   0.0024
metrics.json  loss      0.23867  0.0020977

Path         Param             Value    Change
params.yaml  model.conv_units  256      240
params.yaml  train.epochs      10       0
```

## Compare an experiment with the workspace

When you want to compare two experiments, either the baseline experiment in a
commit, branch, tag or an attached experiment with ID, you can supply their
names to `dvc exp diff`.

```
$ dvc exp diff exp-25a26 cnn-64
Path          Metric    Value    Change
metrics.json  acc       0.9153   0.00020003
metrics.json  loss      0.23385  -0.0048174

Path         Param             Value    Change
params.yaml  model.conv_units  64       -192
```

## Customize the output of diff table

By default `dvc exp diff` shows the metrics up to 5 significant digits. If you
want to set this to another value, you can use `--precision` option.

You can also hide the path of metrics and params files by `--no-path` flag. If
there is a single parameter or metrics file, it prints a cleaner table.

By using the both options, you can get:

```dvc
$ dvc exp diff exp-25a26 cnn-64 --no-path --precision 2
Metric    Value    Change
acc       0.92     0.0002
loss      0.23     -0.0048

Param             Value    Change
model.conv_units  64       -192
```

### Get a JSON list of changes to use in scripts

Parsing the `dvc exp diff` output may not be feasible due to the custom
structure. When you want to use the output in other commands, `dvc exp diff` can
output in JSON with `--json` flag.

```dvc
$ dvc exp diff exp-25a26 cnn-64 --json | jq
```

```json
{
  "metrics": {
    "metrics.json": {
      "loss": {
        "old": 0.2386719286441803,
        "new": 0.2338544875383377,
        "diff": -0.00481744110584259
      },
      "acc": {
        "old": 0.9150999784469604,
        "new": 0.9153000116348267,
        "diff": 0.00020003318786621094
      }
    }
  },
  "params": {
    "params.yaml": {
      "model.conv_units": {
        "old": 256,
        "new": 64,
        "diff": -192
      }
    }
  }
}
```

The output is a JSON dictionary with two keys, `metrics` and `params`, which
have dictionaries as values. `metrics` and `params` dictionaries has keys for
each of the metrics or params file, and for each file metrics and parameters are
listed as keys.

As an example, we can get only a specific metric from the `dvc exp diff` output
by

```dvc
$ dvc exp diff exp-25a26 cnn-64 --json | jq '.metrics."metrics.json".acc'
```

```json
{
  "old": 0.9150999784469604,
  "new": 0.9153000116348267,
  "diff": 0.00020003318786621094
}
```

### Get a Markdown table for the differences

`dvc exp diff` has also an option to output a [Github-Flavored Markdown][gfm]
table to embed in the reports directly.

[gfm]: https://github.github.com/gfm/

```dvc
$ dvc exp diff exp-25a26 cnn-64 --md
| Path         | Metric | Value   | Change     |
| ------------ | ------ | ------- | ---------- |
| metrics.json | acc    | 0.9153  | 0.00020003 |
| metrics.json | loss   | 0.23385 | -0.0048174 |


| Path        | Param            | Value | Change |
| ----------- | ---------------- | ----- | ------ |
| params.yaml | model.conv_units | 64    | -192   |
```
