# Reviewing and Comparing Experiments

DVC provides commands to list, tabulate and contrast experiments. Let's see how
they can help you streamline the experimentation process.

<admon type="tip">

**New!** You can compare your ML experiments with DVC directly [from Visual
Studio Code].

https://www.youtube.com/watch?v=LHi3SWGD9nc

[from visual studio code]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc

</admon>

## List experiments in the project

You can get a list of existing experiments in the <abbr>repository</abbr> with
`dvc exp list`. Without any options, this command lists the experiments based on
the latest commit of the current branch (Git `HEAD`).

```cli
$ dvc exp list
refs/tags/baseline-experiment:
    2399f24 [cnn-128]
    f1edf21 [cnn-64]
```

If you want to list all the experiments in the repo regardless of their parent
commit, use the `--all-commits` (`-A`) flag.

```cli
$ dvc exp list -A
refs/tags/baseline-experiment:
    2399f24 [cnn-128]
    f1edf21 [cnn-64]
main:
    1f7e42f [toric-chiv]
```

## List experiments saved remotely

Experiments can be [shared] (with `dvc exp push`) from another location. To
review experiments uploaded to a remote <abbr>repository</abbr> (which you may
not have locally), provide a Git remote name to `dvc exp list`.

```cli
$ dvc exp list origin
refs/tags/baseline-experiment:
    cnn-32
    cnn-64
```

This command lists remote experiments based on that repo's `HEAD`. You can use
`--all-commits` (`-A`) to list all experiments, or add any other supported
option to the remote `dvc exp list` command.

[shared]: /doc/user-guide/experiment-management/sharing-experiments

## List experiment names to use in scripts

`dvc exp list` may be printing too much information when it comes to feed its
output to other commands. You can get only the names of the experiments via the
`--name-only` flag. For example, to download the model files from all
experiments in a remote:

```cli
$ for name in $(dvc exp list origin --name-only -A); do
    dvc get --rev ${name} \
            git@github.com:iterative/example-dvc-experiments.git \
            models/model.h5 -o exps/${name}.h5
done
```

## List experiments from a specific project version

The `--rev` option allows to specify a Git commit, tag or branch name to list
the experiments that are based on it. For example:

```cli
# from a commit:
$ dvc exp list origin --rev 23ceb4a
23ceb4a:
    cnn-32
    cnn-96

# from a tag:
$ dvc exp list origin --rev baseline-experiment
refs/tags/baseline-experiment:
    cnn-64
    cnn-128

# from a fully specified Git reference:
$ dvc exp list origin --rev refs/tags/baseline-experiment
refs/tags/baseline-experiment:
    cnn-64
    cnn-128
```

## Show a table of experiments

Experimentation is about generating many possibilities before selecting a few of
them. You can get a table of experiments with `dvc exp show`, which displays all
the metrics (yellow), parameters (blue) and <abbr>dependencies</abbr> (violet)
in a nicely formatted table.

```cli
$ dvc exp show
```

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**              neutral:**Created**            metric:**loss**      metric:**acc**   param:**train.epochs**   param:**model.conv_units**   dep:**src**       dep:**data**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace               -               0.03332   0.9888   10             16                 695e061   6875529
  baseline-experiment     Jan 14, 2022    0.03332   0.9888   10             16                 695e061   6875529
  ├── 38d6c53 [cnn-64]    Jan 19, 2022   0.038246    0.988   10             64                 c77a505   6875529
  └── bc0faf5 [cnn-128]   Jan 19, 2022   0.038325    0.989   10             128                bc75d6a   6875529
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

`dvc exp show` only tabulates experiments in the workspace and in `HEAD`. You
can use `--all-commits` (`-A`) flag to show all the experiments in the project
instead.

Note that [queued experiments] will be marked with an asterisk `*`.

[queued experiments]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue

## Customize the table of experiments

The table output may become cluttered if you have a large number of metrics,
parameters and dependencies. `dvc exp show` provides several options to select
the columns to be shown in the table.

As a quick way of reducing noise, `dvc exp show --only-changed` will drop any
column with values that do not change across experiments:

```cli
$ dvc exp show --only-changed
```

```dvctable
 ───────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**              neutral:**Created**            metric:**loss**      metric:**acc**    param:**model.conv_units**
 ───────────────────────────────────────────────────────────────────────────────
  workspace               -               0.03332   0.9888    16
  baseline-experiment     Jan 14, 2022    0.03332   0.9888    16
  ├── 38d6c53 [cnn-64]    Jan 19, 2022   0.038246    0.988    64
  └── bc0faf5 [cnn-128]   Jan 19, 2022   0.038325    0.989    128
 ───────────────────────────────────────────────────────────────────────────────
```

You can also exclude unwanted columns from the table by using the `--drop`
option. Or make sure that the table includes important columns with `--keep`.

