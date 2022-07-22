---
title: 'Get Started: Metrics, Parameters, and Plots'
---

# Get Started: Metrics, Parameters, and Plots

DVC makes it easy to track [metrics](/doc/command-reference/metrics), update
<abbr>parameters</abbr>, and visualize performance with
[plots](/doc/command-reference/plots). These concepts are introduced below.

> All of the above can be combined into <abbr>experiments</abbr> to run and
> compare many iterations of your ML project.

https://youtu.be/bu3l75eQlQo

## Collecting metrics

First, let's see what is the mechanism to capture values for these ML
attributes. Let's add a final evaluation stage to our
[pipeline from before](/doc/start/data-pipelines):

```dvc
$ dvc run -n evaluate \
          -d src/evaluate.py -d model.pkl -d data/features \
          -M evaluation.json \
          --plots-no-cache evaluation/plots/precision_recall.json \
          --plots-no-cache evaluation/plots/roc.json \
          --plots-no-cache evaluation/plots/confusion_matrix.json \
          --plots evaluation/importance.png \
          python src/evaluate.py model.pkl data/features
```

<details>

### 💡 Expand to see what happens under the hood.

The `-M` option here specifies a metrics file, while `--plots-no-cache`
specifies a plots file (produced by this stage) which will not be
<abbr>cached</abbr> by DVC. `dvc run` generates a new stage in the `dvc.yaml`
file:

```yaml
evaluate:
  cmd: python src/evaluate.py model.pkl data/features
  deps:
    - data/features
    - model.pkl
    - src/evaluate.py
  metrics:
    - evaluation.json:
        cache: false
  plots:
    - evaluation/importance.png
    - evaluation/plots/confusion_matrix.json:
        cache: false
    - evaluation/plots/precision_recall.json:
        cache: false
    - evaluation/plots/roc.json:
        cache: false
```

The biggest difference to previous stages in our pipeline is in two new
sections: `metrics` and `plots`. These are used to mark certain files containing
ML "telemetry". Metrics files contain scalar values (e.g. `AUC`) and plots files
contain matrices, data series (e.g. `ROC curves` or model loss plots), or images
to be visualized and compared.

> With `cache: false`, DVC skips caching the output, as we want
> `evaluation.json`, `precision_recall.json`, `confusion_matrix.json`, and
> `roc.json` to be versioned by Git.

</details>

[`evaluate.py`](https://github.com/iterative/example-get-started/blob/master/src/evaluate.py)
writes the model's
[ROC-AUC](https://scikit-learn.org/stable/modules/model_evaluation.html#receiver-operating-characteristic-roc)
and
[average precision](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-and-f-measures)
to `evaluation.json`, which in turn is marked as a `metrics` file with `-M`. Its
contents are:

```json
{ "avg_prec": 0.5204838673030754, "roc_auc": 0.9032012604172255 }
```

`evaluate.py` also writes `precision`, `recall`, and `thresholds` arrays
(obtained using
[`precision_recall_curve`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html))
into the plots file `precision_recall.json`:

```json
{
  "prc": [
    { "precision": 0.021473008227975116, "recall": 1.0, "threshold": 0.0 },
    ...,
    { "precision": 1.0, "recall": 0.009345794392523364, "threshold": 0.6 }
  ]
}
```

Similarly, it writes arrays for the
[roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html)
into `roc.json`,
[confusion matrix](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html)
into `confusion_matrix.json`, and an image `importance.png` with a feature
importance bar chart for additional plots.

> DVC doesn't force you to use any specific file names, nor does it enforce a
> format or structure of a metrics or plots file. It's completely
> user/case-defined. Refer to `dvc metrics` and `dvc plots` for more details.

You can view tracked metrics and plots with DVC. Let's start with the metrics:

```dvc
$ dvc metrics show
Path             avg_prec    roc_auc
evaluation.json  0.89668     0.92729
```

To view plots, first specify which arrays to use as the plot axes. We only need
to do this once, and DVC will save our plot configurations.

```dvc
$ dvc plots modify evaluation/plots/precision_recall.json \
                   -x recall -y precision
Modifying stage 'evaluate' in 'dvc.yaml'
$ dvc plots modify evaluation/plots/roc.json -x fpr -y tpr
Modifying stage 'evaluate' in 'dvc.yaml'
$ dvc plots modify evaluation/plots/confusion_matrix.json \
                   -x actual -y predicted -t confusion
Modifying stage 'evaluate' in 'dvc.yaml'

```

Now let's view the plots. You can run `dvc plots show` on you terminal (shown
below), which generates an HTML file you can open in a browser. Or you can load
your project in VS Code and use the [Plots Dashboard] of the [DVC Extension] to
visualize them.

```dvc
$ dvc plots show
file:///Users/dvc/example-get-started/dvc_plots/index.html
```

![](/img/plots_prc_get_started_show.svg)
![](/img/plots_roc_get_started_show.svg)
![](/img/plots_importance_get_started_show.png '=300 :wrap-left')
![](/img/plots_cm_get_started_show.svg)

Let's save this iteration, so we can compare it later:

```dvc
$ git add scores.json prc.json roc.json
$ git commit -a -m "Create evaluation stage"
```

Later we will see how to
[compare and visualize different pipeline iterations](#comparing-iterations).
For now, let's see how can we capture another important piece of information
which will be useful for comparison: parameters.

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

```dvc
$ dvc repro
```

It'll analyze the changes, use existing results from the <abbr>run-cache</abbr>,
and execute only the commands needed to produce new results (model, metrics,
plots).

The same logic applies to other possible adjustments — edit source code, update
datasets — you do the changes, use `dvc repro`, and DVC runs what needs to be.

## Comparing iterations

Finally, let's see how the updates improved performance. DVC has a few commands
to see changes in and visualize metrics, parameters, and plots. These commands
can work for one or across multiple pipeline iteration(s). Let's compare the
current "bigrams" run with the last committed "baseline" iteration:

```dvc
$ dvc params diff
Path         Param                   HEAD  workspace
params.yaml  featurize.max_features  100   200
params.yaml  featurize.ngrams        1     2
```

`dvc params diff` can show how params in the workspace differ vs. the last
commit.

`dvc metrics diff` does the same for metrics:

```dvc
$ dvc metrics diff
Path             Metric    HEAD      workspace    Change
evaluation.json  avg_prec  0.89668   0.9202       0.02353
evaluation.json  roc_auc   0.92729   0.94096      0.01368
```

And finally, we can compare all plots with a single command (we show only some
of them for simplicity):

```dvc
$ dvc plots diff
file:///Users/dvc/example-get-started/plots.html
```

![](/img/plots_prc_get_started_diff.svg)
![](/img/plots_roc_get_started_diff.svg)
![](/img/plots_importance_get_started_diff.png)

> See `dvc plots diff` for more info on its options.

> All these commands also accept
> [Git revisions](https://git-scm.com/docs/gitrevisions) (commits, tags, branch
> names) to compare.

On the next page, you can learn advanced ways to track, organize, and compare
more experiment iterations.
