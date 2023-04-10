---
title: 'Get Started: Metrics, Parameters, and Plots'
description: 'Get started with DVC parameters, metrics, and plots. Learn how to
capture, evaluate, and visualize ML projects without leaving Git.'
---

# Get Started: Metrics, Parameters, and Plots

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/bu3l75eQlQo

</details>

DVC makes it easy to track [metrics](/doc/command-reference/metrics), update
<abbr>parameters</abbr>, and visualize performance with
[plots](/doc/command-reference/plots). These concepts are introduced below.

<admon type="tip">

All of the above can be combined into [experiments] to run and compare many
iterations of your ML project.

[experiments]: /doc/start/experiments

</admon>

## Collecting metrics

First, let's see the mechanism to capture values for these ML attributes. Add
and run a final evaluation stage to our [earlier pipeline]:

```cli
$ dvc stage add -n evaluate \
  -d src/evaluate.py -d model.pkl -d data/features \
  -M eval/live/metrics.json -O eval/live/plots \
  -O eval/prc -o eval/importance.png \
  python src/evaluate.py model.pkl data/features

$ dvc repro
```

[earlier pipeline]: /doc/start/data-management/data-pipelines

<details>

### 💡 Expand to see what happens under the hood.

The `-O` option here specifies an output that will not be <abbr>cached</abbr> by
DVC, and `-M` specifies a metrics file (that will also not be cached).
`dvc stage add` generates a new stage in the `dvc.yaml` file:

```yaml
evaluate:
  cmd: python src/evaluate.py model.pkl data/features
  deps:
    - data/features
    - model.pkl
    - src/evaluate.py
  outs:
    - eval/importance.png
    - eval/live/plots:
        cache: false
    - eval/prc:
        cache: false
  metrics:
    - eval/live/metrics.json:
        cache: false
```

The biggest difference from previous stages in our pipeline is the new `metrics`
section. Metrics files contain scalar values (e.g. `AUC`) to compare across
iterations.

<admon type="info">

With `cache: false`, DVC skips caching the output, as we want these JSON metrics
files to be versioned by Git.

</admon>

</details>

[`evaluate.py`] writes the model's [ROC-AUC] and [average precision] to
`eval/live/metrics.json` (designated a [metrics file] with `-M` above):

```json
{
  "avg_prec": {
    "train": 0.9772271756725741,
    "test": 0.9449556493816984
  },
  "roc_auc": {
    "train": 0.9873675866013153,
    "test": 0.9619097316125981
  }
}
```

You can view tracked metrics with `dvc metrics show `:

```dvc
$ dvc metrics show
Path                    avg_prec.test    avg_prec.train    roc_auc.test    roc_auc.train
eval/live/metrics.json  0.94496          0.97723           0.96191         0.98737
```

[`evaluate.py`]:
  https://github.com/iterative/example-get-started/blob/master/src/evaluate.py
[roc-auc]:
  https://scikit-learn.org/stable/modules/model_evaluation.html#receiver-operating-characteristic-roc
[average precision]:
  https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-and-f-measures
[metrics file]: /doc/command-reference/metrics#supported-file-formats

## Visualizing plots

The stage also writes different files with data that can be graphed:

- [DVCLive]-generated [`roc_curve`] and [`confusion_matrix`] values in the
  `eval/live/plots` directory.
- Precision-recall curves as JSON arrays in `eval/prc/train.json`:

  ```json
  {
    "prc": [
      { "precision": 0.0215, "recall": 1.0, "threshold": 0.0 },
      { "precision": 1.0, "recall": 0.0093, "threshold": 0.6 },
      ...
  ```

- A custom `eval/importance.png` image showing a bar chart of features'
  importance.

You can visualize all of these with DVC! Start by [configuring the
plots][plots files] in `dvc.yaml`:

```yaml
plots:
  - ROC:
      template: simple
      x: fpr
      y:
        eval/live/plots/sklearn/roc/train.json: tpr
        eval/live/plots/sklearn/roc/test.json: tpr
  - Confusion-Matrix:
      template: confusion
      x: actual
      y:
        eval/live/plots/sklearn/cm/train.json: predicted
        eval/live/plots/sklearn/cm/test.json: predicted
  - Precision-Recall:
      template: simple
      x: recall
      y:
        eval/prc/train.json: precision
        eval/prc/test.json: precision
  - eval/importance.png
```