See more examples in the
[`dvc exp show` reference](/doc/command-reference/exp/show#examples).

By default `dvc exp show` sorts the experiments by their timestamp. You can sort
the metrics or parameters columns by the option `--sort-by` and `--sort-order`.
`--sort-by` takes a metric or parameter name, and `--sort-order` takes either
`asc` or `desc`.

```cli
$ dvc exp show --sort-by auc --sort-order desc
```

```dvctable
 ───────────────────────────────────────────────────
  neutral:**Experiment**                 metric:**acc**   param:**model.conv_units**
 ───────────────────────────────────────────────────
  workspace               0.9127   16
  baseline-experiment     0.9127   16
  ├── 6d13f33 [cnn-64]    0.9153   64
  └── 69503c6 [cnn-128]    0.916   128
 ───────────────────────────────────────────────────
```

## Get experiments table in CSV

`dvc exp show` can also output the table in CSV, with `--csv`. It includes all
the data found in the table.

```cli
$ dvc exp show --csv
```

```csv
Experiment,rev,typ,Created,parent,loss,acc,train.epochs,model.conv_units
,workspace,baseline,,,0.236574187874794,0.9126999974250793,10,16
baseline-experiment,23ceb4a,baseline,2021-09-06T23:38:07,,0.236574187874794,0.9126999974250793,10,16
cnn-64,6d13f33,branch_commit,2021-09-09T13:06:05,,0.2338544875383377,0.9153000116348267,10,64
cnn-128,69503c6,branch_commit,2021-09-09T12:53:51,,0.2324332743883133,0.9160000085830688,10,128
```

For example, let's parse the CSV output with [csvkit] to get a statistical
summary about the experiments:

```cli
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

## Get table data in JSON

It's also possible to output the table of experiments in a machine-readable
format, for example to parse in scripts. To do so, use the `--json` or `--csv`
options.

```cli
$ dvc exp show --json
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
        "name": "cnn-64"
      }
    }
```

As an example, let's feed our experiments to JSON-parsing tool
[jq](https://stedolan.github.io/jq/) and filter through only metrics:

```cli
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

## Compare specific experiments

In addition to showing a summary table of experiments, DVC provides the
`dvc exp diff` command to compare pairs of experiments by the difference in
their metrics and params.

```cli
$ dvc exp diff
Path          Metric  HEAD     workspace  Change
metrics.json  acc     0.9127   0.9151     0.0024
metrics.json  loss    0.23657  0.23867    0.0020977

Path         Param             HEAD  workspace  Change
params.yaml  model.conv_units  16    256        240
```

Without experiment names, `dvc exp diff` shows the change between the last
experiment (`workspace`) and the last commit (`HEAD`). So if the command doesn't
print an output, there might be no experiment since the previous commit or it
didn't produce changes in results. If you want to see all the parameters and
metrics regardless of whether they have changed, you can use `--all` flag.

```cli
$ dvc exp diff --all
Path          Metric  HEAD     workspace  Change
metrics.json  acc     0.9127   0.9151     0.0024
metrics.json  loss    0.23657  0.23867    0.0020977

Path         Param             HEAD  workspace  Change
params.yaml  model.conv_units  16    256        240
params.yaml  train.epochs      10    10         0
```

## Compare an experiment with the workspace

When you want to compare two experiments, either the baseline experiment in a
commit, branch, or tag; or an attached experiment by name, you can supply any of
these references to `dvc exp diff`.

```
$ dvc exp diff cnn-128 cnn-64
Path          Metric  cnn-128  cnn-64   Change
metrics.json  acc     0.9151   0.9153   0.00020003
metrics.json  loss    0.23867  0.23385  -0.0048174

Path         Param             cnn-128  cnn-64  Change
params.yaml  model.conv_units  128      64      -64
```

## Customize the comparison output

You can hide the file path of metrics and parameter files the `--no-path` option
-- produces cleaner output for single params/metrics files, for example. You can
also customize the amount of significant digits shown for numeric values with
the `--precision` option (5 by default).

```cli
$ dvc exp diff puffy-daks cnn-64 --no-path --precision 2
Metric    puffy-daks  cnn-64  Change
acc       0.92        0.92    0.0002
loss      0.23        0.23    -0.0048

Param             puffy-daks  Value  Change
model.conv_units  256         64     -192
```

### Get the comparison in JSON

Parsing the output of `dvc exp diff` may not be easy when you want to use it in
other commands. `dvc exp diff` can output in JSON with `--json` flag.

```cli
$ dvc exp diff puffy-daks cnn-64 --json
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
have dictionaries as values. `metrics` and `params` dictionaries have keys for
each of the metrics or parameters files, and for each file metrics and
parameters are listed as keys.

As an example, we can get only a specific metric with
[jq](https://stedolan.github.io/jq/):

```cli
$ dvc exp diff puffy-daks cnn-64 --json | jq '.metrics."metrics.json".acc'
{
  "old": 0.9150999784469604,
  "new": 0.9153000116348267,
  "diff": 0.00020003318786621094
}
```

### Get the comparison in Markdown table format

`dvc exp diff` has also an option to output a [Github-Flavored Markdown][gfm]
table to embed in the reports directly.

[gfm]: https://github.github.com/gfm/#tables-extension-

```cli
$ dvc exp diff puffy-daks cnn-64 --md
| Path         | Metric | puffy-daks | cnn-64  | Change     |
| ------------ | ------ | ---------- | ------- | ---------- |
| metrics.json | acc    | 0.9151     | 0.9153  | 0.00020003 |
| metrics.json | loss   | 0.23867    | 0.23385 | -0.0048174 |


| Path        | Param            | puffy-daks | cnn-64 | Change |
| ----------- | ---------------- | ---------- | ------ | ------ |
| params.yaml | model.conv_units | 256        | 64     | -192   |
```

You can use this output to automatically update the documents with a command
like:

```cli
$ dvc exp diff puffy-daks cnn-64 --md | xargs --replace=DIFFTABLE -- sed -i -e 's/EXPERIMENT_RESULT/DIFFTABLE/' my-template.md
```
