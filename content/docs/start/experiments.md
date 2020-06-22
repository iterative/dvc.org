# Experiments

DVC makes it easy to iterate on your project using Git commits, tags, or
branches. It provides a way to try different ideas fast by tuning
[parameters](/doc/command-reference/params), compare their performance with
[metrics](/doc/command-reference/metrics), visualize with
[plots](/doc/command-reference/plots), and switch between them easily with Git.

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

### 💡 Expand to see what happens under the hood

It's pretty much the same as before, it generates a new stage in the `dvc.yaml`
file:

```yaml
evaluate:
  cmd: python src/evaluate.py model.pkl data/features scores.json prc.json
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

The biggest difference is that we see two new sections `metrics` and `plots`
that are used to mark certain files containing experiment "telemetry". Metric
files contain scalars (e.g. `AUC`) and plots contain matrices and arrays of
numbers that are supposed to be visualized to compare or make sense of them.

`cache: false` means that those file are small enough and versioned directly
with Git.

</details>

DVC expects `evaluate.py` to
[write](https://github.com/iterative/example-get-started/blob/master/src/evaluate.py#L35)
model
[AUC](https://towardsdatascience.com/understanding-auc-roc-curve-68b2303cc9c5)
value to the `scores.json` file which is marked as a metrics file with `-M`:

```json
{ "auc": 0.57313829 }
```

And it
[writes](https://github.com/iterative/example-get-started/blob/master/src/evaluate.py#L31)
`precision`, `recall`, `thresholds` arrays it gets with the
[`precision_recall_curve`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html)
call into the `prc.json`:

```json
{
  "prc": [
    { "precision": 0.021473008227975116, "recall": 1.0, "threshold": 0.0 },
    ...{ "precision": 1.0, "recall": 0.009345794392523364, "threshold": 0.64 }
  ]
}
```

> DVC doesn't force you to use any specific file names, or even format or
> structure of a metrics or plots file - it's pretty much user and case defined,
> please, refer to `dvc metrics` and `dvc plots` documentation for more details.

Let's save this experiment to compare it later using DVC comparison commands:

```dvc
$ git add scores.json prc.json
$ git commit -a -m "Create evaluation stage"
```

We've managed to capture metrics that experiment has, and later we will see how
this information can be used to compare different experiment iterations,
visualize them (e.g. `ROC` or model loss plots). Let's see how can we capture
another important piece of information that will be important to compare
experiments - experiment parameters.

## Defining parameters

It's pretty common for data processing pipelines to use a separate YAML or JSON
config file that defines adjustable parameters you use to train a model, do
pre-processing, etc. DVC provides a mechanism for a stage to depend on values
from such a config file. That's how stage is defined in the `dvc.yaml` file:

<details>

### 💡 Expand to recall how it was generated

As a reminder, the `featurize` stage was created with this command. No need to
run it again, but pay more attention to the `-p` option this time:

```dvc
$ dvc run -n featurize \
          -p featurize.max_features,featurize.ngrams \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features
```

</details>

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

`params` section (and the corresponding `-p` `dvc run` option) is an example of
the [parameters](/doc/command-reference/params) dependency. By default DVC reads
those values (`featurize.max_features` and `featurize.ngrams`) from the
`params.yaml`. But as in the case with metrics and plots files, file name and
structure are user and case defined for these configuration files. This is how
`params.yaml` file looks like in our case:

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

We are definitely not happy with the `AUC` value, we got so far! Let's now tune
and run the new experiment. Edit the `params.yaml` file to use bigrams and
increase number of features:

```diff
 featurize:
-  max_features: 500
-  ngrams: 1
+  max_features: 1500
+  ngrams: 2
```

And the beauty of the `dvc.yaml` file is that all you need to do now is to run:

```dvc
$ dvc repro
```

It'll analyze changes, will analyze existing cache of previous runs and will run
only commands that are needed to get the new result (model, metrics, plots).

The same logic applies to other possible experiment adjustments - edit source
code, edit or update dataset - you do the changes, run `dvc repro` and it runs
what needs to be run.

## Comparing experiments

Finally, we are now ready to compare experiments. DVC has a few commands to see
metrics and parameter changes, visualize plots for one or more experiments.
Let's compare the last "bigrams" run with the last committed "baseline"
iteration:

```dvc
$ dvc params diff
Path         Param                   Old    New
params.yaml  featurize.max_features  500    1500
params.yaml  featurize.ngrams        1      2
```

`dvc params diff` can show how params differ in the workspace vs the last
commit. `dvc metrics diff` does the same for metrics:

```dvc
$ dvc metrics diff
Path         Metric    Value    Change
scores.json  auc       0.61314  0.07139
```

And finally, we can compare `ROC` curves with a single command!

```dvc
$ dvc plots diff
file:///Users/dvc/example-get-started/plots.html
```

![](/img/plots_roc_get_started.svg)

All these commands also accept Git revisions to compare - tags, commits, branch
names and together provide a powerful mechanism to navigate your experiments to
see the history, to pick the best, etc.
