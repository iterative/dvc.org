# Experiments

DVC makes it easy to iterate on your project using Git commits, tags, or
branches. You can try different ideas quickly by tuning
[parameters](/doc/command-reference/params), compare their performance with
[metrics](/doc/command-reference/metrics), and visualize them with
[plots](/doc/command-reference/plots).

Read on or watch our video to see how it's done!

https://youtu.be/iduHPtBncBk

## Collecting metrics

First, let's see what is the mechanism to capture values for these ML experiment
attributes. Let's add a final evaluation stage to our
[pipeline](/doc/tutorials/get-started/data-pipelines#dependency-graphs-dags):

```dvc
$ dvc run -n evaluate \
          -d src/evaluate.py -d model.pkl -d data/features \
          -M scores.json \
          --plots-no-cache prc.json \
          python src/evaluate.py model.pkl \
                 data/features scores.json prc.json
```

<details>

### 💡 Expand to see what happens under the hood.

The `-M` option here specifies a metrics file, while `--plots-no-cache`
specifies a plots file produced by this stage that will not be
<abbr>cached</abbr> by DVC. `dvc run` generates a new stage in the `dvc.yaml`
file:

```yaml
evaluate:
  cmd: python src/evaluate.py model.pkl data/features ...
  deps:
    - data/features
    - model.pkl
    - src/evaluate.py
  metrics:
    - scores.json:
        cache: false
  plots:
    - prc.json:
        cache: false
```

The biggest difference to previous stages in our pipeline is in two new
sections: `metrics` and `plots`. These are used to mark certain files containing
experiment "telemetry". Metrics files contain simple numeric values (e.g. `AUC`)
and plots files contain matrices and data series (e.g. `ROC` or model loss
plots) that are meant to be visualized and compared.

> With `cache: false`, DVC skips caching the output, as we want `scores.json`
> and `prc.json` to be versioned by Git.

</details>

[`evaluate.py`](https://github.com/iterative/example-get-started/blob/master/src/evaluate.py)
writes the model's
[AUC value](https://towardsdatascience.com/understanding-auc-roc-curve-68b2303cc9c5)
to `scores.json`, which is marked as a metrics file with `-M`:

```json
{ "auc": 0.57313829 }
```

It also writes `precision`, `recall`, and `thresholds` arrays (obtained using
[`precision_recall_curve`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html))
into plots file `prc.json`:

```json
{
  "prc": [
    { "precision": 0.021473008227975116, "recall": 1.0, "threshold": 0.0 },
    ...,
    { "precision": 1.0, "recall": 0.009345794392523364, "threshold": 0.64 }
  ]
}
```

> DVC doesn't force you to use any specific file names, or even format or
> structure of a metrics or plots file - it's pretty much user and case defined.
> Please refer to `dvc metrics` and `dvc plots` for more details.

Let's save this experiment, so we can compare it later:

```dvc
$ git add scores.json prc.json
$ git commit -a -m "Create evaluation stage"
```

Later we will see how these and other can be used to compare and visualize
different experiment iterations. For now, let's see how can we capture another
important piece of information that will be useful to compare experiments:
parameters.

## Defining parameters

It's pretty common for data science pipelines to include configuration files
that define adjustable parameters to train a model, do pre-processing, etc. DVC
provides a mechanism for stages to depend on the values of specific sections of
such a config file (YAML, JSON, TOML, and Python formats are supported).

Luckily, we should already have a stage with
[parameters](/doc/command-reference/params) in `dvc.yaml`:

```yaml
featurize:
  cmd: python src/featurization.py data/prepared data/features
  deps:
    - data/prepared
    - src/featurization.py
  params:
    - featurize.max_features
    - featurize.ngrams
  outs:
    - data/features
```

<details>

### 💡 Expand to recall how it was generated.

The `featurize` stage
[was created](/doc/start/data-pipelines#dependency-graphs-dags) with this
`dvc run` command. Notice the argument sent to the `-p` option (short for
`--params`):

```dvc
$ dvc run -n featurize \
          -p featurize.max_features,featurize.ngrams \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features
```

</details>

The `params` section defines the [parameter](/doc/command-reference/params)
dependencies of the `featurize` stage. By default DVC reads those values
(`featurize.max_features` and `featurize.ngrams`) from a `params.yaml` file. But
as with metrics and plots, parameter file names and structure can also be user
and case defined.

This is how our `params.yaml` file looks like:

```yaml
prepare:
  split: 0.20
  seed: 20170428

featurize:
  max_features: 500
  ngrams: 1

train:
  seed: 20170428
  n_estimators: 50
```

## Tuning and running experiments

We are definitely not happy with the `AUC` value we got so far! Let's now tune
and run the new experiment. Edit the `params.yaml` file to use bigrams and
increase the number of features:

```diff
 featurize:
-  max_features: 500
-  ngrams: 1
+  max_features: 1500
+  ngrams: 2
```

And the beauty of `dvc.yaml` is that all you need to do now is to run:

```dvc
$ dvc repro
```

It'll analyze the changes, use existing cache of previous runs, and execute only
the commands that are needed to get the new results (model, metrics, plots).

The same logic applies to other possible experiment adjustments — edit source
code, update datasets — you do the changes, use `dvc repro`, and DVC runs what
needs to be run.

## Comparing experiments

Finally, we are now ready to compare everything! DVC has a few commands to see
metrics and parameter changes, and to visualize plots, for one or more
experiments. Let's compare the current "bigrams" run with the last committed
"baseline" iteration:

```dvc
$ dvc params diff
Path         Param                   Old    New
params.yaml  featurize.max_features  500    1500
params.yaml  featurize.ngrams        1      2
```

`dvc params diff` can show how params in the workspace differ vs. the last
commit.

`dvc metrics diff` does the same for metrics:

```dvc
$ dvc metrics diff
Path         Metric    Value    Change
scores.json  auc       0.61314  0.07139
```

And finally, we can compare `precision recall` curves with a single command!

```dvc
$ dvc plots diff -x recall -y precision
file:///Users/dvc/example-get-started/plots.html
```

![](/img/plots_prc_get_started.svg)

All these commands also accept
[Git revisions](https://git-scm.com/docs/gitrevisions) (commits, tags, branch
names) to compare. This is a powerful mechanism for navigating experiments to
see the history, to pick the best ones, etc.

> See `dvc plots diff` for more info on its options, such as `-x` and `-y` used
> above.