To generate them, you can run `dvc plots show` (shown below), which generates an
HTML file you can open in a browser. Or you can load your project in VS Code and
use the [DVC Extension]'s [Plots Dashboard].

```cli
$ dvc plots show
file:///Users/dvc/example-get-started/dvc_plots/index.html
```

![](/img/plots_prc_get_started_show.svg)
![](/img/plots_roc_get_started_show.svg)
![](/img/plots_importance_get_started_show.png '=500 :wrap-left')
![](/img/plots_cm_get_started_show.svg)

Let's save this iteration so we can compare it later:

```cli
$ git add .gitignore dvc.yaml dvc.lock eval
$ git commit -a -m "Create evaluation stage"
```

Later we will see how to
[compare and visualize different pipeline iterations](#comparing-iterations).
For now, let's see how to capture another important piece of information which
will be useful for comparison: parameters.

[dvclive]: /doc/dvclive
[`roc_curve`]:
  https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html
[`confusion_matrix`]:
  https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html
[plots files]: /doc/user-guide/project-structure/dvcyaml-files#plots
[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[dvc extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc

## Defining stage parameters

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

### ⚙️ Expand to recall how it was generated.

The `featurize` stage was created with this `dvc stage add` command. Notice the
argument sent to the `-p` option (short for `--params`):

```cli
$ dvc stage add -n featurize \
          -p featurize.max_features,featurize.ngrams \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features
```

</details>

The `params` section defines the parameter dependencies of the `featurize`
stage. By default, DVC reads those values (`featurize.max_features` and
`featurize.ngrams`) from a `params.yaml` file. But as with metrics and plots,
parameter file names and structure can also be user- and case-defined.

Here's the contents of our `params.yaml` file:

```yaml
prepare:
  split: 0.20
  seed: 20170428

featurize:
  max_features: 100
  ngrams: 1

train:
  seed: 20170428
  n_est: 50
  min_split: 2
```

## Updating params and iterating

We are definitely not happy with the AUC value we got so far! Let's edit the
`params.yaml` file to use bigrams and increase the number of features:

```git
 featurize:
-  max_features: 100
-  ngrams: 1
+  max_features: 200
+  ngrams: 2
```

The beauty of `dvc.yaml` is that all you need to do now is run:

```cli
$ dvc repro
```

It'll analyze the changes, use existing results from the <abbr>run cache</abbr>,
and execute only the commands needed to produce new results (model, metrics,
plots).

The same logic applies to other possible adjustments — edit source code, update
datasets — you do the changes, use `dvc repro`, and DVC runs what needs to be
run.

## Comparing iterations

Finally, let's see how the updates improved performance. DVC has a few commands
to see changes in and visualize metrics, parameters, and plots. These commands
can work for one or across multiple pipeline iteration(s). Let's compare the
current "bigrams" run with the last committed "baseline" iteration:

```cli
$ dvc params diff
Path         Param                   HEAD  workspace
params.yaml  featurize.max_features  100   200
params.yaml  featurize.ngrams        1     2
```

`dvc params diff` can show how params in the workspace differ vs. the last
commit.

`dvc metrics diff` does the same for metrics:

```cli
$ dvc metrics diff
Path                    Metric          HEAD     workspace    Change
eval/live/metrics.json  avg_prec.test   0.9014   0.925        0.0236
eval/live/metrics.json  avg_prec.train  0.95704  0.97437      0.01733
eval/live/metrics.json  roc_auc.test    0.93196  0.94602      0.01406
eval/live/metrics.json  roc_auc.train   0.97743  0.98667      0.00924
```

And finally, we can compare all plots with a single command (we show only some
of them for simplicity):

```cli
$ dvc plots diff
file:///Users/dvc/example-get-started/plots.html
```

![](/img/plots_prc_get_started_diff.svg)
![](/img/plots_importance_get_started_diff.png)

> See `dvc plots diff` for more info on its options.

> All these commands also accept
> [Git revisions](https://git-scm.com/docs/gitrevisions) (commits, tags, branch
> names) to compare.

On the next page, you can learn advanced ways to track, organize, and compare
more experiment iterations.
